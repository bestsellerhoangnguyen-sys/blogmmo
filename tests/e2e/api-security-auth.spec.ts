import { test, expect, request as playwrightRequest } from '@playwright/test';

const adminEmail = process.env.E2E_ADMIN_EMAIL || 'admin@blogmmo.local';
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

test.describe('api security with authenticated session', () => {
  test.skip(!adminPassword, 'E2E_ADMIN_PASSWORD not provided');

  test('authenticated create post succeeds with valid csrf token', async ({ page, context, baseURL }) => {
    await page.goto('/login');
    await page.getByPlaceholder('admin@blogmmo.local').fill(adminEmail);
    await page.getByPlaceholder('******').fill(adminPassword!);
    await page.getByRole('button', { name: 'Login with Credentials' }).click();

    await page.waitForURL('**/');

    const api = await playwrightRequest.newContext({
      baseURL,
      storageState: await context.storageState(),
    });

    const csrfRes = await api.get('/api/csrf');
    expect(csrfRes.ok()).toBeTruthy();
    const csrf = await csrfRes.json();
    const csrfToken = csrf.token as string;

    const slug = `auth-pass-${Date.now()}`;
    const createRes = await api.post('/api/posts', {
      headers: {
        'content-type': 'application/json',
        'x-csrf-token': csrfToken,
      },
      data: {
        title: `Auth pass ${Date.now()}`,
        slug,
        content: '# secure create',
        excerpt: 'created by e2e',
        published: false,
      },
    });

    expect(createRes.status()).toBe(201);
    const created = await createRes.json();
    expect(created.slug).toBe(slug);

    const delRes = await api.delete(`/api/posts/${created.id}`, {
      headers: { 'x-csrf-token': csrfToken },
    });
    expect(delRes.ok()).toBeTruthy();

    await api.dispose();
  });

  test('authenticated request with invalid csrf token returns 403', async ({ page, context, baseURL }) => {
    await page.goto('/login');
    await page.getByPlaceholder('admin@blogmmo.local').fill(adminEmail);
    await page.getByPlaceholder('******').fill(adminPassword!);
    await page.getByRole('button', { name: 'Login with Credentials' }).click();

    await page.waitForURL('**/');

    const api = await playwrightRequest.newContext({
      baseURL,
      storageState: await context.storageState(),
    });

    const res = await api.post('/api/posts', {
      headers: {
        'content-type': 'application/json',
        'x-csrf-token': 'invalid-token',
      },
      data: {
        title: 'Should fail csrf',
        slug: `csrf-fail-${Date.now()}`,
        content: 'x',
        published: false,
      },
    });

    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.error).toContain('CSRF');

    await api.dispose();
  });
});
