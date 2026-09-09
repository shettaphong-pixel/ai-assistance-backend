const FAQS = [
  {
    id: 1,
    keywords: [
      "เลือก car",
      "select car",
      "open car",
      "เปิด car",
      "เลือก icar",
      "select icar",
      "open icar",
      "เปิด icar"
    ],
    answer: `
📖 วิธีเลือก ICAR (CAR)

1. คลิ๊กที่ Tab Nonconforming Status
2. คลิ๊กที่ Go to ... ด้านซ้ายมือของ ICAR No. ที่เลือก
3. จากนั้นระบบจะโชว์ Processing... รอจนว่าข้อความจะหายไป
4. กดปุ่ม Sort จากนั้นระบบจะโชว์ Processing... รอจนข้อความจะหายไป
5. กดปุ่ม Activate กรณีที่เป็นเจ้าของ ICAR No. นี้ ถ้ามีคนกดไปแล้วจะไม่สามารถกดได้ยกเว้นว่าคนแรกที่กดจะกดปุ่ม Deactivate
6. เช็ครายการ CC Email โดยคลิ๊กที่กล่องใต้ Activate Status หน้าต่าง list จะปรากฎขึ้น
7. กรณีอยากเพิ่มรายชื่อให้พิมพ์หาด้วยชื่อหรือเมลก็ได้จากนั้นกดเลือก เมื่อเลือกจนครบให้กดปุ่ม Update CC List จากนั้นจะมีเครื่องหมายถูกปรากฎขึ้น

✅ เพียงเท่านี้ก็เลือก CAR เรียบร้อยแล้วค่ะ
`
  },

  {
    id: 2,
    keywords: [
      "ค้นหา icar",
      "search icar",
      "find icar",
      "หา icar",
      "เช็ค Status icar",
      "ค้นหา car",
      "search car",
      "find car",
      "หา car",
      "เช็ค Status car"
    ],
    answer: `
🔍 วิธีค้นหา ICAR

1. เลือก Tab ชื่อ Nonconforming Status
2. เลือก Filter ใน Column ที่ต้องการค้นหาหรือกดปุ่ม clear ถ้าต้องการดูทั้งหมด
3. Review Status:Accept หมายถึง Auditor ได้ Review ICAR No. นั้นและอนุมัติในหัวข้อที่ส่งเข้ามา
4. Review Status:Review หมายถึง Auditor ได้ Review ICAR No. นั้นและยังมีประเด็นที่ Auditor ยังไม่ยอมรับ
5. Actual Status:Pending หมายถึง หัวข้อนั้นยังไม่ได้รับการอนุมัติจาก Auditor
6. Opened day หมายถึง จำนวนวันที่เปิดมาแล้วนับต้องแต่วัน Issue ICAR โดยนับตามวันปฏิฐิน

✅ ระบบจะแสดงรายการ CAR ที่ตรงกับเงื่อนไขที่ค้นหา
`
  },

  {
    id: 3,
    keywords: [
      "สร้าง icar",
      "create icar",
      "new icar",
      "เปิด icar",
      "สร้าง car",
      "create car",
      "new car",
      "เปิด car"
    ],
    answer: `
📝 วิธีสร้าง ICAR

1. กดเลือก Tab ชื่อ CAR ISSUE
2. กรอกข้อมูลในช่อง Audit Area
3. กรอกข้อมูลในช่อง Issue Report No. โดยจะต้องขอ No. จากหน่วยงาน QA
4. กดปุ่ม check เพื่อเช็คว่า No. ที่กรอกไม่ซ้ำและสามารถใช้งานได้
5. กรอกข้อมูลในส่วนที่เหลือให้ครบทุกช่อง
6. คลิ๊กที่รูปปฏิทินเพื่อเลือก Due date สำหรับ
6.1 Finding Date (วันที่ตรวจพบ) ถ้าเลือกไม่ได้แปลว่าไม่ได้กดปุ่ม Check
ุ6.2 Correction Date (วันที่ต้องส่ง Correction item & Evidence)
6.3 Submit CA Date (วันที่ต้องส่ง Why-Why Analysis & Corrective Action Item)
6.4 Evidence Date (วันที่ต้องส่ง Corrective Action Evidence)
7. เลือก Email Auditee โดยคลิ๊กที่กล่องและพิมพ์ค้นหา Email
8. เลือก Email Auditor โดยคลิ๊กที่กล่องและพิมพ์ค้นหา Email
9. เลือก Email ของผู้ที่เกี่ยวข้อง โดยคลิ๊กที่กล่องและพิมพ์ค้นหา Email กดปุ่ม +Add (จะมีเครื่องหมายถูกสีเขียวโชว์)
10. เลือก Email QMR โดยคลิ๊กที่กล่องและพิมพ์ค้นหา Email
11. เลือก Email Lead Auditor โดยคลิ๊กที่กล่องและพิมพ์ค้นหา Email
12. กดปุ่ม Setup QMR / Lead Auditor 
13. กด Draft กรณีที่กรอกไม่ครบ ปุ่มจะไม่ปรากฎให้กด
14. กด Send กรณีที่ไม่ได้กดปุ่ม Draft ปุ่มจะไม่ปรากฎให้กด

✅ ระบบจะสร้าง ICAR ใหม่ให้โดยอัตโนมัติ
`
  },

  {
    id: 4,
    keywords: [
      "ตอบ ICAR",
      "ตอบ CAR",
      "รับ ICAR",
      "รับ CAR",
      "Active"	
    ],
    answer: `
✅ วิธีตอบ ICAR

1. คลิ๊กที่ Tab Nonconforming Status
2. คลิ๊กที่ Go to ... ด้านซ้ายมือของ ICAR No. ที่เลือก
3. จากนั้นระบบจะโชว์ Processing... รอจนว่าข้อความจะหายไป
4. กดปุ่ม Sort จากนั้นระบบจะโชว์ Processing... รอจนข้อความจะหายไป
5. กดปุ่ม Activate กรณีที่เป็นเจ้าของ ICAR No. นี้ ถ้ามีคนกดไปแล้วจะไม่สามารถกดได้ยกเว้นว่าคนแรกที่กดจะกดปุ่ม Deactivate
6. เช็ครายการ CC Email โดยคลิ๊กที่กล่องใต้ Activate Status หน้าต่าง list จะปรากฎขึ้น
7. กรณีอยากเพิ่มรายชื่อให้พิมพ์หาด้วยชื่อหรือเมลก็ได้จากนั้นกดเลือก เมื่อเลือกจนครบให้กดปุ่ม Update CC List จากนั้นจะมีเครื่องหมายถูกปรากฎขึ้น

✅ สถานะของ ICAR จะถูกอัปเดตตามสิทธิ์ผู้ใช้งาน
`
  },

  {
    id: 5,
    keywords: [
      "ตอบ Correction",
      "Submit Correction"
    ],
    answer: `
📎 วิธีตอบ Correction

1. กรอกข้อมูลในช่อง Correction โดยไม่ต้องใส่ C1_,C_2,... กรณีกรอกไม่ได้แปลว่าไม่ได้กดปุ่ม Sort หรือ Activate
2. กรณีที่ต้องการเพิ่มช่องสำหรับกรอกข้อมูล ให้กดปุ่ม (+) ด้านบนตาราง
3. ปุ่ม Submit จะปลดล๊อคให้ใช้งาน เมื่อกรอกข้อมูลครบสำหรับหัวข้อ Correction
4. Email จะถูกส่งไปยัง Auditor และผู้ที่เกี่ยวข้องหลังกด Submit อัตโนมัติ

✅ เมื่อโหลดสำเร็จ ระบบจะแสดงข้อความแจ้งด้านบน
`
  },

  {
    id: 6,
    keywords: [
      "ตอบ Why-Why",
      "Submit Why-Why",
      "ตอบ Root Cause",
      "Submit Root Cause"
    ],
    answer: `
📎 วิธีตอบ Root Cause

1. กรณีที่ยังไม่ได้ตอบ Correction ให้ไปตอบ Correction ก่อน
2. กรอกข้อมูลในช่องด้านหลัง Why1 (ไม่ต้องใส่ Why1, Why2,...) กรณีกรอกไม่ได้แปลว่าไม่ได้กดปุ่ม Sort หรือ Activate
3. กรณีที่ต้องการเพิ่มช่องสำหรับกรอกข้อมูล ให้กดปุ่ม (+) ด้านบนตาราง
4. กดปุ่ม Draft เพื่อล๊อคข้อมูล กรณีที่กรอกไม่ครบปุ่ม Draft จะไม่สามารถใช้งานได้
5. ปุ่ม Submit จะปลดล๊อคให้ใช้งาน กรณีที่ยังไม่ได้กดปุ่ม Draft จะไม่ใช้งานปุ่ม Submit ได้
6. Email จะถูกส่งไปยัง Auditor และผู้ที่เกี่ยวข้องหลังกด Submit อัตโนมัติ

✅ เมื่อโหลดสำเร็จ ระบบจะแสดงข้อความแจ้งด้านบน
`
  },

  {
    id: 7,
    keywords: [
      "ตอบ Corrective Action",
      "Submit Corrective Action",
      "ตอบ CA",
      "Submit CA"
    ],
    answer: `
📎 วิธีตอบ Corrective Action

1. กรณีที่ยังไม่ได้ตอบ Root Cause ให้ไปตอบ Root Cause ก่อน เพราะส่วนนี้จะถูกล๊อคไว้
2. กรอกข้อมูลในช่องด้านหลัง CA1 (ไม่ต้องใส่ CA1, CA2,...) กรณีกรอกไม่ได้แปลว่าไม่ได้กดปุ่ม Sort หรือ Activate
3. กรณีที่ต้องการเพิ่มช่องสำหรับกรอกข้อมูล ให้กดปุ่ม (+) ด้านบนตาราง
4. ปุ่ม Submit จะปลดล๊อคให้ใช้งาน เมื่อกรอกข้อมูลครบสำหรับหัวข้อ Corrective Action
5. Email จะถูกส่งไปยัง Auditor และผู้ที่เกี่ยวข้องหลังกด Submit อัตโนมัติ

✅ เมื่อโหลดสำเร็จ ระบบจะแสดงข้อความแจ้งด้านบน
`
  },

  {
    id: 8,
    keywords: [
      "Submit Evidence",
      "CA Evidence",
      "Correction Evidence",
      "แนบไฟล์",
      "แนบหลักฐาน",
      "แนบEvidence"
    ],
    answer: `
📎 วิธีการแนบไฟล์ Evidence

1. ผู้ใช้งานจะต้องทำขั้นตอนการรับ ICAR Report ก่อนถึงจะสามารถแนบไฟล์ได้
2. เลือก Tab ชื่อ ICAR Report แล้วเลื่อนลงด้านล่าง
3. สังเกตุหัวข้อชื่อ Evidence for Correction Containment Action/......
4. ด้านล่างจะมีปุ่ม Correction Evidence และ Corrective Action Evidence อยู่ด้านบนกล่องสี่เหลี่ยม
5. คลิ๊กเลือกประเภทของ Evidence ที่ต้องการแนบไฟล์ กรณีที่ CA Report ยังไม่อนุมัติจะยังไม่สามารถแนบไฟล์ Corrective Action ได้
6. กดค้นหาไฟล์ที่ Attach file ที่ด้านขวาแล้วเลือกไฟล์ที่ต้องการแนบ
7. กดปุ่ม Submit จากนั้นจะมีข้อความด้านบนแจ้งว่าแนบไฟล์สำเร็จและในกล่องด้านซ้ายจะมีรายการไฟล์ที่แนบ
Remark:สามารถเปิดไฟล์ดูได้จากสัญลักษณ์พิเศษด้านหลังชื่อไฟล์

✅ เมื่อโหลดสำเร็จ ระบบจะแสดงข้อความแจ้งด้านบน
`
  },

];

function findFAQ(text) {

  const userText = text.toLowerCase();

  return FAQS.find(item =>
    item.keywords.some(keyword =>
      userText.includes(keyword.toLowerCase())
    )
  );
}

console.log("FAQ Loaded");

//export default FAQS;
