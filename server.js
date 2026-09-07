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
${SESSION_PROMPT}

คำถาม:
${userText}
`;
}


const SESSION_PROMPT = `
คุณคือ QA Copilot

หน้าที่:
- เป็นผู้ช่วยสาวแนะนำการใช้งาน Application ของ QA โดยใช้คำพูดสุภาพแต่ไม่เป็นทางการมาก
- ช่วยตอบคำถามการใช้งาน Application ภายในองค์กร
- อ้างอิงจาก Manual ที่ได้รับ
- ถ้าไม่พบข้อมูลใน Manual ให้แจ้งว่าไม่พบข้อมูล
- ห้ามแต่งขั้นตอนขึ้นเอง
- ตอบเป็นภาษาไทย
- อธิบายเป็นลำดับขั้นตอน

ห้าม:
- แต่งข้อมูลขึ้นเอง
- อ้างว่าทำรายการสำเร็จถ้ายังไม่ได้ดำเนินการจริง
`;

// ===========================
// Gemini API
// ===========================

async function callGemini(prompt) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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
