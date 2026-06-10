"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { Send, Bot, User, RefreshCw, Sparkles, Lock } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_GREETING =
  "Hi! I'm Ask Atul — a digital profile assistant representing Atul Choubey. Ask me anything about his career, family, education, hobbies, goals, or marriage profile.";

const suggestedPrompts = [
  "Tell me about yourself",
  "Where do you currently work?",
  "Tell me about your family",
  "What is your educational background?",
  "What are your hobbies?",
  "What are your goals?",
  "Why should someone marry you?",
  "What is your daily routine?",
  "Tell me your life story",
  "What are your core values?",
];

// ─── Simple Markdown Renderer ─────────────────────────────────────────────────

function MarkdownText({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/);

  return (
    <div className="space-y-2">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split("\n").filter((l) => l.trim() !== "");

        const isBulletList = lines.every((l) => /^[-•*]\s/.test(l.trim()));
        const isNumberedList = lines.every((l) => /^\d+\.\s/.test(l.trim()));

        if (isBulletList) {
          return (
            <ul key={pIdx} className="list-disc list-inside space-y-0.5 pl-1">
              {lines.map((l, i) => (
                <li key={i} className="text-sm leading-relaxed">
                  <InlineMarkdown text={l.replace(/^[-•*]\s/, "")} />
                </li>
              ))}
            </ul>
          );
        }

        if (isNumberedList) {
          return (
            <ol key={pIdx} className="list-decimal list-inside space-y-0.5 pl-1">
              {lines.map((l, i) => (
                <li key={i} className="text-sm leading-relaxed">
                  <InlineMarkdown text={l.replace(/^\d+\.\s/, "")} />
                </li>
              ))}
            </ol>
          );
        }

        // Mixed paragraph — render each line, join with <br /> for single newlines
        return (
          <p key={pIdx} className="text-sm leading-relaxed">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                <InlineMarkdown text={line} />
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function InlineMarkdown({ text }: { text: string }) {
  // Bold (**text**) and italic (*text*) parsing
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      parts.push(<strong key={match.index} className="font-semibold text-foreground">{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      parts.push(<em key={match.index}>{match[2]}</em>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}

// ─── Main Chat Component ──────────────────────────────────────────────────────

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: INITIAL_GREETING },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeStreamText, setActiveStreamText] = useState("");
  const [showAllPrompts, setShowAllPrompts] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeStreamText]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: textToSend },
    ];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);
    setActiveStreamText("");
    setTimeout(() => inputRef.current?.focus(), 50);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Connection failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n\n")) {
          if (!line.startsWith("data: ")) continue;
          const dataStr = line.slice(6).trim();
          if (dataStr === "[DONE]") continue;
          try {
            const data = JSON.parse(dataStr);
            const content = data.choices?.[0]?.delta?.content || "";
            assistantResponse += content;
            setActiveStreamText(assistantResponse);
          } catch {
            // skip malformed chunk
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantResponse.trim() },
      ]);
      setActiveStreamText("");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect just now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: INITIAL_GREETING }]);
    setActiveStreamText("");
  };

  const visiblePrompts = showAllPrompts ? suggestedPrompts : suggestedPrompts.slice(0, 6);

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 min-h-[calc(100vh-12rem)] items-stretch">

        {/* Left: Context & Suggestions */}
        <div className="lg:col-span-1 flex flex-col space-y-5 justify-between">
          <div className="space-y-5">
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center space-x-1.5 px-3 py-1 bg-secondary text-accent rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                <Sparkles size={13} className="animate-pulse" />
                <span>Ask Atul</span>
              </motion.div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground">
                Ask Atul
              </h1>
              <p className="text-sm text-muted leading-relaxed">
                Curious about Atul? Ask anything — career, family, education, values, or his marriage profile.
              </p>
            </div>

            {/* Suggested prompts */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-highlight uppercase tracking-wider">
                Suggested Questions
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {visiblePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                    className="text-left text-xs px-3.5 py-2.5 bg-secondary/60 hover:bg-secondary border border-card-border/80 rounded-xl transition-all text-muted hover:text-foreground font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed leading-snug"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              {suggestedPrompts.length > 6 && (
                <button
                  onClick={() => setShowAllPrompts((v) => !v)}
                  className="text-xs text-accent hover:underline font-semibold cursor-pointer"
                >
                  {showAllPrompts ? "Show fewer" : `+${suggestedPrompts.length - 6} more`}
                </button>
              )}
            </div>
          </div>

          {/* Privacy note */}
          <div className="glass-panel p-4 rounded-xl border border-card-border/80 flex items-start gap-3 bg-secondary/10">
            <Lock size={15} className="text-accent shrink-0 mt-0.5" />
            <span className="text-[11px] text-muted leading-relaxed">
              Your conversation is private. Personal details like email, phone, or address are never shared.
            </span>
          </div>
        </div>

        {/* Right: Chat Window */}
        <div className="lg:col-span-2 glass-panel rounded-3xl border border-card-border shadow-xl flex flex-col h-[560px] sm:h-[600px] lg:h-auto overflow-hidden">

          {/* Header */}
          <div className="bg-secondary/30 px-5 py-4 border-b border-card-border/80 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/15 rounded-xl text-accent">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-foreground">
                  Ask Atul
                </h3>
                <span className="text-[10px] text-success font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
                  <span>Online</span>
                </span>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="p-2 text-muted hover:text-foreground rounded-lg transition-colors cursor-pointer hover:bg-secondary/40"
              title="Clear conversation"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 min-h-0">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`p-2 rounded-xl text-xs shrink-0 mt-0.5 ${
                      msg.role === "user"
                        ? "bg-accent text-white"
                        : "bg-secondary/70 text-muted"
                    }`}
                  >
                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[82%] ${
                      msg.role === "user"
                        ? "bg-accent text-white rounded-tr-none text-sm leading-relaxed"
                        : "bg-secondary/30 text-foreground border border-card-border/80 rounded-tl-none"
                    }`}
                  >
                    {msg.role === "user" ? (
                      msg.content
                    ) : (
                      <MarkdownText text={msg.content} />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Streaming answer */}
            {activeStreamText && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="p-2 rounded-xl text-xs bg-secondary/70 text-muted shrink-0 mt-0.5">
                  <Bot size={14} />
                </div>
                <div className="px-4 py-3 rounded-2xl max-w-[82%] bg-secondary/30 text-foreground border border-card-border/80 rounded-tl-none">
                  <MarkdownText text={activeStreamText} />
                  <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-accent rounded-sm animate-pulse align-middle" />
                </div>
              </motion.div>
            )}

            {/* Typing indicator */}
            {isLoading && !activeStreamText && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl text-xs bg-secondary/70 text-muted shrink-0 mt-0.5">
                  <Bot size={14} />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-secondary/35 border border-card-border/50 rounded-tl-none flex items-center space-x-1.5">
                  <span className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="p-3 sm:p-4 bg-secondary/20 border-t border-card-border/80 flex items-center gap-2 sm:gap-3 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about career, family, education..."
              disabled={isLoading}
              className="flex-grow px-4 py-3 text-sm rounded-xl bg-background border border-card-border/80 focus:outline-none focus:border-accent transition-colors disabled:opacity-50 min-w-0"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-accent text-white rounded-xl shadow-lg shadow-accent/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>
    </PageWrapper>
  );
}
