import { NextRequest } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// Define RAG Chunk Schema
interface VectorStoreChunk {
  id: string;
  text: string;
  category: string;
  title: string;
  vector: number[] | null;
  terms: Record<string, number>;
}

const SYSTEM_PROMPT_TEMPLATE = `
You are Atul Choubey himself. This is your personal website.
Your sole purpose is to answer questions from visitors about yourself, your career, your family, your goals, and your lifestyle, using ONLY the verified context blocks provided below.

Strict Constraints:
1. Speak in the FIRST person ("I", "my", "me", "we"). Do NOT talk about yourself in the third person (for example, do not say "Atul was born in Patna", say "I was born in Patna").
2. Answer ONLY using the facts present in the verified context blocks.
3. If the user asks about something not contained in the context blocks (e.g. general coding questions, science, cooking recipes, weather, news, history, or anything else), or if you do not have the answer in the context, respond EXACTLY: "I couldn't find specific information about that in my profile. Feel free to ask about my career, family, education, goals, hobbies, or lifestyle."
4. Never hallucinate, guess, or generate details not explicitly declared in the context.
5. Keep the persona warm, simple, professional, happy, and authentic. Speak conversationally as a human representative.

Verified Context Blocks:
{CONTEXT}
`;

// Helper to calculate term frequency similarity locally
function getTFIDFScore(query: string, chunk: VectorStoreChunk): number {
  const queryWords = query.toLowerCase().match(/\b[a-zA-Z]{3,}\b/g) || [];
  let score = 0;
  for (const word of queryWords) {
    if (chunk.terms && chunk.terms[word]) {
      score += chunk.terms[word];
    }
  }
  return score;
}

// Helper to compute cosine similarity for arrays
function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = (messages[messages.length - 1]?.content || "").trim();
    const cleanQuery = lastMessage.toLowerCase().replace(/[?.,!]/g, "").trim();
    const apiKey = process.env.OPENAI_API_KEY;

    // 1. Social Conversational Rules (Issue 1)
    const greetings = ["hi", "hello", "hey", "greetings", "good morning", "good evening", "good afternoon", "yo", "namaste"];
    if (greetings.includes(cleanQuery)) {
      return streamMockResponse("Hello! Welcome to my website. I can help you learn more about my career, family, interests, goals, and background.");
    }

    if (["how are you", "how are you doing", "hows it going", "how are you today"].includes(cleanQuery)) {
      return streamMockResponse("I'm doing well, thank you for asking! I'm here to answer questions about my background, career, and family.");
    }

    if (["who are you", "what are you", "what is your name", "your name", "whats your name"].includes(cleanQuery)) {
      return streamMockResponse("I am Atul Choubey. I set up this digital biography assistant to help you learn more about my profile, career journey, family background, and interests.");
    }

    // Load compiled vector store database
    const vectorStorePath = join(process.cwd(), "public", "vector_store.json");
    if (!existsSync(vectorStorePath)) {
      return Response.json({ error: "Knowledge base not compiled. Please rebuild." }, { status: 500 });
    }

    const vectorStore = JSON.parse(readFileSync(vectorStorePath, "utf8"));
    const chunks: VectorStoreChunk[] = vectorStore.data || [];
    const vectorType = vectorStore.type;
    const vectorModel = vectorStore.model;

    let retrievedChunks: VectorStoreChunk[] = [];

    // 2. Fetch Query Embeddings
    if (vectorType === "ollama") {
      try {
        const embedResponse = await fetch("http://127.0.0.1:11434/api/embeddings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: vectorModel,
            prompt: lastMessage,
          }),
        });

        if (embedResponse.ok) {
          const embedData = await embedResponse.json();
          const queryVector: number[] = embedData.embedding;

          const ranked = chunks
            .map((chunk) => {
              const similarity = chunk.vector ? dotProduct(queryVector, chunk.vector) : 0;
              return { chunk, score: similarity };
            })
            .sort((a, b) => b.score - a.score);

          retrievedChunks = ranked.slice(0, 3).map(item => item.chunk);
        }
      } catch (err) {
        console.error("Local Ollama embedding retrieval failed, falling back to TF-IDF:", err);
      }
    } else if (vectorType === "openai" && apiKey) {
      try {
        const embedResponse = await fetch("https://api.openai.com/v1/embeddings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            input: lastMessage,
            model: "text-embedding-3-small",
          }),
        });

        if (embedResponse.ok) {
          const embedData = await embedResponse.json();
          const queryVector: number[] = embedData.data[0].embedding;

          const ranked = chunks
            .map((chunk) => {
              const similarity = chunk.vector ? dotProduct(queryVector, chunk.vector) : 0;
              return { chunk, score: similarity };
            })
            .sort((a, b) => b.score - a.score);

          retrievedChunks = ranked.filter(item => item.score > 0.3).slice(0, 3).map(item => item.chunk);
        }
      } catch (err) {
        console.error("OpenAI embedding retrieval failed, falling back to TF-IDF:", err);
      }
    }

    // TF-IDF Fallback if empty or no embeddings
    if (retrievedChunks.length === 0) {
      const ranked = chunks
        .map((chunk) => {
          const score = getTFIDFScore(lastMessage, chunk);
          return { chunk, score };
        })
        .sort((a, b) => b.score - a.score);

      retrievedChunks = ranked.filter(item => item.score > 0).slice(0, 3).map(item => item.chunk);
    }

    // Check if query retrieved anything
    if (retrievedChunks.length === 0) {
      return streamMockResponse("I couldn't find specific information about that in my profile. Feel free to ask about my career, family, education, goals, hobbies, or lifestyle.");
    }

    const contextContent = retrievedChunks.map((c) => `[Title: ${c.title}]\n${c.text}`).join("\n\n");
    const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replace("{CONTEXT}", contextContent);

    // 3. Query local Ollama chat model if running
    let localModel: string | null = null;
    try {
      const ollamaTags = await fetch("http://127.0.0.1:11434/api/tags", {
        signal: AbortSignal.timeout(1000),
      });
      if (ollamaTags.ok) {
        const data = await ollamaTags.json();
        if (data.models && data.models.length > 0) {
          localModel = data.models[0].name;
        }
      }
    } catch (e) {
      // Ollama not running
    }

    if (localModel) {
      try {
        const ollamaResponse = await fetch("http://127.0.0.1:11434/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: localModel,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages.map((m: any) => ({ role: m.role, content: m.content })),
            ],
            stream: true,
            temperature: 0.1,
          }),
        });

        if (ollamaResponse.ok) {
          return new Response(ollamaResponse.body, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              Connection: "keep-alive",
            },
          });
        }
      } catch (err) {
        console.error("Local Ollama completions call failed:", err);
      }
    }

    // 4. Fallback to OpenAI API if available
    if (apiKey) {
      const chatResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((m: any) => ({ role: m.role, content: m.content })),
          ],
          stream: true,
          temperature: 0.1,
        }),
      });

      if (chatResponse.ok) {
        return new Response(chatResponse.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      }
    }

    // 5. Fallback to local TF-IDF text streaming
    // Extract the most matches chunk and output a warm summary
    const bestChunk = retrievedChunks[0];
    const fallbackText = `Based on Atul's profile knowledge: ${bestChunk.text}`;
    return streamMockResponse(fallbackText);

  } catch (error: any) {
    console.error("Error in RAG chat route:", error);
    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

function streamMockResponse(text: string) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const words = text.split(" ");
      for (const word of words) {
        const chunk = `data: ${JSON.stringify({
          choices: [{ delta: { content: word + " " } }],
        })}\n\n`;
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
