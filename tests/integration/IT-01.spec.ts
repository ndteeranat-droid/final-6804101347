import { test, expect } from '@playwright/test';

test('IT-01: top-down REAL Login -> browser-level Inventory STUB', {
  annotation: {
    type: 'description',
    description: 'ทดสอบ Login จริงร่วมกับ Inventory Stub ที่จำลองด้วย page.setContent()'
  }
}, async ({ page }) => {
  await test.step('Login ผ่านหน้าเว็บไซต์จริง', async () => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  await test.step('สร้าง Inventory Stub', async () => {
    await page.setContent(`
      <div>
        <h1>Mock Inventory Ready</h1>
        <div class="inventory_list">
          <div class="inventory_item">
            <div class="inventory_item_name">Mock Backpack</div>
          </div>
          <div class="inventory_item">
            <div class="inventory_item_name">Mock Bike Light</div>
          </div>
        </div>
      </div>
    `);
  });

  await test.step('ตรวจสอบผลจาก Stub', async () => {
    // ตรวจสอบข้อความ Mock Inventory Ready
    const header = page.locator('h1');
    await expect(header).toHaveText('Mock Inventory Ready');

    // ตรวจสอบจำนวนสินค้าจำลอง 2 รายการ
    const items = page.locator('.inventory_item');
    await expect(items).toHaveCount(2);

    // ตรวจสอบชื่อสินค้าจำลอง
    await expect(items.nth(0)).toContainText('Mock Backpack');
    await expect(items.nth(1)).toContainText('Mock Bike Light');
  });
});