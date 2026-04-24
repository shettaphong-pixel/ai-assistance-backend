// server.js
// Backend สำหรับ AI Copilot (Google Gemini API - AI Studio)

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY");
  process.exit(1);
}

/* --------- Prompt Builder (AI Layer) --------- */
function buildAIPrompt(userText) {
  return `
คุณคือ AI Assistance ด้านการลงทุน

กฎ:
- วิเคราะห์ intent ของผู้ใช้
- ถ้าไม่เข้าใจ ให้ถามกลับ
- ถ้าเข้าใจ ให้ตอบเป็น JSON เท่านั้น
- ห้ามเขียน SQL
- ห้ามแก้ database เอง

รูปแบบ JSON:
{
  "type": "action | clarify | chat",
  "intent": "",
  "confidence": 0.0,
  "data": {},
  "message": ""
}

ข้อความผู้ใช้:
${userText}
`;
}

/* --------- Call Gemini (AI Studio) --------- */
async function callGemini(prompt) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    GEMINI_API_KEY;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();
  let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // clean markdown code block
  text = text.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  }

  // try JSON
  try {
    return JSON.parse(text);
  } catch {
    return {
      type: "chat",
      intent: "none",
      confidence: 0,
      data: {},
      message: text || "AI ไม่สามารถประมวลผลได้"
    };
  }
}

/* --------- API Endpoint --------- */
app.post("/api/ai", async (req, res) => {
  try {
    const { userText } = req.body;
    if (!userText) {
      return res.status(400).json({ error: "Missing userText" });
    }

    const prompt = buildAIPrompt(userText);
    const aiResult = await callGemini(prompt);
    res.json(aiResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI service failed" });
  }
});

/* --------- Health Check --------- */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("✅ AI Backend running on port 3000");
});
``
