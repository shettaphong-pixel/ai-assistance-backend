// server.js
// AI Copilot Backend (Gemini API)

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// ===========================
// Config
// ===========================

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ GOOGLE_API_KEY not found");
  process.exit(1);
}

// ===========================
// Prompt Builder
// ===========================

function buildAIPrompt(userText) {
  return `
คุณคือ AI Copilot

กฎการตอบ:
- ตอบเป็นภาษาไทย
- ตอบตรงคำถาม
- ถ้าไม่เข้าใจให้ถามกลับ
- ห้ามแต่งข้อมูลที่ไม่ทราบ
- ใช้น้ำเสียงสุภาพและเป็นมิตร

ข้อความจากผู้ใช้:

${userText}
`;
}

// ===========================
// Gemini API
// ===========================

async function callGemini(prompt) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error: ${errorText}`);
  }

  const data = await response.json();

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "ไม่พบคำตอบจาก AI"
  );
}

// ===========================
// Health Check
// ===========================

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "AI Copilot Backend",
    model: "Gemini 2.5 Flash",
    endpoints: {
      "POST /api/ai": {
        body: {
          userText: "สวัสดี"
        }
      }
    }
  });
});

// ===========================
// Chat Endpoint
// ===========================

app.post("/api/ai", async (req, res) => {
  try {
    const { userText } = req.body;

    if (!userText || userText.trim() === "") {
      return res.status(400).json({
        error: "Missing userText"
      });
    }

    const prompt = buildAIPrompt(userText);

    const result = await callGemini(prompt);

    res.json({
      message: result
    });

  } catch (error) {

    console.error("❌ AI Error:", error);

    res.status(500).json({
      error: "AI service failed"
    });

  }
});

// ===========================
// Start Server
// ===========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ AI Backend running on port ${PORT}`);
});
