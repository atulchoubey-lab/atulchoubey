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
  "Hi! I'm Ask Atul. Feel free to ask me anything about my career, family, education, lifestyle, or future goals.";

const suggestedPrompts = [
  "Tell me about yourself",
  "Where do you work?",
  "Tell me about your family",
  "Who is your mother?",
  "Where did you study?",
  "What are your hobbies?",
  "What are your future goals?",
  "What is your daily routine?",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: INITIAL_GREETING },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeStreamText, setActiveStreamText] = useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

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
        { role: "assistant", content: assistantResponse },
      ]);
      setActiveStreamText("");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect just now. Please try again in a moment.",
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

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-12rem)] items-stretch">

        {/* Left: Context & Suggestions */}
        <div className="lg:col-span-1 flex flex-col space-y-6 justify-between">
          <div className="space-y-6">
            <div className="space-y-3">
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
                Curious about me? Feel free to ask.
              </p>
            </div>

            {/* Suggested prompts */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-highlight uppercase tracking-wider">
                Suggested Questions
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                    className="text-left text-xs px-3.5 py-2.5 bg-secondary/60 hover:bg-secondary border border-card-border/80 rounded-xl transition-all text-muted hover:text-foreground font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Privacy note */}
          <div className="glass-panel p-4 rounded-xl border border-card-border/80 flex items-start gap-3 bg-secondary/10">
            <Lock size={16} className="text-accent shrink-0 mt-0.5" />
            <span className="text-[11px] text-muted leading-relaxed">
              Your conversation is private. No personal data like email, phone, or address is ever shared.
            </span>
          </div>
        </div>

        {/* Right: Chat Window */}
        <div className="lg:col-span-2 glass-panel rounded-3xl border border-card-border shadow-xl flex flex-col h-[520px] lg:h-auto overflow-hidden">

          {/* Header */}
          <div className="bg-secondary/30 px-5 py-4 border-b border-card-border/80 flex items-center justify-between">
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
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
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
                    className={`p-2 rounded-xl text-xs shrink-0 ${
                      msg.role === "user"
                        ? "bg-accent text-white"
                        : "bg-secondary/70 text-muted"
                    }`}
                  >
                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[80%] whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-accent text-white rounded-tr-none"
                        : "bg-secondary/30 text-foreground border border-card-border/80 rounded-tl-none"
                    }`}
                  >
                    {msg.content}
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
                <div className="p-2 rounded-xl text-xs bg-secondary/70 text-muted shrink-0">
                  <Bot size={14} />
                </div>
                <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[80%] whitespace-pre-line bg-secondary/30 text-foreground border border-card-border/80 rounded-tl-none">
                  {activeStreamText}
                </div>
              </motion.div>
            )}

            {/* Loading indicator */}
            {isLoading && !activeStreamText && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl text-xs bg-secondary/70 text-muted shrink-0">
                  <Bot size={14} />
                </div>
                <div className="px-5 py-3.5 rounded-2xl bg-secondary/35 border border-card-border/50 rounded-tl-none flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:300ms]" />
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
            className="p-4 bg-secondary/20 border-t border-card-border/80 flex items-center gap-3"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about my career, family, education..."
              disabled={isLoading}
              className="flex-grow px-4 py-3 text-sm rounded-xl bg-background border border-card-border/80 focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
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
