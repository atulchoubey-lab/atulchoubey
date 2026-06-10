"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { MessageSquare, Send, Bot, User, Cpu, RefreshCw, AlertCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedPrompts = [
  "Tell me about Atul",
  "Career Journey",
  "Family Background",
  "Education",
  "Daily Routine",
  "Future Goals",
  "Hobbies",
  "Marriage Preferences",
  "Professional Achievements",
  "Life Philosophy",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am Atul's digital profile assistant. You can ask me anything about my MLOps career, family background, lifestyle, future goals, or matrimonial preferences through this interactive conversation.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeStreamText, setActiveStreamText] = useState("");
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeStreamText]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: textToSend }];
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

      if (!response.ok) {
        throw new Error("Failed to communicate with chat service");
      }

      if (!response.body) {
        throw new Error("No readable stream received");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (dataStr === "[DONE]") continue;

            try {
              const data = JSON.parse(dataStr);
              const content = data.choices?.[0]?.delta?.content || "";
              assistantResponse += content;
              setActiveStreamText(assistantResponse);
            } catch (e) {
              // Ignore partial or malformed chunks
            }
          }
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: assistantResponse }]);
      setActiveStreamText("");
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered a network error. Please verify your connection or try again shortly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I am Atul's digital profile assistant. You can ask me anything about my MLOps career, family background, lifestyle, future goals, or matrimonial preferences through this interactive conversation.",
      },
    ]);
    setActiveStreamText("");
  };

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-12rem)] items-stretch">
        
        {/* Left column: Context & Suggestions */}
        <div className="lg:col-span-1 flex flex-col space-y-6 justify-between">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-secondary text-accent rounded-full text-xs font-semibold uppercase tracking-wider">
                <Cpu size={14} className="animate-pulse" />
                <span>Knowledge Engine</span>
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground">
                Ask Atul
              </h1>
              <p className="text-sm text-muted leading-relaxed">
                Learn more about Atul through an interactive conversation.
              </p>
            </div>

            {/* Suggested Prompts List */}
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

          {/* Safety/Privacy note */}
          <div className="glass-panel p-4 rounded-xl border border-card-border/80 flex items-start gap-3 bg-secondary/10">
            <AlertCircle size={18} className="text-accent shrink-0 mt-0.5" />
            <span className="text-[11px] text-muted leading-relaxed">
              This assistant operates using secure API endpoints. Responses are matched directly to verified profile details inside Atul&apos;s records.
            </span>
          </div>
        </div>

        {/* Right column: Chat Area */}
        <div className="lg:col-span-2 glass-panel rounded-3xl border border-card-border shadow-xl flex flex-col h-[500px] lg:h-auto overflow-hidden">
          
          {/* Chat Window Header */}
          <div className="bg-secondary/30 px-6 py-4 border-b border-card-border/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/15 rounded-xl text-accent">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-foreground">
                  Digital Atul Profile
                </h3>
                <span className="text-[10px] text-success font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
                  <span>Serving RAG Context</span>
                </span>
              </div>
            </div>
            
            <button
              onClick={clearChat}
              className="p-2 text-muted hover:text-foreground rounded-lg transition-colors cursor-pointer hover:bg-secondary/40"
              title="Clear chat history"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
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
              </div>
            ))}

            {/* Active Streaming Answer */}
            {activeStreamText && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl text-xs bg-secondary/70 text-muted shrink-0">
                  <Bot size={14} />
                </div>
                <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[80%] whitespace-pre-line bg-secondary/30 text-foreground border border-card-border/80 rounded-tl-none">
                  {activeStreamText}
                </div>
              </div>
            )}

            {/* Simulated Loading Typing State */}
            {isLoading && !activeStreamText && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl text-xs bg-secondary/70 text-muted shrink-0">
                  <Bot size={14} />
                </div>
                <div className="px-5 py-3.5 rounded-2xl bg-secondary/35 border border-card-border/50 rounded-tl-none flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-muted rounded-full bounce-dot" />
                  <span className="w-1.5 h-1.5 bg-muted rounded-full bounce-dot" />
                  <span className="w-1.5 h-1.5 bg-muted rounded-full bounce-dot" />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Form Input Area */}
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
              placeholder="Ask about MLOps projects, Gotra, values, partner preferences..."
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
