import { test, expect } from '@playwright/test';

test('ST-02: checkout validation and recovery', {
  annotation: {
    type: 'description',
    description: 'ตรวจสอบ Checkout Validation และการแก้ไขข้อมูลจนสั่งซื้อสำเร็จ'
  }
}, async ({ page }) => {
  await test.step('Login เพิ่มสินค้า และเปิด Checkout', async () => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/.*inventory.html/);

    // เพิ่มสินค้า Backpack ลงตะกร้า
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart.html/);

    // ไปยังหน้า Checkout
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
  });

  await test.step('ตรวจสอบ First Name is required', async () => {
    // ไม่กรอกข้อมูลใดๆ แล้วคลิก Continue
    await page.locator('[data-test="continue"]').click();
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/First Name is required/);
  });

  await test.step('ตรวจสอบ Last Name is required', async () => {
    // กรอก First Name เป็น John แต่เว้น Last Name แล้วคลิก Continue
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="continue"]').click();
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/Last Name is required/);
  });

  await test.step('ตรวจสอบ Postal Code is required', async () => {
    // กรอก Last Name เป็น Doe แต่เว้น Postal Code แล้วคลิก Continue
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="continue"]').click();
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/Postal Code is required/);
  });

  await test.step('แก้ไขข้อมูลและสั่งซื้อสำเร็จ', async () => {
    // กรอก Postal Code เป็น 50000 แล้วคลิก Continue
    await page.locator('[data-test="postalCode"]').fill('50000');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/.*checkout-step-two.html/);

    // คลิก Finish และตรวจสอบข้อความสำเร็จ
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/.*checkout-complete.html/);

    const completeHeader = page.locator('[data-test="complete-header"]');
    await expect(completeHeader).toHaveText('Thank you for your order!');
  });
});