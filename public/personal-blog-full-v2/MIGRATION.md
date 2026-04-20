# Migrating the v1 frontend to the v2 API

The v1 `index.html` and `admin.html` used `localStorage` directly via `loadData()` / `saveData()` in `shared.js`. v2 keeps the exact same UI but backs those functions with the Express + Postgres API.

## What changed

| v1 (localStorage) | v2 (API) |
|---|---|
| `shared.js` exported `loadData()` / `saveData()` | Same functions live in `data-store.js`, backed by `api.js` |
| Data seeded via `DEMO_*` constants | Data seeded via backend `seed.js` into Postgres |
| Synchronous reads | Must call `await initStore()` once at page load |
| Writes immediate | Writes are async (`await saveData(...)`) |
| Media = dataURL in localStorage | Media = S3 URL (upload via `api.uploadMedia(file)`) |

## Minimal changes needed in existing HTML

In **both** `index.html` and `admin.html`, replace the `<script src="shared.js">` line with:

```html
<script type="module">
  import { api } from './api.js';
  import './shared.js';            // helpers, hydrateEmbeds, etc
  import { initStore } from './data-store.js';

  // for reader: no admin data
  // for admin.html, pass { withAdmin: true }
  await initStore(/* { withAdmin: true } */);
  // then fire your existing init() or routing function
  if (window.boot) window.boot();
</script>
```

Wrap the existing top-level init code in a `function boot() { … }` and call it *after* `await initStore()` resolves.

## Replacing specific patterns

### Adding/updating a post (admin editor)

Before (v1):
```js
const data = loadData();
data.posts.push(newPost);
saveData(data);
```

After (v2):
```js
const { id, slug } = await api.createPost(newPost);
await refresh('posts'); // pulls fresh list into cache
```

### Posting a comment (public)

Before:
```js
const data = loadData();
data.comments.push({ ...c, status: 'pending' });
saveData(data);
```

After:
```js
await api.postComment(postId, { author, email, content });
toast('Bình luận sẽ hiển thị sau khi được duyệt.');
```

### Uploading media

Before: `reader.readAsDataURL(file)` → store in localStorage.

After:
```js
const { media } = await api.uploadMedia(file);
insertImageIntoEditor(media.url);
```

### Login (admin)

Before: just stored a flag in sessionStorage.

After:
```js
try {
  await api.login(username, password);
  location.reload();
} catch (e) {
  toast('Sai tài khoản hoặc mật khẩu.');
}
```

### Settings

```js
await api.updateSettings('appearance', { accent: '#c2410c', theme: 'light' });
```

## Why the compat layer

`data-store.js` keeps the rest of the UI working with the v1 pattern of `const data = loadData();` — it just reads from an in-memory cache that was populated from the API at page load. Writes that touch `data.posts`, `data.comments`, `data.media` directly (v1 style) should be replaced with the specific `api.*` calls listed above.

Everything else — typography, routing, TOC, lightbox, slash menu, cookie banner — stays untouched.

## Rollout tip

1. Deploy backend with `docker compose up -d`.
2. First point the **reader** (`index.html`) at the API — it needs only 3 API calls (settings, categories, posts). Confirm it works.
3. Then wire the **admin** — login, editor save, media upload, comments moderation, settings.
4. Keep v1 (localStorage) build on a staging URL until v2 is verified.
