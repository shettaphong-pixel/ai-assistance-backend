import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY");
  process.exit(1);
}

/* ---------- Rate Limit (ง่ายๆ) ---------- */
const requestMap = new Map();
function rateLimit(ip) {
  const now = Date.now();
  const windowMs = 10000;
  const limit = 20;

  if (!requestMap.has(ip)) requestMap.set(ip, []);
  const timestamps = requestMap.get(ip).filter(t => now - t < windowMs);

  if (timestamps.length >= limit) return false;

  timestamps.push(now);
  requestMap.set(ip, timestamps);
  return true;
}

/* ---------- Prompt ---------- */
function buildAIPrompt(userText) {
  return `
IMPORTANT:
You MUST respond ONLY valid JSON.
No explanation. No markdown.

{
  "type": "action | clarify | chat",
  "intent": "",
  "confidence": 0.0,
  "data": {},
  "message": ""
}

User:
${userText}
`;
}

/* ---------- Validate ---------- */
function validateAI(obj) {
  return (
    obj &&
    typeof obj.type === "string" &&
    typeof obj.message === "string"
  );
}

/* ---------- Gemini ---------- */
async function callGemini(prompt) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    GEMINI_API_KEY;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    }),
    signal: controller.signal
  });

  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error("Gemini API error");
  }

  const data = await response.json();

  let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  text = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

  try {
    const parsed = JSON.parse(text);
    if (!validateAI(parsed)) throw new Error("Invalid schema");
    return parsed;
  } catch {
    return {
      type: "chat",
      intent: "fallback",
      confidence: 0,
      data: {},
      message: text || "AI ตอบไม่เป็น JSON"
    };
  }
}

/* ---------- API ---------- */
app.post("/api/ai", async (req, res) => {
  try {
    const ip = req.ip;
    if (!rateLimit(ip)) {
      return res.status(429).json({ message: "Too many requests" });
    }

    const { userText } = req.body;
    if (!userText) {
      return res.status(400).json({ message: "Missing userText" });
    }

    const prompt = buildAIPrompt(userText);
    const result = await callGemini(prompt);

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      type: "chat",
      message: "ระบบ AI ล้มเหลว"
    });
  }
});

/* ---------- Health ---------- */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("✅ Server running on port 3000");
});
