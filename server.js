import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// API KEY: แนะนำให้ตั้งชื่อ Secret ใน Replit ว่า GEMINI_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

/* ---------- Prompt Builder (กำหนดบุคลิก AI) ---------- */
function buildAIPrompt(userText) {
  return `คุณคือ AI ผู้ช่วยอัจฉริยะ (AI Copilot) ที่เชี่ยวชาญด้านการลงทุนและการเงิน
คำแนะนำ: ตอบเป็นภาษาไทยที่สุภาพ กระชับ และเป็นประโยชน์
ข้อกำหนดด้านเทคนิค:
1. ตอบกลับเป็นรูปแบบ JSON เท่านั้น
2. ห้ามใช้ Markdown code blocks (เช่น \`\`\`json)
3. หากผู้ใช้ทักทาย ให้ตอบทักทายและเสนอตัวช่วยเหลือ

โครงสร้าง JSON:
{
  "type": "chat",
  "intent": "วิเคราะห์ความตั้งใจของผู้ใช้",
  "confidence": 1.0,
  "data": {},
  "message": "ข้อความตอบกลับภาษาไทยของคุณ"
}

User Message: "${userText}"`;
}

/* ---------- ฟังก์ชันเรียก Gemini API ---------- */
async function callGemini(prompt) {
  if (!GEMINI_API_KEY) {
    return { type: "chat", message: "[System] ไม่พบ API Key โปรดตั้งชื่อว่า GEMINI_API_KEY ในหน้า Secrets" };
  }

  // ใช้รุ่น 1.5-flash เพื่อความเร็วและความเสถียร
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json" // บังคับให้ตอบเป็น JSON
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API connection failed");
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Parse ผลลัพธ์ (Gemini JSON mode มักจะสะอาดอยู่แล้ว)
    return JSON.parse(text.trim());
  } catch (err) {
    console.error("Gemini Error:", err.message);
    return {
      type: "chat",
      message: "ขออภัยครับ AI ประมวลผลผิดพลาด: " + err.message
    };
  }
}

/* ---------- API Routes ---------- */

// 1. รับข้อความแชท
app.post("/api/ai", async (req, res) => {
  const { userText } = req.body;
  if (!userText) return res.status(400).json({ message: "กรุณาระบุ userText" });

  try {
    const result = await callGemini(buildAIPrompt(userText));
    res.json(result);
  } catch (error) {
    res.status(500).json({ type: "chat", message: "Internal Server Error" });
  }
});

// 2. ตรวจสอบสถานะ (Health Check)
app.get("/health", (req, res) => {
  res.json({ 
    status: "online", 
    api_key_configured: !!GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

/* ---------- เริ่มต้นเซิร์ฟเวอร์ ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend Server is running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
});
