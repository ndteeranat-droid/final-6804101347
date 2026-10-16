import { test, expect } from '@playwright/test';

test('ST-01: complete purchase of two products', {
  annotation: {
    type: 'description',
    description: 'ทดสอบการซื้อ Backpack และ Bike Light ตั้งแต่ Login จนสั่งซื้อสำเร็จ'
  }
}, async ({ page }) => {
  await test.step('Login และตรวจสอบ Inventory', async () => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  await test.step('เพิ่มสินค้าสองรายการ', async () => {
    // เพิ่ม Sauce Labs Backpack และ Sauce Labs Bike Light
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // ตรวจสอบ Cart Badge แสดง 2
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('2');
  });

  await test.step('ตรวจสอบ Cart', async () => {
    // เปิด Shopping Cart และตรวจสอบสินค้าทั้งสองรายการ
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart.html/);

    const cartItems = page.locator('.inventory_item_name');
    await expect(cartItems).toHaveCount(2);
    await expect(cartItems.nth(0)).toHaveText('Sauce Labs Backpack');
    await expect(cartItems.nth(1)).toHaveText('Sauce Labs Bike Light');
  });

  await test.step('กรอก Checkout Information', async () => {
    // คลิก Checkout และกรอกข้อมูลลูกค้าให้ครบถ้วน
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    await page.locator('[data-test="firstName"]').fill('Software');
    await page.locator('[data-test="lastName"]').fill('Testing');
    await page.locator('[data-test="postalCode"]').fill('10110');
    
    // คลิก Continue เพื่อเข้าสู่ Checkout Overview
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
  });

  await test.step('ตรวจสอบ Overview และสั่งซื้อ', async () => {
    // ตรวจสอบว่า Checkout Overview แสดงสินค้าทั้งสองรายการถูกต้อง
    const overviewItems = page.locator('.inventory_item_name');
    await expect(overviewItems).toHaveCount(2);
    await expect(overviewItems.nth(0)).toHaveText('Sauce Labs Backpack');
    await expect(overviewItems.nth(1)).toHaveText('Sauce Labs Bike Light');

    // คลิก Finish
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/.*checkout-complete.html/);
  });

  await test.step('ตรวจสอบ Order Complete', async () => {
    // ตรวจสอบข้อความ Thank you for your order!
    const completeHeader = page.locator('[data-test="complete-header"]');
    await expect(completeHeader).toHaveText('Thank you for your order!');
  });
});