import { test, expect } from '@playwright/test';

test('unauthorized mutation returns 401', async ({ request }) => {
  const res = await request.post('/api/posts', {
    data: { title: 'x', slug: 'x', content: 'x' },
  });
  expect(res.status()).toBe(401);
});

test('auth endpoint gets rate-limited under burst', async ({ request }) => {
  const burst = Array.from({ length: 35 }, () =>
    request.get('/api/auth/session')
  );

  const results = await Promise.all(burst);
  const statuses = results.map((r) => r.status());

  expect(statuses.some((s) => s === 429)).toBeTruthy();
});

test('api 429 includes retry-after header', async ({ request }) => {
  let last429: Awaited<ReturnType<typeof request.get>> | null = null;

  for (let i = 0; i < 40; i++) {
    const res = await request.get('/api/auth/session');
    if (res.status() === 429) {
      last429 = res;
      break;
    }
  }

  expect(last429).not.toBeNull();
  const retryAfter = last429!.headers()['retry-after'];
  expect(retryAfter).toBeTruthy();
});
