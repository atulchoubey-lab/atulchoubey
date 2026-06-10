import { NextRequest } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

interface VectorStoreChunk {
  id: string;
  text: string;
  category: string;
  title: string;
  vector: number[] | null;
  terms: Record<string, number>;
}

const SYSTEM_PROMPT = `You are Ask Atul — Atul Choubey's personal digital assistant on his profile website.
Speak in the FIRST person as Atul himself ("I", "my", "me", "we").
Answer ONLY using the verified context blocks provided. Be warm, conversational, and concise.
Answer the specific question asked — do not dump all facts at once.
Never expose private data: phone number, email, exact address, or API keys.
If you cannot find relevant information in the context, say: "I don't have specific details on that — feel free to ask about my career, family, education, or goals!"
Never hallucinate. Never answer off-topic questions unrelated to Atul's profile.`;

function getTFIDFScore(query: string, chunk: VectorStoreChunk): number {
  const queryWords = query.toLowerCase().match(/\b[a-zA-Z]{3,}\b/g) || [];
  let score = 0;
  for (const word of queryWords) {
    if (chunk.terms?.[word]) score += chunk.terms[word];
  }
  return score;
}

function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = (messages[messages.length - 1]?.content || "").trim();
    const cleanQuery = lastMessage.toLowerCase().replace(/[?.,!]/g, "").trim();

    // Simple social replies
    const greetings = ["hi", "hello", "hey", "greetings", "good morning", "good evening", "good afternoon", "namaste", "yo"];
    if (greetings.includes(cleanQuery)) {
      return streamText("Hello! Great to have you here. Feel free to ask me anything about my career, family, education, hobbies, or future goals!");
    }
    if (["how are you", "how are you doing", "hows it going", "how are you today"].includes(cleanQuery)) {
      return streamText("I'm doing great, thank you! Busy with MLOps work and always learning. What would you like to know about me?");
    }
    if (["who are you", "what are you", "whats your name", "your name"].includes(cleanQuery)) {
      return streamText("I'm Atul Choubey — a Senior MLOps / ML Platform Engineer based in Pune. This is my personal profile site. Ask me anything!");
    }

    // Load vector store
    const vectorStorePath = join(process.cwd(), "public", "vector_store.json");
    if (!existsSync(vectorStorePath)) {
      return streamText("Knowledge base is not ready. Please rebuild the project.");
    }

    const vectorStore = JSON.parse(readFileSync(vectorStorePath, "utf8"));
    const chunks: VectorStoreChunk[] = vectorStore.data || [];

    // Retrieve relevant chunks via TF-IDF (Gemini handles understanding, not embeddings)
    const ranked = chunks
      .map((chunk) => ({ chunk, score: getTFIDFScore(lastMessage, chunk) }))
      .sort((a, b) => b.score - a.score);

    const retrievedChunks = ranked.filter((r) => r.score > 0).slice(0, 3).map((r) => r.chunk);

    if (retrievedChunks.length === 0) {
      return streamText("I don't have specific details on that — feel free to ask about my career, family, education, or goals!");
    }

    const contextContent = retrievedChunks
      .map((c) => `[${c.title}]\n${c.text}`)
      .join("\n\n");

    const fullSystemPrompt = `${SYSTEM_PROMPT}\n\nVerified Context:\n${contextContent}`;

    // Use Gemini
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      // Build contents array — merge system prompt into first user turn for compatibility
      const geminiContents = messages.map((m: { role: string; content: string }, idx: number) => {
        const role = m.role === "assistant" ? "model" : "user";
        let text = m.content;
        // Prepend system context to the first user message
        if (idx === 0 && role === "user") {
          text = `[Context for this conversation]\n${fullSystemPrompt}\n\n[User question]\n${m.content}`;
        }
        return { role, parts: [{ text }] };
      });

      const geminiBody = {
        contents: geminiContents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 400,
        },
      };

      // Non-streaming call for reliability
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiBody),
        }
      );

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const responseText: string =
          geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ??
          "I don't have specific details on that — feel free to ask about my career, family, education, or goals!";
        return streamText(responseText);
      } else {
        const errBody = await geminiRes.text();
        console.error("Gemini error:", geminiRes.status, errBody);
      }
    }

    // Final fallback — Gemini key missing or API failed
    const bestChunk = retrievedChunks[0];
    return streamText(
      `Based on what I know about myself: ${bestChunk.text.slice(0, 300)}${bestChunk.text.length > 300 ? "..." : ""}`
    );

  } catch (error: unknown) {
    console.error("Chat route error:", error);
    return streamText("Something went wrong on my end. Please try again!");
  }
}

function streamText(text: string) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const words = text.split(" ");
      for (const word of words) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ choices: [{ delta: { content: word + " " } }] })}\n\n`
          )
        );
        await new Promise((r) => setTimeout(r, 25));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
