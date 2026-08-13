"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };

const EXAMPLES = [
  "Tell me about your background and experience.",
  "What kinds of projects are you working on now?",
  "What are your strongest technical skills?",
  "How can I get in touch with you?",
];

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<Message[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
  }, [messages, pending]);

  function commit(next: Message[]) {
    setMessages(next);
    setHistory([...history.slice(0, historyIndex + 1), next]);
    setHistoryIndex(historyIndex + 1);
  }

  function goBack() {
    if (pending || historyIndex === 0) return;
    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    setMessages(history[nextIndex]);
  }

  function goForward() {
    if (pending || historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    setMessages(history[nextIndex]);
  }

  function clearChat() {
    if (pending || messages.length === 0) return;
    setError(null);
    commit([]);
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      commit([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="page">
      <div className="header-row">
        <div>
          <h1>Kenel Belizaire</h1>
          <p className="subtitle">
            Talk to my AI twin about my career · <Link href="/twin">View 3D profile →</Link>
          </p>
        </div>
        <div className="history-controls">
          <button
            type="button"
            className="history-btn"
            onClick={goBack}
            disabled={pending || historyIndex === 0}
            aria-label="Undo last message"
            title="Back"
          >
            ←
          </button>
          <button
            type="button"
            className="history-btn"
            onClick={goForward}
            disabled={pending || historyIndex >= history.length - 1}
            aria-label="Redo last undone message"
            title="Forward"
          >
            →
          </button>
          <button
            type="button"
            className="history-btn clear-btn"
            onClick={clearChat}
            disabled={pending || messages.length === 0}
            aria-label="Clear conversation"
            title="Clear"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="chatbox">
        <div className="messages" ref={messagesRef}>
          {messages.map((m, i) => (
            <div key={i} className={`row ${m.role}`}>
              <div className="bubble">{m.content}</div>
            </div>
          ))}
          {pending && (
            <div className="row assistant">
              <div className="bubble pending">Thinking…</div>
            </div>
          )}
        </div>

        {error && <div className="error">{error}</div>}

        {messages.length === 0 && (
          <div className="examples">
            {EXAMPLES.map((ex) => (
              <button key={ex} className="example-btn" onClick={() => sendMessage(ex)}>
                {ex}
              </button>
            ))}
          </div>
        )}

        <form
          className="input-row"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question…"
            disabled={pending}
          />
          <button type="submit" disabled={pending || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
