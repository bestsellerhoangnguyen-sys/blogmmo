import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'BlogMMO' })).toBeVisible();
});

test('blog and guides pages load', async ({ page }) => {
  await page.goto('/blog');
  await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();

  await page.goto('/guides');
  await expect(page.getByRole('heading', { name: 'Guides', exact: true })).toBeVisible();
});

test('health endpoint returns ok', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json.ok).toBeTruthy();
});
