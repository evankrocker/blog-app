const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const ejsLayouts = require('express-ejs-layouts');
const { format } = require('date-fns');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Static data (not admin-editable) ─────────────────────────────────────────
const projects = require('./data/projects.json');
const photos = require('./data/photos.json');
const resume = require('./data/resume.json');

// ── Dynamic data helpers ──────────────────────────────────────────────────────
const POSTS_FILE = path.join(__dirname, 'data/posts.json');

function readPosts() {
  return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
}

function getSortedPosts() {
  return [...readPosts()].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getCategories() {
  const map = {};
  readPosts().forEach(p => {
    if (!map[p.category]) map[p.category] = { slug: p.category, label: p.categoryLabel, count: 0 };
    map[p.category].count++;
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
}

function paginate(items, page, perPage) {
  const total = items.length;
  const totalPages = Math.ceil(total / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const start = (currentPage - 1) * perPage;
  return { items: items.slice(start, start + perPage), currentPage, totalPages, total };
}

function formatDate(dateStr) {
  return format(new Date(dateStr), 'MMMM d, yyyy');
}

// ── Middleware ────────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', false); // public views opt-in, admin views use their layout
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'blog-dev-secret-change-in-prod',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8 hours
}));

// ── Admin router ──────────────────────────────────────────────────────────────
const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);

// ── Public routes ─────────────────────────────────────────────────────────────

// Home — 5 posts per page
app.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const { items, currentPage, totalPages, total } = paginate(getSortedPosts(), page, 5);
  res.render('index', {
    posts: items, currentPage, totalPages, total,
    categories: getCategories(), formatDate,
    pageTitle: 'Blog', activePage: 'blog',
  });
});

// Category — 10 posts per page
app.get('/category/:slug', (req, res) => {
  const { slug } = req.params;
  const filtered = getSortedPosts().filter(p => p.category === slug);
  if (filtered.length === 0) {
    return res.status(404).render('404', { pageTitle: 'Not Found', activePage: '', categories: getCategories() });
  }
  const page = parseInt(req.query.page) || 1;
  const { items, currentPage, totalPages, total } = paginate(filtered, page, 10);
  res.render('category', {
    posts: items, currentPage, totalPages, total,
    categorySlug: slug, categoryLabel: filtered[0].categoryLabel,
    categories: getCategories(), formatDate,
    pageTitle: filtered[0].categoryLabel, activePage: 'blog',
  });
});

// Single post
app.get('/post/:slug', (req, res) => {
  const sorted = getSortedPosts();
  const post = sorted.find(p => p.slug === req.params.slug);
  if (!post) {
    return res.status(404).render('404', { pageTitle: 'Not Found', activePage: '', categories: getCategories() });
  }
  const related = sorted.filter(p => p.category === post.category && p.id !== post.id).slice(0, 3);
  res.render('post', {
    post, related, categories: getCategories(), formatDate,
    pageTitle: post.title, activePage: 'blog',
  });
});

// Projects
app.get('/projects', (req, res) => {
  res.render('projects', {
    projects, categories: getCategories(),
    pageTitle: 'Projects', activePage: 'projects',
  });
});

// Photos
app.get('/photos', (req, res) => {
  const filterCat = req.query.category || 'all';
  const filtered = filterCat === 'all' ? photos : photos.filter(p => p.category === filterCat);
  res.render('photos', {
    photos: filtered,
    photoCategories: [...new Set(photos.map(p => p.category))],
    activeCategory: filterCat,
    categories: getCategories(),
    pageTitle: 'Photos', activePage: 'photos',
  });
});

// Resume
app.get('/resume', (req, res) => {
  res.render('resume', {
    resume, categories: getCategories(),
    pageTitle: 'Resume', activePage: 'resume',
  });
});

// 404
app.use((req, res) => {
  res.status(404).render('404', { pageTitle: 'Not Found', activePage: '', categories: getCategories() });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
