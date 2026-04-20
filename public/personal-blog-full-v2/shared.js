/* =============================================================
 * SHARED HELPERS — formatting, slugify, embed hydration, toast, …
 * Data operations live in api.js (backend-powered).
 * ============================================================= */

export const MOODS = {
  '😊': 'Vui', '🌿': 'Thư thái', '💡': 'Phấn khởi', '🌧️': 'Trầm lắng',
  '🔥': 'Năng lượng', '🧠': 'Tập trung', '❤️': 'Biết ơn', '🌙': 'Mơ mộng',
  '☕': 'Thong thả', '✨': 'Hứng khởi', '🌊': 'Bình yên', '📚': 'Nghiền ngẫm',
};

/* ---------- formatters ---------- */
export function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
}
export function fmtDateShort(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
}
export function fmtDateTime(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('vi-VN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/* ---------- slug ---------- */
export function slugify(str) {
  return (str || '')
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/* ---------- text helpers ---------- */
export function countWords(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}
export function readingTime(html) {
  return Math.max(1, Math.round(countWords(html) / 220));
}
export function htmlEscape(s) {
  return (s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------- embed hydration ---------- */
export function hydrateEmbeds(root) {
  if (!root) return;
  // YouTube
  root.querySelectorAll('[data-embed="youtube"][data-src]').forEach((el) => {
    if (el.dataset.hydrated) return;
    const id = el.dataset.src;
    el.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
    el.dataset.hydrated = '1';
  });
  // Vimeo
  root.querySelectorAll('[data-embed="vimeo"][data-src]').forEach((el) => {
    if (el.dataset.hydrated) return;
    el.innerHTML = `<iframe src="https://player.vimeo.com/video/${el.dataset.src}" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
    el.dataset.hydrated = '1';
  });
  // Spotify
  root.querySelectorAll('[data-embed="spotify"][data-src]').forEach((el) => {
    if (el.dataset.hydrated) return;
    el.innerHTML = `<iframe src="${el.dataset.src}" width="100%" height="152" frameborder="0" allowtransparency="true" allow="encrypted-media" loading="lazy"></iframe>`;
    el.dataset.hydrated = '1';
  });
  // SoundCloud
  root.querySelectorAll('[data-embed="soundcloud"][data-src]').forEach((el) => {
    if (el.dataset.hydrated) return;
    const url = encodeURIComponent(el.dataset.src);
    el.innerHTML = `<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=${url}&color=%23c2410c" loading="lazy"></iframe>`;
    el.dataset.hydrated = '1';
  });
  // Twitter/X
  root.querySelectorAll('[data-embed="twitter"][data-src]').forEach((el) => {
    if (el.dataset.hydrated) return;
    const url = el.dataset.src;
    el.innerHTML = `<blockquote class="twitter-quote">${htmlEscape(el.dataset.text || '')} <br><a href="${url}" target="_blank" rel="noopener">${url}</a></blockquote>`;
    el.dataset.hydrated = '1';
  });
  // Google Maps
  root.querySelectorAll('[data-embed="map"][data-src]').forEach((el) => {
    if (el.dataset.hydrated) return;
    el.innerHTML = `<iframe src="${el.dataset.src}" width="100%" height="320" style="border:0;border-radius:10px" loading="lazy" allowfullscreen></iframe>`;
    el.dataset.hydrated = '1';
  });
}

/* ---------- toast ---------- */
export function toast(msg, duration = 2200) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), duration);
}

/* ---------- theme ---------- */
export function applyTheme(name) {
  document.documentElement.classList.remove('dark', 'sepia');
  if (name === 'dark' || name === 'sepia') document.documentElement.classList.add(name);
  localStorage.setItem('blog_theme', name);
}
export function getTheme() {
  return localStorage.getItem('blog_theme') || 'light';
}

/* ---------- apply site settings (accent color, fonts) ---------- */
export function applySiteSettings(settings) {
  if (!settings) return;
  const s = settings.appearance || {};
  if (s.accent) {
    document.documentElement.style.setProperty('--accent', s.accent);
  }
  if (settings.site?.title) {
    document.title = settings.site.title;
  }
}

/* ---------- expose as globals (for inline scripts in HTML) ---------- */
Object.assign(window, {
  MOODS, fmtDate, fmtDateShort, fmtDateTime, slugify,
  countWords, readingTime, htmlEscape, hydrateEmbeds,
  toast, applyTheme, getTheme, applySiteSettings,
});
