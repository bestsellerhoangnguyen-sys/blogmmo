/* ================================================================
 * SHARED DATA & HELPERS — dùng chung cho index.html và admin.html
 * Dữ liệu lưu trong localStorage key "blog_data"
 * ================================================================ */

const BLOG_STORAGE_KEY = 'blog_data_v1';

const MOODS = {
  '🌧': 'Man mác', '☕': 'Thư giãn', '🤔': 'Suy tư',
  '💭': 'Hoài niệm', '🔥': 'Hào hứng', '😌': 'Bình yên',
  '😊': 'Vui vẻ', '🥲': 'Xúc động', '😢': 'Buồn',
  '🌅': 'Hy vọng', '🎵': 'Âm nhạc', '✨': 'Kỳ diệu',
};

const DEFAULT_SETTINGS = {
  siteTitle: 'Nhật ký',
  siteTagline: 'Blog cá nhân của Anh Hoàng',
  siteDescription: 'Nơi tôi viết về đời sống, những chuyến đi, những cuốn sách, và đôi khi là cà phê một mình.',
  authorName: 'Anh Hoàng',
  authorBio: 'Người viết, người đọc, người pha cà phê vụng về.',
  authorEmail: 'hello@nhatky.blog',
  authorAvatar: '',
  accent: '#c2410c',
  defaultTheme: 'light',
  social: {
    facebook: '', twitter: '', github: '', instagram: '',
  },
  seo: {
    defaultTitle: 'Nhật ký — Blog cá nhân',
    defaultDesc: 'Những ghi chép nhỏ cho một ngày vừa trôi qua.',
  },
  cookieConsent: true,
  showReactions: true,
  showComments: true,
};

const DEMO_CATEGORIES = [
  { id: 'life', name: 'Đời sống', slug: 'doi-song', color: '#c2410c' },
  { id: 'travel', name: 'Du lịch', slug: 'du-lich', color: '#0891b2' },
  { id: 'books', name: 'Sách', slug: 'sach', color: '#7c3aed' },
  { id: 'tech', name: 'Công nghệ', slug: 'cong-nghe', color: '#059669' },
  { id: 'thoughts', name: 'Suy ngẫm', slug: 'suy-ngam', color: '#be185d' },
];

