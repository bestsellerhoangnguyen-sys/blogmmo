/* =============================================================
 * DATA STORE — in-memory cache backed by the API.
 *
 * Exposes loadData()/saveData() compatible with v1 (localStorage),
 * but actually talks to /api/* under the hood.
 *
 * Usage:
 *   await initStore();      // fetch everything once
 *   const data = loadData(); // sync read from cache
 *   await saveData({ posts }); // writes through to backend
 * ============================================================= */

import { api } from './api.js';

const CACHE = {
  settings: {},
  categories: [],
  posts: [],
  comments: [],
  subscribers: [],
  media: [],
  me: null,
};

export async function initStore({ withAdmin = false } = {}) {
  const [settings, categoriesRes, postsRes] = await Promise.all([
    api.getSettings().catch(() => ({ settings: {} })),
    api.listCategories().catch(() => ({ categories: [] })),
    api.listPosts({ limit: 100 }).catch(() => ({ posts: [] })),
  ]);

  CACHE.settings   = settings.settings || {};
  CACHE.categories = categoriesRes.categories || [];
  CACHE.posts      = postsRes.posts || [];

  if (withAdmin) {
    try { CACHE.me = (await api.me()).user; } catch { CACHE.me = null; }
    try { CACHE.comments    = (await api.listAllComments()).comments || []; } catch {}
    try { CACHE.subscribers = (await api.listSubscribers()).subscribers || []; } catch {}
    try { CACHE.media       = (await api.listMedia()).media || []; } catch {}
  }
  return CACHE;
}

/** v1-compatible sync read (cache-only) */
export function loadData() {
  return CACHE;
}

/** v1-compatible write: accepts a partial object and writes each section to the API */
export async function saveData(partial = {}) {
  const jobs = [];
  if (partial.settings) {
    for (const [key, value] of Object.entries(partial.settings)) {
      jobs.push(api.updateSettings(key, value).catch((e) => console.error('save settings', key, e)));
      CACHE.settings[key] = value;
    }
  }
  // posts/comments/etc use their own CRUD endpoints — don't bulk-write
  await Promise.all(jobs);
}

/** Helpers equivalent to v1 */
export function getPosts({ includeDrafts = false } = {}) {
  return includeDrafts
    ? CACHE.posts
    : CACHE.posts.filter((p) => p.status === 'published');
}

export function getPostBySlug(slug) {
  return CACHE.posts.find((p) => p.slug === slug);
}

export function getPostById(id) {
  return CACHE.posts.find((p) => p.id === id);
}

export function getCategoryBySlug(slug) {
  return CACHE.categories.find((c) => c.slug === slug);
}

/** Refresh a single section of the cache */
export async function refresh(section) {
  switch (section) {
    case 'posts': {
      const r = await api.listPosts({ limit: 100, status: CACHE.me ? 'all' : undefined });
      CACHE.posts = r.posts;
      break;
    }
    case 'categories': {
      const r = await api.listCategories();
      CACHE.categories = r.categories;
      break;
    }
    case 'comments': {
      const r = await api.listAllComments();
      CACHE.comments = r.comments;
      break;
    }
    case 'media': {
      const r = await api.listMedia();
      CACHE.media = r.media;
      break;
    }
    case 'subscribers': {
      const r = await api.listSubscribers();
      CACHE.subscribers = r.subscribers;
      break;
    }
    case 'settings': {
      const r = await api.getSettings();
      CACHE.settings = r.settings;
      break;
    }
  }
}

Object.assign(window, { initStore, loadData, saveData, getPosts, getPostBySlug, getPostById, getCategoryBySlug, refresh });
