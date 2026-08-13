import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { buildSystemPrompt } from "@/lib/systemPrompt";
import { tools, handleToolCalls } from "@/lib/tools";

export const runtime = "nodejs";

const MODEL_NAME = process.env.OPENAI_MODEL || "gpt-4o-mini";

let openai: OpenAI | undefined;
function getOpenAI(): OpenAI {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

type IncomingMessage = { role: "user" | "assistant"; content: string };

const MAX_TOOL_ROUNDS = 5;

export async function POST(req: NextRequest) {
  let body: { messages?: IncomingMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const history = body.messages;
  if (!Array.isArray(history) || history.length === 0) {
    return NextResponse.json({ error: "messages must be a non-empty array" }, { status: 400 });
  }

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: buildSystemPrompt() },
    ...history.map((m) => ({ role: m.role, content: m.content }) as ChatCompletionMessageParam),
  ];

  try {
    const client = getOpenAI();
    let response = await client.chat.completions.create({
      model: MODEL_NAME,
      messages,
      tools,
    });

    let rounds = 0;
    while (response.choices[0].finish_reason === "tool_calls" && rounds < MAX_TOOL_ROUNDS) {
      const message = response.choices[0].message;
      const toolCalls = message.tool_calls ?? [];
      const results = await handleToolCalls(toolCalls);

      messages.push(message);
      messages.push(...results);

      response = await client.chat.completions.create({
        model: MODEL_NAME,
        messages,
        tools,
      });
      rounds++;
    }

    const reply = response.choices[0].message.content ?? "";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat completion failed:", err);
    return NextResponse.json({ error: "Something went wrong talking to the model." }, { status: 502 });
  }
}