const DEMO_POSTS = [
  {
    id: 'p1',
    title: 'Chiều mưa Đà Lạt và ly cà phê muộn',
    slug: 'chieu-mua-da-lat',
    excerpt: 'Đà Lạt hôm nay mưa từ trưa. Tôi ngồi trong một quán nhỏ bên hông dốc, nhìn những giọt nước chạy dài trên khung kính, và nghĩ về những điều rất cũ.',
    status: 'published', featured: true,
    mood: '🌧', tags: ['du lịch', 'đời sống', 'cà phê'],
    categoryId: 'travel',
    date: '2026-04-18', readTime: 5,
    cover: 'linear-gradient(135deg, #8b7355, #3d2817)',
    coverImage: '',
    signature: 'Viết tại Đà Lạt, một chiều mưa lất phất.',
    dropCap: true,
    views: 1284,
    content: `<p>Đà Lạt hôm nay mưa từ trưa. Tôi ngồi trong một quán nhỏ bên hông dốc, nhìn những giọt nước chạy dài trên khung kính, và nghĩ về những điều rất cũ. Có những ngày như vậy — ngày mà thời gian dường như đặc lại thành một thứ chất lỏng, chảy chậm qua mọi thứ, kể cả suy nghĩ.</p>
<p>Có lẽ thành phố này được sinh ra để buộc người ta chậm lại. Không khí ẩm, mùi thông, tiếng mưa rơi đều đều lên mái tôn — tất cả cộng lại thành một thứ âm thanh rất lạ, khiến lòng mình dịu đi.</p>
<blockquote>"Đôi khi, hạnh phúc chỉ đơn giản là một chỗ ngồi có mái che, và một ly cà phê còn đủ ấm."</blockquote>
<h2 id="nhung-con-doc">Những con dốc</h2>
<p>Tôi đi bộ rất nhiều. Những con dốc của Đà Lạt lúc nào cũng dài hơn mình tưởng, và luôn có điều gì đó ở cuối dốc khiến mình muốn bước tiếp — một tiệm sách cũ, một hàng hoa, một người lạ đang cười.</p>
<div class="callout">💡 Mẹo nhỏ cho người mới đến Đà Lạt: đừng thuê xe máy vội. Hãy đi bộ ít nhất một ngày đầu tiên — thành phố này chỉ mở ra khi bạn đi đủ chậm.</div>
<h2 id="video-chieu-mua">Video: Chiều mưa ở quán</h2>
<p>Một đoạn video ngắn tôi quay được, tiếng mưa và tiếng nhạc nền:</p>
<div class="embed-youtube" data-video-id="5qap5aO4i9A"></div>
<h2 id="thu-vien-anh">Thư viện ảnh</h2>
<div class="gallery">
  <div class="gallery-item" style="background: linear-gradient(135deg, #8b7355, #3d2817);"></div>
  <div class="gallery-item" style="background: linear-gradient(135deg, #a68968, #5d4529);"></div>
  <div class="gallery-item" style="background: linear-gradient(135deg, #6b5d42, #2d1e10);"></div>
  <div class="gallery-item" style="background: linear-gradient(135deg, #8a7055, #453020);"></div>
</div>
<h2 id="quan-ca-phe">Quán cà phê không tên</h2>
<p>Quán tôi ngồi hôm nay không có tên. Chỉ có một tấm bảng gỗ nhỏ, trên đó ghi nguệch ngoạc <em>"Mở cửa khi trời có mây"</em>. Bên trong là ba chiếc bàn gỗ, một cái tủ cũ đựng đầy sách, và một cô chủ có lẽ ngoài năm mươi, nói chuyện rất nhỏ.</p>
<h3 id="menu-quan">Menu quán (đơn giản lắm)</h3>
<table class="content-table">
  <thead><tr><th>Món</th><th>Giá</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>Cà phê đen</td><td>25.000₫</td><td>Robusta Cầu Đất</td></tr>
    <tr><td>Cà phê sữa</td><td>30.000₫</td><td>Sữa đặc Ngôi Sao</td></tr>
    <tr><td>Trà atiso</td><td>20.000₫</td><td>Atiso Đà Lạt tươi</td></tr>
    <tr><td>Bánh bông lan</td><td>15.000₫</td><td>Làm trong ngày</td></tr>
  </tbody>
</table>
<h2 id="nhac-nen">Nhạc nền hôm đó</h2>
<div class="embed-spotify" data-spotify-id="4cOdK2wGLETKBW3PvgPWqT"></div>
<p>Khi mưa ngớt, tôi trả tiền rồi đi bộ về. Cô chủ vẫy tay nhẹ. Tôi vẫy lại. Không ai nói gì cả.</p>
<p>Và có lẽ, đó mới là điều Đà Lạt giỏi nhất: dạy người ta cách <em>không cần nói gì cả</em>.</p>`
  },
  {
    id: 'p2',
    title: 'Viết cho một buổi sáng thứ Hai',
    slug: 'viet-cho-sang-thu-hai',
    excerpt: 'Thứ Hai không đáng sợ như người ta hay nói. Nó chỉ đến vào lúc mình chưa sẵn sàng, vậy thôi.',
    status: 'published',
    mood: '☕', tags: ['suy ngẫm', 'đời sống'],
    categoryId: 'thoughts',
    date: '2026-04-14', readTime: 3,
    cover: 'linear-gradient(135deg, #d4a574, #8b6f47)',
    coverImage: '',
    signature: 'Sài Gòn, 6h30 sáng.',
    dropCap: false,
    views: 892,
    content: `<p>Thứ Hai không đáng sợ như người ta hay nói. Nó chỉ đến vào lúc mình chưa sẵn sàng, vậy thôi. Tôi đã từng ghét thứ Hai — cái cảm giác phải thu mình lại sau hai ngày được buông ra. Nhưng dần dần, tôi nghĩ, có lẽ vấn đề không nằm ở thứ Hai.</p>
<p>Sáng nay tôi thử dậy sớm hơn 30 phút. Pha một ấm trà thay vì cà phê. Và mở cửa sổ.</p>
<h2 id="am-thanh">Âm thanh của thành phố</h2>
<p>Thành phố có một thứ âm thanh rất riêng vào lúc này — khi xe chưa đông, khi những tiếng rao đầu tiên bắt đầu vang lên từ con hẻm dưới nhà.</p>
<blockquote>"Có những buổi sáng, điều duy nhất cần làm là im lặng đủ lâu để nghe ra mình đang ở đâu."</blockquote>
<h2 id="khong-voi">Không vội</h2>
<p>Tôi nhận ra, mỗi khi cố ép mình "chinh phục" thứ Hai, tôi càng kiệt sức. Nhưng khi chỉ đơn giản để nó trôi qua, nó lại trôi qua thật nhẹ.</p>`
  },
  {
    id: 'p3',
    title: 'Một năm học code và những điều tôi nhận ra',
    slug: 'mot-nam-hoc-code',
    excerpt: 'Không phải code khó. Là sự kiên nhẫn khó. Tôi mất một năm để hiểu điều đó — và một năm nữa để sống với nó.',
    status: 'published',
    mood: '🤔', tags: ['lập trình', 'suy ngẫm', 'học tập'],
    categoryId: 'tech',
    date: '2026-04-05', readTime: 7,
    cover: 'linear-gradient(135deg, #4a5d7a, #1e2d44)',
    coverImage: '',
    signature: '',
    dropCap: true,
    views: 2341,
    content: `<p>Không phải code khó. Là sự kiên nhẫn khó. Tôi mất một năm để hiểu điều đó — và một năm nữa để sống với nó.</p>
<h2 id="bat-dau">Bắt đầu từ đâu?</h2>
<p>Tôi bắt đầu với một cuốn sách và một ly cà phê. Cuốn sách về Python cho người mới. Ly cà phê để tự thưởng.</p>
<p>Đây là chương trình đầu tiên tôi viết:</p>
<pre><code class="language-python">def hello(name):
    return f"Xin chào, {name}!"

print(hello("thế giới"))
# Output: Xin chào, thế giới!</code></pre>
<h2 id="buc-tuong">Bức tường đầu tiên: async/await</h2>
<p>Tuần thứ ba, tôi chạm vào cái gọi là <code>async/await</code>. Không hiểu. Đọc lại. Vẫn không hiểu.</p>
<pre><code class="language-javascript">// Thứ khiến tôi đau đầu nhiều ngày
async function fetchData() {
  const response = await fetch('/api/posts');
  const data = await response.json();
  return data;
}</code></pre>
<blockquote>"Người học giỏi không phải người hiểu nhanh. Là người chấp nhận không hiểu, lâu hơn người khác."</blockquote>
<h2 id="dieu-nhan-ra">3 điều tôi nhận ra sau một năm</h2>
<h3 id="thu-nhat">1. Code là cuộc trò chuyện với chính mình của tương lai</h3>
<p>Mỗi biến tôi đặt tên, mỗi comment tôi viết — là tôi đang nói chuyện với chính tôi của 6 tháng sau, người đã quên sạch mọi thứ.</p>
<h3 id="thu-hai">2. Mọi bug đều có lý do, không có phép màu</h3>
<p>Máy tính không bao giờ nhầm — chỉ có tôi nhầm.</p>
<h3 id="thu-ba">3. Nghỉ một ngày không làm mình kém đi</h3>
<div class="callout">✨ Bí mật nhỏ: những breakthrough lớn nhất của tôi đều đến sau một ngày nghỉ hoàn toàn không chạm vào máy tính.</div>
<h2 id="video-huong-dan">Video hướng dẫn tôi thích nhất</h2>
<div class="embed-youtube" data-video-id="jNQXAC9IVRw"></div>`
  },
  {
    id: 'p4',
    title: 'Danh sách những cuốn sách tháng Tư',
    slug: 'sach-thang-tu',
    excerpt: 'Tháng Tư đọc được 3 cuốn. Ngắn thôi, nhưng đủ đầy.',
    status: 'published',
    mood: '💭', tags: ['sách', 'đọc'],
    categoryId: 'books',
    date: '2026-04-10', readTime: 4,
    cover: 'linear-gradient(135deg, #a8906c, #5d4b2e)',
    coverImage: '',
    signature: '',
    dropCap: false,
    views: 567,
    content: `<p>Tháng Tư đọc được 3 cuốn. Ngắn thôi, nhưng đủ đầy.</p>
<h2 id="sach-1">1. Norwegian Wood — Haruki Murakami</h2>
<p>Đọc lại. Lần thứ ba. Và vẫn khóc ở cùng một đoạn.</p>
<h2 id="sach-2">2. Man's Search for Meaning — Viktor Frankl</h2>
<blockquote>"Between stimulus and response there is a space. In that space is our power to choose our response."</blockquote>
<h2 id="sach-3">3. Thinking, Fast and Slow — Daniel Kahneman</h2>
<p>Đọc chưa xong. Dày, khó, nhưng đáng.</p>`
  },
  {
    id: 'p5',
    title: 'Tản mạn về cà phê một mình',
    slug: 'ca-phe-mot-minh',
    excerpt: 'Có một kiểu cô đơn đẹp — cô đơn của người ngồi uống cà phê một mình, không đợi ai, không nhắn tin cho ai.',
    status: 'published',
    mood: '😌', tags: ['đời sống', 'cà phê'],
    categoryId: 'life',
    date: '2026-03-28', readTime: 3,
    cover: 'linear-gradient(135deg, #c9a876, #7a5c3a)',
    coverImage: '',
    signature: 'Một quán nhỏ ở quận Bình Thạnh.',
    dropCap: false,
    views: 1102,
    content: `<p>Có một kiểu cô đơn đẹp — cô đơn của người ngồi uống cà phê một mình, không đợi ai, không nhắn tin cho ai.</p>
<blockquote>"Ở một mình không phải là cô đơn. Cô đơn là khi mình ở giữa đám đông mà không biết tại sao mình ở đó."</blockquote>
<h2 id="quan-quen">Quán quen</h2>
<p>Mỗi người cần một quán quen. Một nơi mà người pha cà phê nhớ mình uống gì.</p>`
  },
  {
    id: 'p6',
    title: 'Đi bộ, và những điều nhìn thấy',
    slug: 'di-bo',
    excerpt: 'Tôi đi bộ mỗi sáng. Không phải để tập thể dục — chỉ để đi.',
    status: 'published',
    mood: '🌅', tags: ['đời sống', 'suy ngẫm'],
    categoryId: 'life',
    date: '2026-03-20', readTime: 4,
    cover: 'linear-gradient(135deg, #6b8e4e, #3d5429)',
    coverImage: '',
    signature: '',
    dropCap: false,
    views: 734,
    content: `<p>Tôi đi bộ mỗi sáng. Không phải để tập thể dục — chỉ để đi. Khi đi bộ, tôi nhìn thấy những thứ mà đi xe máy không bao giờ thấy được.</p>
<h2 id="ba-cu">Bà cụ bán xôi</h2>
<p>Có một bà cụ bán xôi ở góc đường. Bà ngồi đó từ 5 giờ sáng.</p>`
  },
  {
    id: 'p7',
    title: 'Playlist cho những đêm không ngủ',
    slug: 'playlist-dem-khong-ngu',
    excerpt: 'Có những đêm, âm nhạc là điều duy nhất giữ mình ở lại với thế giới này.',
    status: 'published',
    mood: '🎵', tags: ['âm nhạc', 'đêm', 'playlist'],
    categoryId: 'life',
    date: '2026-04-12', readTime: 6,
    cover: 'linear-gradient(135deg, #2e1a47, #0a0515)',
    coverImage: '',
    signature: 'Một đêm không ngủ ở Sài Gòn.',
    dropCap: false,
    views: 986,
    content: `<p>Có những đêm, âm nhạc là điều duy nhất giữ mình ở lại với thế giới này. Tôi có một playlist riêng cho những đêm như vậy — không phải để ngủ, không phải để tỉnh, chỉ để ở đây.</p>
<h2 id="playlist">Playlist</h2>
<div class="embed-spotify" data-spotify-id="37i9dQZF1DWZeKCadgRdKQ"></div>
<h2 id="bai-1">Bài 1 — "Flows" của Brambles</h2>
<p>Bắt đầu nhẹ. Tiếng piano, tiếng mưa. Không cần phải nghĩ gì cả.</p>
<h2 id="bai-2">Bài 2 — Nils Frahm, bất kỳ bài nào</h2>
<p>Nils Frahm là loại nhạc không có bắt đầu, không có kết thúc. Chỉ có ở giữa.</p>
<div class="callout">🎧 Nghe tốt nhất với tai nghe, âm lượng vừa, và một ly nước ấm bên cạnh.</div>`
  },
];

