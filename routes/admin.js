const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const router = express.Router();

// Injected into form pages to auto-generate slugs from titles
const SLUG_SCRIPT = `
  const titleInput = document.getElementById('title');
  const slugInput  = document.getElementById('slug');
  let slugEdited = slugInput && slugInput.value.length > 0;
  if (slugInput) {
    slugInput.addEventListener('input', () => { slugEdited = true; });
  }
  if (titleInput && slugInput) {
    titleInput.addEventListener('input', () => {
      if (!slugEdited) {
        slugInput.value = titleInput.value
          .toLowerCase().trim()
          .replace(/[^\\w\\s-]/g, '')
          .replace(/[\\s_]+/g, '-')
          .replace(/^-+|-+$/, '');
      }
    });
  }
`;

const POSTS_FILE  = path.join(__dirname, '../data/posts.json');
const CONFIG_FILE = path.join(__dirname, '../data/config.json');
const ADMIN_USER  = process.env.ADMIN_USER || 'admin';

// ── Password helpers ──────────────────────────────────────────────────────────

function readConfig() {
  try { return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')); }
  catch { return {}; }
}

function writeConfig(cfg) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2));
}

function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(plain, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(plain, stored) {
  const [salt, hash] = stored.split(':');
  const derived = crypto.scryptSync(plain, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
}

// Returns true if the supplied password matches whichever credential store is active.
// Priority: config.json hash > ADMIN_PASSWORD env var > default 'admin123'
function checkPassword(plain) {
  const cfg = readConfig();
  if (cfg.passwordHash) return verifyPassword(plain, cfg.passwordHash);
  return plain === (process.env.ADMIN_PASSWORD || 'admin123');
}

// ── Data helpers ──────────────────────────────────────────────────────────────

function readPosts() {
  return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
}

function writePosts(posts) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function flash(req, type, msg) {
  req.session.flash = { type, msg };
}

function getFlash(req) {
  const f = req.session.flash || null;
  delete req.session.flash;
  return f;
}

// ── Auth middleware ───────────────────────────────────────────────────────────

function requireAuth(req, res, next) {
  if (req.session && req.session.adminLoggedIn) return next();
  req.session.returnTo = req.originalUrl;
  res.redirect('/admin/login');
}

// ── Login / Logout ────────────────────────────────────────────────────────────

router.get('/login', (req, res) => {
  if (req.session.adminLoggedIn) return res.redirect('/admin');
  res.render('admin/login', {
    layout: false,
    pageTitle: 'Admin Login',
    error: getFlash(req),
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && checkPassword(password)) {
    req.session.adminLoggedIn = true;
    const returnTo = req.session.returnTo || '/admin';
    delete req.session.returnTo;
    return res.redirect(returnTo);
  }
  flash(req, 'danger', 'Invalid username or password.');
  res.redirect('/admin/login');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// ── Dashboard ─────────────────────────────────────────────────────────────────

router.get('/', requireAuth, (req, res) => {
  const posts = readPosts();
  const categoryCounts = posts.reduce((acc, p) => {
    acc[p.categoryLabel] = (acc[p.categoryLabel] || 0) + 1;
    return acc;
  }, {});
  const recent = [...posts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  res.render('admin/dashboard', {
    layout: 'admin/layout',
    pageTitle: 'Dashboard',
    activePage: 'dashboard',
    actionBtn: null,
    flash: getFlash(req),
    stats: { total: posts.length, categories: Object.keys(categoryCounts).length },
    categoryCounts,
    recent,
    extraScript: '',
  });
});

// ── Posts list ────────────────────────────────────────────────────────────────

router.get('/posts', requireAuth, (req, res) => {
  const posts = [...readPosts()].sort((a, b) => new Date(b.date) - new Date(a.date));
  res.render('admin/posts/index', {
    layout: 'admin/layout',
    pageTitle: 'All Posts',
    activePage: 'posts',
    actionBtn: { href: '/admin/posts/new', icon: 'plus-lg', label: 'New Post' },
    flash: getFlash(req),
    posts,
    extraScript: '',
  });
});

// ── New post ──────────────────────────────────────────────────────────────────

router.get('/posts/new', requireAuth, (req, res) => {
  const posts = readPosts();
  const categories = [...new Map(posts.map(p => [p.category, { slug: p.category, label: p.categoryLabel }])).values()];
  res.render('admin/posts/form', {
    layout: 'admin/layout',
    pageTitle: 'New Post',
    activePage: 'posts',
    actionBtn: null,
    flash: getFlash(req),
    post: null,
    categories,
    action: '/admin/posts',
    method: 'POST',
    extraScript: SLUG_SCRIPT,
  });
});

router.post('/posts', requireAuth, (req, res) => {
  const posts = readPosts();
  const { title, slug, category, categoryLabel, date, author, excerpt, content } = req.body;

  const finalSlug = slug || slugify(title);
  if (posts.find(p => p.slug === finalSlug)) {
    flash(req, 'danger', `Slug "${finalSlug}" is already in use. Choose a different one.`);
    return res.redirect('/admin/posts/new');
  }

  const newPost = {
    id: posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    slug: finalSlug,
    title: title.trim(),
    category: category.trim(),
    categoryLabel: categoryLabel.trim(),
    date: date || new Date().toISOString().slice(0, 10),
    author: author.trim(),
    excerpt: excerpt.trim(),
    content: content.trim(),
  };

  posts.push(newPost);
  writePosts(posts);
  flash(req, 'success', `Post "${newPost.title}" created.`);
  res.redirect('/admin/posts');
});

// ── Edit post ─────────────────────────────────────────────────────────────────

router.get('/posts/:id/edit', requireAuth, (req, res) => {
  const posts = readPosts();
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.redirect('/admin/posts');
  const categories = [...new Map(posts.map(p => [p.category, { slug: p.category, label: p.categoryLabel }])).values()];
  res.render('admin/posts/form', {
    layout: 'admin/layout',
    pageTitle: `Edit: ${post.title}`,
    activePage: 'posts',
    actionBtn: null,
    flash: getFlash(req),
    post,
    categories,
    action: `/admin/posts/${post.id}`,
    method: 'POST',
    extraScript: SLUG_SCRIPT,
  });
});

router.post('/posts/:id', requireAuth, (req, res) => {
  const posts = readPosts();
  const idx = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.redirect('/admin/posts');

  const { title, slug, category, categoryLabel, date, author, excerpt, content, _method } = req.body;
  if (_method !== 'PUT') return res.redirect('/admin/posts');

  const finalSlug = slug || slugify(title);
  const slugConflict = posts.find(p => p.slug === finalSlug && p.id !== parseInt(req.params.id));
  if (slugConflict) {
    flash(req, 'danger', `Slug "${finalSlug}" is already in use.`);
    return res.redirect(`/admin/posts/${req.params.id}/edit`);
  }

  posts[idx] = {
    ...posts[idx],
    title: title.trim(),
    slug: finalSlug,
    category: category.trim(),
    categoryLabel: categoryLabel.trim(),
    date,
    author: author.trim(),
    excerpt: excerpt.trim(),
    content: content.trim(),
  };

  writePosts(posts);
  flash(req, 'success', `Post "${posts[idx].title}" updated.`);
  res.redirect('/admin/posts');
});

// ── Delete post ───────────────────────────────────────────────────────────────

router.post('/posts/:id/delete', requireAuth, (req, res) => {
  const posts = readPosts();
  const idx = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.redirect('/admin/posts');
  const title = posts[idx].title;
  posts.splice(idx, 1);
  writePosts(posts);
  flash(req, 'success', `Post "${title}" deleted.`);
  res.redirect('/admin/posts');
});

// ── Settings — change password ────────────────────────────────────────────────

router.get('/settings', requireAuth, (req, res) => {
  res.render('admin/settings', {
    layout: 'admin/layout',
    pageTitle: 'Settings',
    activePage: 'settings',
    actionBtn: null,
    flash: getFlash(req),
    extraScript: '',
    usingHashedPassword: !!readConfig().passwordHash,
  });
});

router.post('/settings/password', requireAuth, (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!checkPassword(currentPassword)) {
    flash(req, 'danger', 'Current password is incorrect.');
    return res.redirect('/admin/settings');
  }

  if (newPassword.length < 8) {
    flash(req, 'danger', 'New password must be at least 8 characters.');
    return res.redirect('/admin/settings');
  }

  if (newPassword !== confirmPassword) {
    flash(req, 'danger', 'New passwords do not match.');
    return res.redirect('/admin/settings');
  }

  const cfg = readConfig();
  cfg.passwordHash = hashPassword(newPassword);
  writeConfig(cfg);

  // Invalidate all other sessions by rotating the session
  req.session.regenerate(err => {
    if (err) console.error('Session regenerate error:', err);
    req.session.adminLoggedIn = true;
    flash(req, 'success', 'Password updated successfully.');
    res.redirect('/admin/settings');
  });
});

module.exports = router;
