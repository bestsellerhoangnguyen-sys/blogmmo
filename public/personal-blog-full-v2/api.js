/* =============================================================
 * API CLIENT — small fetch wrapper talking to /api/*
 * Cookies (JWT) sent automatically via credentials: 'include'
 * ============================================================= */

const API_BASE = window.__API_BASE__ || '/api';

async function req(path, { method = 'GET', body, headers = {}, raw = false } = {}) {
  const opts = {
    method,
    credentials: 'include',
    headers: { ...headers },
  };
  if (body !== undefined) {
    if (body instanceof FormData) {
      opts.body = body; // let browser set Content-Type
    } else {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
  }
  const res = await fetch(API_BASE + path, opts);
  if (raw) return res;
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    const err = new Error(data?.error || res.statusText);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

function safeJson(str) {
  try { return JSON.parse(str); } catch { return str; }
}

export const api = {
  // ---- Auth ----
  login: (username, password) => req('/auth/login', { method: 'POST', body: { username, password } }),
  logout: () => req('/auth/logout', { method: 'POST' }),
  me: () => req('/auth/me'),

  // ---- Posts ----
  listPosts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return req('/posts' + (qs ? '?' + qs : ''));
  },
  getPostBySlug: (slug) => req('/posts/by-slug/' + encodeURIComponent(slug)),
  getPost: (id) => req('/posts/' + id),
  createPost: (data) => req('/posts', { method: 'POST', body: data }),
  updatePost: (id, data) => req('/posts/' + id, { method: 'PUT', body: data }),
  deletePost: (id) => req('/posts/' + id, { method: 'DELETE' }),
  reactPost: (id, emoji) => req('/posts/' + id + '/react', { method: 'POST', body: { emoji } }),

  // ---- Categories ----
  listCategories: () => req('/categories'),
  createCategory: (data) => req('/categories', { method: 'POST', body: data }),
  updateCategory: (id, data) => req('/categories/' + id, { method: 'PUT', body: data }),
  deleteCategory: (id) => req('/categories/' + id, { method: 'DELETE' }),

  // ---- Comments ----
  listCommentsForPost: (postId) => req('/comments/post/' + postId),
  postComment: (postId, data) => req('/comments/post/' + postId, { method: 'POST', body: data }),
  listAllComments: (status) => req('/comments' + (status ? '?status=' + status : '')),
  moderateComment: (id, status) => req('/comments/' + id, { method: 'PATCH', body: { status } }),
  deleteComment: (id) => req('/comments/' + id, { method: 'DELETE' }),

  // ---- Media ----
  listMedia: (type) => req('/media' + (type ? '?type=' + type : '')),
  uploadMedia: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return req('/media', { method: 'POST', body: fd });
  },
  deleteMedia: (id) => req('/media/' + id, { method: 'DELETE' }),

  // ---- Subscribers ----
  subscribe: (email) => req('/subscribers', { method: 'POST', body: { email } }),
  listSubscribers: () => req('/subscribers'),
  exportSubscribersUrl: () => API_BASE + '/subscribers/export.csv',
  deleteSubscriber: (id) => req('/subscribers/' + id, { method: 'DELETE' }),

  // ---- Settings ----
  getSettings: () => req('/settings'),
  updateSettings: (key, value) => req('/settings/' + key, { method: 'PUT', body: value }),

  // ---- Health ----
  health: () => req('/health'),
};

window.api = api; // expose globally for inline scripts in index.html / admin.html
