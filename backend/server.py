from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
from typing import Optional, List, Dict
import json
import logging
import re
import uuid
from datetime import datetime
from pathlib import Path

from tools import tools, handle_tool_calls

logger = logging.getLogger("twin.server")

# Strips ASCII control chars (keeps \n, \r, \t) so stored/returned text can't
# smuggle terminal escapes or corrupt the JSON memory files.
_CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def sanitize_text(text: str) -> str:
    return _CONTROL_CHARS.sub("", text).strip()

# Load environment variables
load_dotenv(override=True)

app = FastAPI()

# Configure CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI()

# Admin token gating /sessions; unset means the endpoint is disabled
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")

BASE_DIR = Path(__file__).resolve().parent

# Memory directory
MEMORY_DIR = BASE_DIR.parent / "memory"
MEMORY_DIR.mkdir(exist_ok=True)


# Load personality details
def load_personality():
    with open(BASE_DIR / "me.txt", "r", encoding="utf-8") as f:
        return f.read().strip()


PERSONALITY = load_personality()

SYSTEM_PROMPT = f"""
# Your role

You are a digital twin running on a website, chatting with visitors of the website.
You represent the person described below, and answer questions about their career,
background, skills, and experience.

{PERSONALITY}

If asked, explain clearly that you are an AI digital twin of this person, not the person themselves.

# Rules

- Be professional, concise, and clean. Answer directly in as few sentences as the question
  allows — skip filler openers ("Great question!", "I'd be happy to help...") and get straight
  to the answer.
- Use light markdown (bold, short bullet lists) only where it improves scannability. No headers,
  no code blocks, no walls of text.
- Only answer questions related to career, background, skills, and experience. Steer unrelated
  questions back to those topics.
- Stay in character as the digital twin at all times: speak in the first person ("I..."), as
  the person themselves, never describing them in the third person.
- If the visitor wants to get in touch, ask for their email and record it with your tool.
- If you don't know the answer, say so plainly and record the question — never make one up.
""".strip()


# Memory functions
def load_conversation(session_id: str) -> List[Dict]:
    """Load conversation history from file"""
    file_path = MEMORY_DIR / f"{session_id}.json"
    if file_path.exists():
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_conversation(session_id: str, messages: List[Dict]):
    """Save conversation history to file"""
    file_path = MEMORY_DIR / f"{session_id}.json"
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(messages, f, indent=2, ensure_ascii=False)


# Request/Response models
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    session_id: str


@app.get("/")
async def root():
    return {"message": "AI Digital Twin API with Memory"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # Generate session ID if not provided
    session_id = request.session_id or str(uuid.uuid4())

    # session_id becomes a filename below, so it must be a bare UUID
    # (no path separators or "..") before it touches the filesystem.
    try:
        uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="session_id must be a valid UUID")

    try:
        # Load conversation history
        conversation = load_conversation(session_id)

        # Build messages with history
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        # Add conversation history
        for msg in conversation:
            messages.append(msg)

        # Add current message
        user_message = sanitize_text(request.message)
        if not user_message:
            raise HTTPException(status_code=400, detail="message must not be empty")
        messages.append({"role": "user", "content": user_message})

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=messages,
            tools=tools,
        )

        while response.choices[0].finish_reason == "tool_calls":
            message = response.choices[0].message
            results = handle_tool_calls(message.tool_calls)
            messages.append(message)
            messages.extend(results)
            response = client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=messages,
                tools=tools,
            )

        assistant_response = sanitize_text(response.choices[0].message.content or "")

        # Update conversation history
        conversation.append({"role": "user", "content": user_message})
        conversation.append({"role": "assistant", "content": assistant_response})
        
        # Save updated conversation
        save_conversation(session_id, conversation)
        
        return ChatResponse(
            response=assistant_response,
            session_id=session_id
        )

    except HTTPException:
        raise
    except Exception:
        logger.exception("Chat request failed (session_id=%s)", session_id)
        raise HTTPException(status_code=500, detail="Something went wrong. Please try again.")


@app.get("/sessions")
async def list_sessions(x_admin_token: Optional[str] = Header(None)):
    """List all conversation sessions (admin only)"""
    if not ADMIN_TOKEN or x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=404, detail="Not found")

    sessions = []
    for file_path in MEMORY_DIR.glob("*.json"):
        session_id = file_path.stem
        with open(file_path, "r", encoding="utf-8") as f:
            conversation = json.load(f)
            sessions.append({
                "session_id": session_id,
                "message_count": len(conversation),
                "last_message": conversation[-1]["content"] if conversation else None
            })
    return {"sessions": sessions}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)