const DEMO_COMMENTS = [
  { id: 'c1', postId: 'p1', author: 'Minh Trang', email: 'trang@example.com', content: 'Bài viết hay quá, đọc mà thèm về Đà Lạt ngay! Cảm ơn bạn.', date: '2026-04-19 09:30', approved: true, likes: 5 },
  { id: 'c2', postId: 'p1', author: 'Hoàng Nam', email: 'nam@example.com', content: 'Mình cũng hay ghé quán đó. Đúng là một nơi rất đặc biệt.', date: '2026-04-19 14:22', approved: true, likes: 3 },
  { id: 'c3', postId: 'p1', author: 'Anh Thư', email: 'thu@example.com', content: 'Đọc bài của bạn xong mình ngồi im 5 phút không làm gì. Đẹp quá.', date: '2026-04-20 08:15', approved: true, likes: 12 },
  { id: 'c4', postId: 'p3', author: 'Dev Junior', email: 'dev@example.com', content: 'Đoạn 3 thật sự đúng. Cảm ơn tác giả!', date: '2026-04-06 10:00', approved: true, likes: 8 },
  { id: 'c5', postId: 'p3', author: 'Quang', email: 'quang@example.com', content: 'Spam test comment, chờ admin duyệt...', date: '2026-04-19 23:00', approved: false, likes: 0 },
];

