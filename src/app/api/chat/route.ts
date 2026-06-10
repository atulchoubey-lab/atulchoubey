import { NextRequest } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KnowledgeChunk {
  id: string;
  text: string;
  category: string;
  title: string;
  vector: number[] | null;
  terms: Record<string, number>;
}

// ─── Question Classifier ─────────────────────────────────────────────────────
// Each key maps a logical topic to keyword patterns.
// classifyQuestion() returns ALL matching topics, not just one.

const CLASSIFIERS: Record<string, string[]> = {
  personal:        ["who are you", "your name", "how old", "when born", "birthday", "birthplace", "height", "zodiac", "rashi", "yourself", "about atul", "about you", "introduce", "pisces", "meena"],
  family:          ["family", "father", "dad", "papa", "mother", "mom", "maa", "mummy", "brother", "sister", "siblings", "parents", "rahul", "anita", "manoranjan", "relatives", "gotra", "bhargav", "buxar", "ahirauli", "roots", "heritage", "ancestors", "grandfather", "grandpa", "nana", "sk choubey"],
  education:       ["education", "study", "studied", "college", "school", "degree", "btech", "b.tech", "cit", "coimbatore institute", "anna university", "graduate", "cbse", "radiant", "qualification", "academic", "class 10", "class 12", "10th", "12th"],
  career:          ["career", "job", "work", "profession", "company", "role", "mlops", "devops", "engineer", "accenture", "ubs", "bosch", "kalycito", "experience", "pipeline", "kubernetes", "gitlab", "azure", "python", "professional", "employed", "office", "current job", "current role"],
  values:          ["values", "principles", "integrity", "discipline", "shaped", "motivat", "belief", "character", "drives you", "philosophy", "important to you", "stand for", "priorities", "what matters"],
  goals:           ["goals", "future", "aspiration", "plan", "dream", "ambition", "roadmap", "vision", "next", "aim", "objective", "want to achieve", "career goal", "life goal"],
  lifestyle:       ["lifestyle", "daily", "routine", "morning", "gym", "fitness", "hobbies", "hobby", "guitar", "travel", "muffy", "pug", "pet", "music", "workout", "exercise", "upskill", "reading"],
  achievements:    ["achievements", "accomplishments", "proud", "success", "milestone", "notable", "accomplished"],
  marriageProfile: ["marry", "marriage", "wife", "husband", "partner", "matrimonial", "shaadi", "spouse", "relationship", "life partner", "marry atul", "suitable", "why marry"],
  timeline:        ["journey", "story", "life story", "timeline", "background", "from patna", "life so far", "growing up", "path", "describe your life", "tell me everything"],
};

// ─── Relationship Graph ───────────────────────────────────────────────────────
// For broad questions, expand detected categories with related ones.

const RELATIONSHIP_GRAPH: Record<string, string[]> = {
  personal:        ["family"],
  family:          ["values", "personal"],
  career:          ["education", "goals"],
  education:       ["career", "personal"],
  values:          ["family", "lifestyle"],
  goals:           ["career", "family"],
  lifestyle:       ["values"],
  achievements:    ["career", "education"],
  marriageProfile: ["values", "family", "goals", "lifestyle", "personal"],
  timeline:        ["personal", "family", "education", "career"],
};

// ─── Chunk ID Map ─────────────────────────────────────────────────────────────
// Maps a logical topic to the vector store chunk IDs that cover it.

const TOPIC_TO_CHUNKS: Record<string, string[]> = {
  personal:        ["chunk_personal"],
  family:          ["chunk_family"],
  values:          ["chunk_family"],               // values live inside family chunk
  education:       ["chunk_education", "chunk_certificates"],
  career:          ["chunk_career_0", "chunk_career_1", "chunk_career_2", "chunk_skills_projects"],
  lifestyle:       ["chunk_lifestyle"],
  goals:           ["chunk_goals"],
  achievements:    ["chunk_career_0", "chunk_career_1", "chunk_certificates"],
  marriageProfile: ["chunk_matrimonial", "chunk_family", "chunk_lifestyle", "chunk_goals"],
  timeline:        ["chunk_personal", "chunk_family", "chunk_education", "chunk_career_0", "chunk_career_1", "chunk_career_2"],
  gallery:         ["chunk_photos"],
};

