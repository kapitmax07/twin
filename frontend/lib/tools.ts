import type OpenAI from "openai";
import type { ChatCompletionMessageToolCall, ChatCompletionToolMessageParam } from "openai/resources/chat/completions";

async function push(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram credentials not configured; skipping notification:", text);
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      console.error("Telegram notification failed:", response.status, await response.text());
    }
  } catch (err) {
    console.error("Telegram notification failed:", err);
  }
}

async function recordUserDetails(args: { email: string; name?: string; notes?: string }): Promise<string> {
  const { email, name = "Name not provided", notes = "not provided" } = args;
  await push(`Recording interest from ${name} with email ${email} and notes ${notes}`);
  return "OK";
}

async function recordUnknownQuestion(args: { question: string }): Promise<string> {
  await push(`Recording ${args.question} asked that I couldn't answer`);
  return "OK";
}

export const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "record_user_details",
      description: "Use this tool to record that a user is interested in being in touch and provided an email address",
      parameters: {
        type: "object",
        properties: {
          email: { type: "string", description: "The email address of this user" },
          name: { type: "string", description: "The user's name, if they provided it" },
          notes: {
            type: "string",
            description: "Any additional info about the conversation that's worth recording to give context",
          },
        },
        required: ["email"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "record_unknown_question",
      description: "Always use this tool to record any question that couldn't be answered as you didn't know the answer",
      parameters: {
        type: "object",
        properties: {
          question: { type: "string", description: "The question that couldn't be answered" },
        },
        required: ["question"],
        additionalProperties: false,
      },
    },
  },
];

const toolMap: Record<string, (args: any) => Promise<string>> = {
  record_user_details: recordUserDetails,
  record_unknown_question: recordUnknownQuestion,
};

export async function handleToolCalls(
  toolCalls: ChatCompletionMessageToolCall[]
): Promise<ChatCompletionToolMessageParam[]> {
  const results: ChatCompletionToolMessageParam[] = [];

  for (const toolCall of toolCalls) {
    const toolName = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments || "{}");
    console.log(`Tool called: ${toolName}`);

    const tool = toolMap[toolName];
    const result = tool ? await tool(args) : `Unknown tool: ${toolName}`;

    results.push({
      role: "tool",
      content: JSON.stringify(result),
      tool_call_id: toolCall.id,
    });
  }

  return results;
}
