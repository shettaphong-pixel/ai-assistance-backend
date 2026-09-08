// server.js
// AI Copilot Backend (Gemini API)

import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());


async function getManuals() {

  const { data, error } = await supabase
    .from("manuals")
    .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};

// ===========================
// Config
// ===========================

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

if (!GEMINI_API_KEY) {
  console.error("❌ GOOGLE_API_KEY not found");
  process.exit(1);
}

// ===========================
// Prompt Builder
// ===========================

function buildAIPrompt(userText,manualContent) {
  return `

${SESSION_PROMPT}

====================
ข้อมูลจาก Manual
====================
${manualContent}
====================
คำถามผู้ใช้
====================
คำถาม:
${userText}
`;
}


const SESSION_PROMPT = `
เธอ คือ Aquslitist มาจากคำว่า A quality (เปลี่ยน -y เป็น -ist)

หน้าที่:
- เป็นผู้ช่วยสาวแนะนำการใช้งาน Application ของ QA โดยใช้คำพูดสุภาพแต่ไม่เป็นทางการมาก
- ช่วยตอบคำถามการใช้งาน Application ภายในองค์กร
- อ้างอิงจาก Manual ที่ได้รับ
- ห้ามแต่งขั้นตอนขึ้นเอง
- ตอบเป็นภาษาไทย
- อธิบายเป็นลำดับขั้นตอน
- แนะนำผู้ใช้งานจากสิ่งที่มีในฐานข้อมูลเท่านั้น
- ให้บริการเพื่อนร่วมงานอย่างสุภาพและมีใจรักการให้บริการ

ขอบเขตความรู้:
- ตอบได้เฉพาะข้อมูลที่อยู่ใน Manual ที่องค์กรจัดเตรียมให้
- ถ้าคำถามไม่มีข้อมูลใน Manual
- ถ้าไม่พบข้อมูลใน Manual ให้แจ้งผู้ใช้งานอย่างอ่อนน้อม ตอบรับปัญหาและแนะนำให้ติดต่อหน่วยงาน QA โดยตรง
- ห้ามใช้ความรู้ทั่วไปของโมเดล
- ห้ามแนะนำ Software, Application หรือวิธีการใดๆที่ไม่ได้อยู่ใน Manual
- ห้ามคาดเดา
- ห้ามแต่งข้อมูล

รูปแบบการตอบ:
- กรณีที่ผู้ใช้งานติดปัญหาการใช้งานให้ตอบจุดสำคัญและไม่ยืดยาว
- ให้ตอบเป็นข้อความธรรมดาและขึ้นบรรทัดใหม่เป็นข้อ ๆ 
ตัวอย่าง เช่น:

ขั้นตอนการสร้าง ICAR

1. เปิดหน้า ICAR
2. กด New
3. กรอกข้อมูล
4. กด Submit

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
    "ไม่พบคำตอบจาก Gemini AI"
  );
}

// ===========================
// Groq GPT API
// ===========================
async function callGroq(prompt) {

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify(
        {
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],

        temperature: 0.1
      })
    }
  );

// ===========================
// Groq Qwen API
// ===========================
async function callQwen(prompt) {

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify(
        {
        model: "qwen/qwen3.8-27b",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],

        temperature: 0.1
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || "Qwen API Error"
    );
  }

  return (
    data?.choices?.[0]?.message?.content ||
    "ไม่พบคำตอบจาก Qwen"
  );
}

// ===========================
// Call AI API and Switching
// ===========================
async function callAI(prompt) {
  try {
    console.log("Using Gemini");
    return await callGemini(prompt);
  }
  catch (geminiError) {
    console.error(
      "Gemini Failed:",
      geminiError.message
    );
    try {
      console.log("Fallback To Qwen");
      return await callGroq(prompt);
    }
    catch (groqError) {
      console.error(
        "Qwen Failed:",
        groqError.message
      );
      throw new Error(
        "AI Service Unavailable"
      );
    }
  }
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

app.get("/manuals", async (req, res) => {

  const manuals = await getManuals();

  res.json(manuals);

});

app.post("/api/ai", async (req, res) => {
  try {
    const { userText } = req.body;

    if (!userText || userText.trim() === "") {
      return res.status(400).json({
        error: "Missing userText"
      });
    }

const manuals = await getManuals();

const manualContent = manuals
  .map(item => `
Application: ${item.app_name}

Topic: ${item.topic}

Content:
${item.content}
`)
  .join("\n\n");

const prompt = buildAIPrompt(userText,manualContent);
``

const result = await callAI(prompt);

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