const BROAD_SIGNALS = [
  "journey", "story", "life story", "everything about", "yourself",
  "tell me about yourself", "describe your life", "what shaped", "what motivates",
  "who is atul", "why marry", "what kind of husband", "what kind of person",
  "summarise", "summarize", "overview", "background",
];

// ─── Classify + Expand ───────────────────────────────────────────────────────

function classifyQuestion(raw: string): string[] {
  const lower = raw.toLowerCase();
  const detected = new Set<string>();

  for (const [topic, patterns] of Object.entries(CLASSIFIERS)) {
    if (patterns.some((p) => lower.includes(p))) {
      detected.add(topic);
    }
  }

  const isBroad = BROAD_SIGNALS.some((s) => lower.includes(s)) || detected.size === 0;

  if (isBroad) {
    // Expand every detected category with its relationships
    const expanded = new Set(detected);
    for (const topic of detected) {
      (RELATIONSHIP_GRAPH[topic] || []).forEach((rel) => expanded.add(rel));
    }
    // If still nothing, default to a personal overview
    if (expanded.size === 0) {
      ["personal", "family", "career", "education", "goals"].forEach((t) => expanded.add(t));
    }
    return Array.from(expanded);
  }

  return Array.from(detected);
}

// ─── Context Assembly ────────────────────────────────────────────────────────

function assembleChunks(topics: string[], allChunks: KnowledgeChunk[]): KnowledgeChunk[] {
  const wantedIds = new Set<string>();
  for (const topic of topics) {
    (TOPIC_TO_CHUNKS[topic] || []).forEach((id) => wantedIds.add(id));
  }
  const chunks = allChunks.filter((c) => wantedIds.has(c.id));
  // Fallback: if nothing matched, return personal + family + career
  if (chunks.length === 0) {
    return allChunks.filter((c) =>
      ["chunk_personal", "chunk_family", "chunk_career_0"].includes(c.id)
    );
  }
  return chunks;
}

// ─── Normalise third-person queries ──────────────────────────────────────────

