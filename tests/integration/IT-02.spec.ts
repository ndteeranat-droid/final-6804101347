import { test, expect } from '@playwright/test';

// 1. สร้างฟังก์ชัน driverOpenInventory() ทำหน้าที่ Driver เตรียมสถานะ Login และเปิดหน้า Inventory
async function driverOpenInventory(browser: any) {
  const context = await browser.newContext();
  
  // 2. ใช้ BrowserContext.addCookies() กำหนด Cookie session-username เป็น standard_user บนโดเมน www.saucedemo.com
  await context.addCookies([
    {
      name: 'session-username',
      value: 'standard_user',
      domain: 'www.saucedemo.com',
      path: '/'
    }
  ]);

  const page = await context.newPage();
  // 3. ใช้ Driver เปิด https://www.saucedemo.com/inventory.html โดยตรง ไม่ผ่าน Login Form
  await page.goto('https://www.saucedemo.com/inventory.html');
  return { context, page };
}

test('IT-02: DRIVER login state -> REAL Inventory and Cart', {
  annotation: {
    type: 'description',
    description: 'ใช้ Driver เตรียมสถานะ Login เพื่อทดสอบ Inventory และ Cart จริง'
  }
}, async ({ browser }) => {
  let context: any;
  let page: any;

  await test.step('สร้าง Driver และเปิด Inventory', async () => {
    const driverResult = await driverOpenInventory(browser);
    context = driverResult.context;
    page = driverResult.page;
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  await test.step('ตรวจสอบ Inventory จริง', async () => {
    // 4. ตรวจสอบหน้า Inventory แสดงสินค้าครบ 6 รายการ
    const inventoryItems = page.locator('.inventory_item');
    await expect(inventoryItems).toHaveCount(6);
  });

  await test.step('เพิ่มสินค้า 2 รายการ', async () => {
    // 5. เพิ่มสินค้า Sauce Labs Backpack ลง Shopping Cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // 6. เพิ่มสินค้า Sauce Labs Bike Light ลง Shopping Cart
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // 7. ตรวจสอบ Cart Badge เป็น 2
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('2');
  });

  await test.step('ตรวจสอบสินค้าใน Cart', async () => {
    // 8. เปิดหน้า Shopping Cart
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart.html/);

    // 9. ตรวจสอบว่ามีสินค้าทั้งสองรายการอยู่ใน Cart
    const cartItemNames = page.locator('.inventory_item_name');
    await expect(cartItemNames).toHaveCount(2);
    await expect(cartItemNames.nth(0)).toHaveText('Sauce Labs Backpack');
    await expect(cartItemNames.nth(1)).toHaveText('Sauce Labs Bike Light');
  });

  // ปิด BrowserContext ที่สร้างเองเมื่อสิ้นสุดการทดสอบ
  await context.close();
});