const DEMO_MEDIA = [
  { id: 'm1', type: 'image', name: 'da-lat-rain.jpg', size: 342, url: 'linear-gradient(135deg, #8b7355, #3d2817)', date: '2026-04-18' },
  { id: 'm2', type: 'image', name: 'coffee-morning.jpg', size: 256, url: 'linear-gradient(135deg, #d4a574, #8b6f47)', date: '2026-04-14' },
  { id: 'm3', type: 'image', name: 'code-setup.jpg', size: 512, url: 'linear-gradient(135deg, #4a5d7a, #1e2d44)', date: '2026-04-05' },
  { id: 'm4', type: 'image', name: 'books-april.jpg', size: 198, url: 'linear-gradient(135deg, #a8906c, #5d4b2e)', date: '2026-04-10' },
  { id: 'm5', type: 'video', name: 'walking-morning.mp4', size: 12800, url: '', date: '2026-03-20' },
  { id: 'm6', type: 'image', name: 'cafe-quan.jpg', size: 284, url: 'linear-gradient(135deg, #c9a876, #7a5c3a)', date: '2026-03-28' },
];

/* ===== STORAGE ===== */
function loadData() {
  try {
    const raw = localStorage.getItem(BLOG_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e){}
  const fresh = {
    settings: DEFAULT_SETTINGS,
    posts: DEMO_POSTS,
    categories: DEMO_CATEGORIES,
    comments: DEMO_COMMENTS,
    media: DEMO_MEDIA,
    subscribers: [],
  };
  saveData(fresh);
  return fresh;
}

function saveData(data) {
  try { localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(data)); } catch(e){}
}