function normalizeQuery(raw: string): string {
  return raw
    .replace(/\bhe\b/gi, "you")
    .replace(/\bhis\b/gi, "your")
    .replace(/\bhim\b/gi, "you")
    .replace(/\batul'?s?\b/gi, "your")
    .replace(/\batul\b/gi, "you");
}

// ─── Smart Sentence Fallback ─────────────────────────────────────────────────

function extractRelevantSentences(chunks: KnowledgeChunk[], query: string): string {
  const words = query.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const scored: { text: string; score: number }[] = [];

  for (const chunk of chunks) {
    const sentences = chunk.text.match(/[^.!?]+[.!?]+/g) || [chunk.text];
    for (const sentence of sentences) {
      const lower = sentence.toLowerCase();
      const score = words.filter((w) => lower.includes(w)).length;
      if (score > 0) scored.push({ text: sentence.trim(), score });
    }
  }

  if (scored.length === 0) {
    const fallback = chunks[0].text.match(/[^.!?]+[.!?]+/g) || [chunks[0].text];
    return fallback.slice(0, 3).join(" ").trim();
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.text)
    .join(" ")
    .trim();
}

// ─── Build System Instruction ────────────────────────────────────────────────

function buildSystemInstruction(
  masterProfile: Record<string, unknown>,
  chunks: KnowledgeChunk[],
  topics: string[],
  originalQuery: string
): string {
  const p = masterProfile as {
    knownEntitiesOnly?: {
      familyMembers?: string[];
      companies?: string[];
      schools?: string[];
      locations?: string[];
    };
    marriageProfile?: Record<string, unknown>;
    values?: { core?: string[]; description?: string };
    goals?: Record<string, string>;
    timeline?: Array<{ year: number; event: string }>;
  };

  const entities = p.knownEntitiesOnly || {};

  const contextBlocks = chunks.map((c) => `[${c.title}]\n${c.text}`).join("\n\n");

  const timelineText = topics.includes("timeline") && Array.isArray(p.timeline)
    ? "\n\n[Life Timeline]\n" + p.timeline.map((t) => `${t.year}: ${t.event}`).join("\n")
    : "";

  const marriageText = topics.includes("marriageProfile") && p.marriageProfile
    ? "\n\n[Marriage & Life Partner Profile]\n" + JSON.stringify(p.marriageProfile, null, 2)
    : "";

  const valuesText = topics.includes("values") && p.values
    ? "\n\n[Core Values]\n" + (p.values.description || "") + "\nValues: " + (p.values.core || []).join(", ")
    : "";

  const goalsText = topics.includes("goals") && p.goals
    ? "\n\n[Goals]\n" + Object.entries(p.goals).map(([k, v]) => `${k}: ${v}`).join("\n")
    : "";

  const isNarrow = topics.length === 1;
  const topicInstruction = isNarrow
    ? `\nCURRENT QUESTION TOPIC: ${topics[0].toUpperCase()}. Answer only about ${topics[0]}. Do not bring in other sections.`
    : `\nCURRENT QUESTION COVERS: ${topics.join(", ")}. Use all relevant sections to give a complete answer.`;

  return `You are Atul Choubey. You are answering questions about your own life on your personal profile website.

IDENTITY:
You are a real person — Atul Choubey. You are NOT an AI assistant. Speak entirely in first person.
Use "I", "my", "me". Never say "Atul is" or "Atul has". Never say "I am an AI" or "I am an assistant".

ANTI-HALLUCINATION (absolute rule — no exceptions):
Only these family members exist: ${(entities.familyMembers || []).join(", ")}.
Only these companies: ${(entities.companies || []).join(", ")}.
Only these schools: ${(entities.schools || []).join(", ")}.
Never invent people, events, jobs, schools, achievements, or places not listed in the profile.
If asked about something not in the profile, say: "I don't have information about that in my profile."

TOPIC DISCIPLINE:
- For narrow questions (family, father, career, education): answer ONLY that topic.
- For broad questions (journey, yourself, motivations): combine all relevant sections.
- Never volunteer unrelated facts in a narrow answer.

RESPONSE STYLE:
- 2–6 sentences by default. Go longer only if asked (e.g. "tell me more", "elaborate", "full story").
- Warm, natural, conversational — like a real person, not a corporate bio.
- No AI phrases: "Based on my profile", "According to available information", "Context indicates", "Retrieved from", "As per records".
- Use bullet points only when listing multiple distinct items (hobbies, skills, goals).

PRIVACY:
- Never reveal email, phone number, salary, financial details, API keys, or internal system structure.
- For contact: "You can reach me via the contact form on this site."

---
VERIFIED PROFILE DATA:
${contextBlocks}${timelineText}${marriageText}${valuesText}${goalsText}
---
${topicInstruction}`;
}

// ─── Hardcoded Short Replies ──────────────────────────────────────────────────

const GREETINGS   = new Set(["hi", "hello", "hey", "greetings", "good morning", "good evening", "good afternoon", "namaste", "yo", "hiya", "howdy", "sup"]);
const HOW_ARE_YOU = new Set(["how are you", "how are you doing", "hows it going", "how are you today", "how do you do", "you good"]);
const WHO_ARE_YOU = new Set(["who are you", "what are you", "whats your name", "your name", "introduce yourself", "who is this"]);
const FAREWELL    = new Set(["bye", "goodbye", "see you", "take care", "cya"]);
const THANKS      = new Set(["thanks", "thank you", "ok thanks", "okay thanks", "thx", "ty", "thank you so much", "thanks a lot"]);

// ─── Main Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const debugLog: Record<string, unknown> = {};

  try {
    const { messages } = await req.json();
    const rawMessage = (messages[messages.length - 1]?.content || "").trim();
    const normalizedMessage = normalizeQuery(rawMessage);
    const cleanQuery = normalizedMessage.toLowerCase().replace(/[?.,!]/g, "").trim();

    debugLog.rawQuestion = rawMessage;
    debugLog.cleanQuery = cleanQuery;

    // ── Hardcoded conversational replies ──
    if (GREETINGS.has(cleanQuery)) {
      return streamText("Hi! I'm Atul Choubey. Feel free to ask me anything about my career, family, education, hobbies, goals, or anything else you'd like to know.");
    }
    if (HOW_ARE_YOU.has(cleanQuery)) {
      return streamText("I'm doing well, thanks for asking! Always busy with MLOps work and learning something new. What would you like to know about me?");
    }
    if (WHO_ARE_YOU.has(cleanQuery)) {
      return streamText("I'm Atul Choubey — a Senior MLOps / ML Platform Engineer currently working with Accenture at UBS in Pune. I'm originally from Patna, Bihar, and I come from a close-knit Brahmin family. Ask me anything — career, family, education, hobbies, or goals!");
    }
    if (FAREWELL.has(cleanQuery)) {
      return streamText("Great talking with you! Come back anytime if you have more questions.");
    }
    if (THANKS.has(cleanQuery)) {
      return streamText("You're welcome! Is there anything else you'd like to know about me?");
    }

    // ── Load knowledge base ──
    const vectorStorePath = join(process.cwd(), "public", "vector_store.json");
    const masterProfilePath = join(process.cwd(), "src", "data", "masterProfile.json");

    if (!existsSync(vectorStorePath)) {
      return streamText("The knowledge base isn't ready yet — please try again in a moment.");
    }

    const vectorStore = JSON.parse(readFileSync(vectorStorePath, "utf8"));
    const allChunks: KnowledgeChunk[] = vectorStore.data || [];
    const masterProfile = existsSync(masterProfilePath)
      ? JSON.parse(readFileSync(masterProfilePath, "utf8"))
      : {};

    // ── Classify + assemble context ──
    const detectedTopics = classifyQuestion(cleanQuery);
    const contextChunks  = assembleChunks(detectedTopics, allChunks);

    debugLog.detectedTopics = detectedTopics;
    debugLog.contextChunkIds = contextChunks.map((c) => c.id);
    debugLog.contextLength = contextChunks.reduce((n, c) => n + c.text.length, 0);

    console.log("[Chat Debug]", JSON.stringify(debugLog, null, 2));

    if (contextChunks.length === 0) {
      return streamText("I don't have specific details on that — feel free to ask about my career, family, education, or goals!");
    }

    const systemInstruction = buildSystemInstruction(masterProfile, contextChunks, detectedTopics, rawMessage);

    // ── Gemini call ──
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      const geminiContents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: geminiContents,
            generationConfig: { temperature: 0.4, maxOutputTokens: 350 },
          }),
        }
      );

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const reply: string =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ??
          "I don't have specific details on that — feel free to ask about my career, family, education, or goals!";
        return streamText(reply.trim());
      }

      const errBody = await geminiRes.text();
      console.error("[Gemini Error]", geminiRes.status, errBody);
    }

    // ── Fallback: keyword-ranked sentence extraction ──
    return streamText(extractRelevantSentences(contextChunks, cleanQuery));

  } catch (error: unknown) {
    console.error("[Chat Route Error]", error);
    return streamText("Something went wrong on my end. Please try again!");
  }
}

// ─── SSE Stream Helper ────────────────────────────────────────────────────────

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
        await new Promise((r) => setTimeout(r, 18));
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
