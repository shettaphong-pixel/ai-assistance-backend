// server.js
// AI Copilot Backend (Gemini API)

import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

//add
let manualsCache = [];

async function refreshManuals() {
   manualsCache = await getManuals();
}
//finish

async function getManuals() {

  const { data, error } = await supabase
    .from("manuals")
    .select("*")

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

function buildAIPrompt(userText,manualContent,chatHistory) 
{
const historyText =
   chatHistory
      .map(msg =>
         `${msg.role}: ${msg.content}`
      )
      .join("\n");

   console.log("=== START PROMPT HISTORY ===");
   console.log(chatHistory);
   console.log("=== FINISH PROMPT HISTORY ===");
   return `

${SESSION_PROMPT}

====================
ข้อมูลจาก Manual
====================
${manualContent}
====================
ประวัติการสนทนา
====================
${historyText}
====================
คำถามผู้ใช้
====================
คำถาม:
${userText}
`;
console.log("=== FINAL PROMPT ===");
console.log(prompt);
}


const SESSION_PROMPT = `
เธอ คือ มีนา (Mee-na) มาจากคำว่า มาจาก "มีข้อมูลจาก Manual นะ"

หน้าที่:
- ช่วยตอบคำถามการใช้งาน Application ภายในองค์กร
- อ้างอิงจาก Manual ที่ได้รับ
- ห้ามแต่งขั้นตอนขึ้นเอง
- ตอบเป็นภาษาไทย
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
- เป็นผู้ช่วยสาวขี้เล่นแนะนำการใช้งาน Application ของ QA โดยใช้คำพูดสุภาพแต่ไม่เป็นทางการมาก
- ห้ามเรียกผู้ใช้งานว่าลูกค้า ให้เรียกว่าคุณพี่หรืออย่างอื่นแทน
- กรณีที่ผู้ใช้งานตั้งคำถามไม่เฉพาะเจาะจงหรือไม่มีใน keyword ให้ทวนถามสิ่งที่ต้องการจาก keywords ที่อาจจะใกล้เคียง
- กรณีที่ผู้ใช้งานติดปัญหาการใช้งานให้ตอบจุดสำคัญและไม่ยืดยาว
- พิจารณาบริบทที่คุยจากประวัติแชทหรือข้อความก่อนหน้านั้น เพื่อคาดเดาสิ่งที่ผู้ใช้ต้องการสื่อถึง
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
async function callGPT(prompt) {

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
    const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || "GPT API Error"
    );
  }

  return (
    data?.choices?.[0]?.message?.content ||
    "ไม่พบคำตอบจาก GPT"
  );
}
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
      console.log("Fallback To GPT");
      return await callGPT(prompt);
      }
      catch (groqError) {
        console.error(
        "GPT Failed:",
        groqError.message
        );
        try {
            console.log("Fallback To Qwen");
            return await callQwen(prompt);
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
// Save Question from AI HIT
// ===========================

async function saveAiQuestion(question, answer) {

  const { error } = await supabase
    .from("ai_hits")
    .insert({
      question,
      answer: answer
    });

  if (error) {
    console.error(
      "Save AI Question Error:",
      error.message
    );
  }
}
// ===========================

// ===========================
// Save feedback
// ===========================

async function saveFeedback(userText) {

  const { error } = await supabase
    .from("ai_hits")
    .insert({
      userText
    });

  if (error) {
    console.error(
      "Save AI Question Error:",
      error.message
    );
  }
}
// ===========================


// ===========================
// Chat Endpoint
// ===========================

app.get("/manuals", async (req, res) => {

  const manuals = await getManuals();

  res.json(manuals);

});

// เรียก Backend ต่อเมื่อไม่พบ FAQ
// AI response
app.post("/api/ai", async (req, res) => {
  try {
    //add
     const { 
           userText,
           chatHistory,
           recentText
          } = req.body;

     console.log("=== START CHAT HISTORY ===");
     console.log(chatHistory);
     console.log("=== FINISH CHAT HISTORY ===");
     //finish add

         // ===========================
         // Clarify UesrText intent
         // ===========================
         
         function detectIntent(userText) {
             const text = userText.toLowerCase();
             const recommendPatterns = [
                 "ช่วยแนะนำ",
                 "ขอคำแนะนำ",
                 "มีอะไรแนะนำ",
                 "แนะนำหน่อย",
                 "แนะนำให้หน่อย"
             ];
             const feedbackPatterns = [
                 "อยากแนะนำ",
                 "ขอแนะนำ",
                 "ข้อเสนอแนะ",
                 "เสนอแนะ"
             ];
             if (
                 recommendPatterns.some(p =>
                     text.includes(p)
                 )
             ) {
                 return "REQUEST_ADVICE";
             }
             if (
                 feedbackPatterns.some(p =>
                     text.includes(p)
                 )
             ) {
                 return "GIVE_FEEDBACK";
             }
             return "NORMAL";
         }
         
         const intent = detectIntent(userText);
         console.log(
             "Intent:",
             intent
         );

if (
    intent ===
    "GIVE_FEEDBACK"
){
    await saveFeedback(
        userText
    );
}
``       
         // ===========================
     
    if (!userText || userText.trim() === "") {
      return res.status(400).json({
        error: "Missing userText"
      });
    }

const manuals = await getManuals();

const searchSource =
   recentText + " " + userText;
     
const keywords =
  searchSource.toLowerCase().split(/\s+/);

const extraKeywords = ["Apps","แนะนำ","recommended","recommend","Apps ปัจจุบันที่ QA เปิดให้ใช้งาน","Apps ทั้งหมด","แอปพลิเคชัน","application","program","โปรแกรม"];

extraKeywords.forEach(word => {
if (userText.toLowerCase().includes(word)) {
keywords.push(word);
}
});

// ===== select manual ======
// ==========================

let relatedManuals = [];
     if (
    intent ===
    "REQUEST_ADVICE"
) {

    relatedManuals = manuals
   .filter(item => {

const searchText =
      `
      ${item.app_name}
      ${item.topic}
      `
      .toLowerCase();

    return keywords.some(word =>
      searchText.includes(word)
    );
})       
}
else {

    relatedManuals = manuals
      .filter(item => {
          const searchText =
            `
            ${item.app_name}
            ${item.topic}
            ${item.keywords}
            `
            .toLowerCase();
          return keywords.some(word =>
              searchText.includes(word)
          );
      })
      .slice(0, 5)
}
// =========== Finish select manual

let manualContent = "";
     if (relatedManuals.length === 0) {
        manualContent = `
No matching manual found.
Try to answer based on chat history and general knowledge.
If you are not confident, suggest the closest available application or manual topic.
`;
} 
     else {
      manualContent = relatedManuals
  .map(item => `

App_name: ${item.app_name}

Topic: ${item.topic}

Keywords: ${item.keywords}

Content:
${item.content}
`)
  .join("\n\n");
     }

const prompt = buildAIPrompt(userText,manualContent,chatHistory);
console.log("Prompt Length:", prompt.length);
const estimatedTokens =
  Math.ceil(prompt.length / 4);

console.log("Estimated Tokens:", estimatedTokens);
console.log("keywords", keywords);
console.log("relatedManuals", relatedManuals.length);
console.log(
  relatedManuals.map(x => x.app_name)
);
     ``

const result = await callAI(prompt);

await saveAiQuestion(
userText,
result
);
     
    res.json({
      message: result
    });

   console.log(
      "Answer:",
      result
   );
     
  } catch (error) {

    console.error("❌ AI Error:", error);

    res.status(500).json({
      error: "AI service failed"
    });

  }
});//finish AI response
   
// ===========================
// Start Server
// ===========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ AI Backend running on port ${PORT}`);
});
