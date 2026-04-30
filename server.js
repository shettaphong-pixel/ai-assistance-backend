// server.js
// Pass-through Backend สำหรับ AI Copilot (Google Gemini API)

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

app.post("/api/ai", async (req, res) => {
  try {
    const { userText } = req.body;
    if (!userText) {
      return res.status(400).json({ message: "" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userText }] }]
        })
      }
    );

    const data = await response.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // ตัด ```json ``` ถ้า Gemini ส่งมาเป็น code block
    text = text.trim();
    if (text.startsWith("```")) {
      text = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    }

    // ✅ ส่งกลับตรง ๆ ไม่เติมคำเอง
    res.json({ message: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "" });
  }
});

app.listen(3000, () => {
  console.log("✅ AI Backend running on port 3000");
});