function getSettings() { return loadData().settings; }
function getPosts() { return loadData().posts; }
function getPostBySlug(slug) { return loadData().posts.find(p => p.slug === slug); }
function getPostById(id) { return loadData().posts.find(p => p.id === id); }

/* ===== HELPERS ===== */
const MOODS_LIST = Object.entries(MOODS).map(([e,n]) => ({e,n}));

function fmtDate(d) {
  return new Date(d).toLocaleDateString('vi-VN', {day:'numeric', month:'long', year:'numeric'});
}
function fmtDateShort(d) {
  return new Date(d).toLocaleDateString('vi-VN');
}
function fmtDateTime(d) {
  return new Date(d).toLocaleString('vi-VN');
}
function fmtSize(kb) {
  return kb > 1024 ? (kb/1024).toFixed(1)+' MB' : kb+' KB';
}
function slugify(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}
function countWords(html) {
  const text = (html||'').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
}
function readingTime(html) {
  return Math.max(1, Math.round(countWords(html) / 200));
}
function htmlEscape(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ===== RENDER EMBEDS ===== */
function hydrateEmbeds(container) {
  if (!container) return;
  // YouTube
  container.querySelectorAll('.embed-youtube[data-video-id]').forEach(el => {
    if (el.dataset.hydrated) return;
    const id = el.dataset.videoId;
    el.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    el.dataset.hydrated = '1';
  });
  // Vimeo
  container.querySelectorAll('.embed-vimeo[data-video-id]').forEach(el => {
    if (el.dataset.hydrated) return;
    const id = el.dataset.videoId;
    el.innerHTML = `<iframe src="https://player.vimeo.com/video/${id}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    el.dataset.hydrated = '1';
  });
  // Spotify
  container.querySelectorAll('.embed-spotify[data-spotify-id]').forEach(el => {
    if (el.dataset.hydrated) return;
    const id = el.dataset.spotifyId;
    const type = el.dataset.spotifyType || 'playlist';
    el.innerHTML = `<iframe src="https://open.spotify.com/embed/${type}/${id}?utm_source=generator" width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    el.dataset.hydrated = '1';
  });
  // SoundCloud
  container.querySelectorAll('.embed-soundcloud[data-sc-url]').forEach(el => {
    if (el.dataset.hydrated) return;
    const url = encodeURIComponent(el.dataset.scUrl);
    el.innerHTML = `<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=${url}"></iframe>`;
    el.dataset.hydrated = '1';
  });
  // Twitter (simple blockquote)
  container.querySelectorAll('.embed-twitter[data-tweet-url]').forEach(el => {
    if (el.dataset.hydrated) return;
    const url = el.dataset.tweetUrl;
    el.innerHTML = `<blockquote class="twitter-quote"><a href="${url}" target="_blank" rel="noopener">Xem tweet trên X/Twitter →</a></blockquote>`;
    el.dataset.hydrated = '1';
  });
}

/* ===== SEARCH HELPERS ===== */
function searchPosts(query) {
  if (!query) return [];
  const q = query.toLowerCase();
  return getPosts().filter(p =>
    p.status === 'published' && (
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
  );
}
