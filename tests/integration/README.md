# Software Testing Final Exam - 6804101347

## รายละเอียดโปรเจกต์ (Project Overview)
โปรเจกต์นี้จัดทำขึ้นเพื่อส่งงานสอบปลายภาค รายวิชา Software Testing 
- **ระบบเป้าหมาย:** https://www.saucedemo.com/
- **เครื่องมือ:** Playwright Test (TypeScript)

---

## Integration Testing Explanation (IT-01)
การทดสอบ Top-Down Integration Testing ในข้อ IT-01 มีการแบ่งส่วนประกอบออกเป็น Real และ Stub ดังนี้:

- **Real Component (Top-Level):** 
  - กระบวนการ **Login จริง** ที่เชื่อมต่อไปยังระบบเว็บไซต์ SauceDemo (`https://www.saucedemo.com/`) 
  - ทำหน้าที่ทดสอบการทำงานจริงของฟอร์มเข้าสู่ระบบและการพิสูจน์ตัวตน (Authentication) ของผู้ใช้งานจริง
  
- **Stub Component (Lower-Level / Sub-module):** 
  - หน้า **Inventory** ที่ถูกจำลองขึ้นมาใหม่ด้วยฟังก์ชัน `page.setContent()` 
  - ทำหน้าที่จำลอง DOM และข้อมูลสินค้าทดสอบ (`Mock Backpack` และ `Mock Bike Light`) เพื่อตัดการพึ่งพาฐานข้อมูลหรือ Backend ของหน้าสินค้าจริง ช่วยให้การทดสอบระบบเฉพาะส่วนทำได้รวดเร็วและควบคุมผลลัพธ์ได้ตามต้องการ

  ## Integration Testing Explanation (IT-02)
การทดสอบ Bottom-Up Integration Testing ในข้อ IT-02 มีการแบ่งบทบาทดังนี้:
- **Driver Role (Bottom-Level Driver):** 
  - ฟังก์ชัน `driverOpenInventory()` ทำหน้าที่เป็น Driver ที่จำลองระดับล่าง (Lower-Level Helper) ในการเตรียมสถานะ Cookie (`session-username: standard_user`) และเปิดหน้า Inventory โดยตรง เพื่อข้ามขั้นตอนการกรอกฟอร์ม Login ปกติ
- **Real Component (Top-Level):** 
  - ส่วนของหน้า **Inventory** และระบบตะกร้าสินค้า (**Shopping Cart**) ที่ทำงานบนเว็บไซต์จริง (`https://www.saucedemo.com/inventory.html`) เพื่อทดสอบการบูรณาการระบบสินค้าและการเพิ่มสินค้าลงตะกร้าจริง

  