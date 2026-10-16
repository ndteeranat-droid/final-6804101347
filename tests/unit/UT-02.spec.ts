import { test, expect } from '@playwright/test';

test('UT-02: product button state Add to cart -> Remove -> Add to cart', {
  annotation: {
    type: 'description',
    description: 'ตรวจสอบสถานะปุ่ม Add to cart และ Remove รวมถึง Cart Badge'
  }
}, async ({ page }) => {
  await test.step('Login เข้าสู่ระบบ', async () => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  await test.step('ตรวจสอบปุ่มก่อนเพิ่มสินค้า', async () => {
    const addToCartBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(addToCartBtn).toBeVisible();
    await expect(addToCartBtn).toHaveText('Add to cart');
  });

  await test.step('เพิ่มสินค้าเข้า Cart', async () => {
    const addToCartBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await addToCartBtn.click();

    // ตรวจสอบว่าปุ่มเปลี่ยนเป็น Remove
    const removeBtn = page.locator('[data-test="remove-sauce-labs-backpack"]');
    await expect(removeBtn).toBeVisible();
    await expect(removeBtn).toHaveText('Remove');

    // ตรวจสอบว่า Cart Badge แสดงเลข 1
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');
  });

  await test.step('ลบสินค้าออกจาก Cart', async () => {
    const removeBtn = page.locator('[data-test="remove-sauce-labs-backpack"]');
    await removeBtn.click();

    // ตรวจสอบว่าปุ่มกลับมาเป็น Add to cart
    const addToCartBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(addToCartBtn).toBeVisible();
    await expect(addToCartBtn).toHaveText('Add to cart');

    // ตรวจสอบว่า Cart Badge หายไป (ไม่แสดงตัวเลข)
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).not.toBeVisible();
  });
});