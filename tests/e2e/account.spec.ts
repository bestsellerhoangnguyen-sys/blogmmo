import { test, expect } from '@playwright/test';

test('register page loads', async ({ page }) => {
  await page.goto('/register');
  await expect(page.getByRole('heading', { name: 'Tạo tài khoản' })).toBeVisible();
});

test('register api validates short password', async ({ request }) => {
  const res = await request.post('/api/auth/register', {
    data: { email: `short-${Date.now()}@example.com`, password: '1234567' },
  });
  expect(res.status()).toBe(400);
});

test('register api can create user', async ({ request }) => {
  const email = `user-${Date.now()}@example.com`;
  const res = await request.post('/api/auth/register', {
    data: { email, password: '12345678', name: 'Test User' },
  });
  expect(res.status()).toBe(201);
  const json = await res.json();
  expect(json.email).toBe(email);
});
