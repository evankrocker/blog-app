const express = require('express');
const path = require('path');
const { format } = require('date-fns');

const app = express();
const PORT = process.env.PORT || 3000;

const posts = require('./data/posts.json');
const projects = require('./data/projects.json');
const photos = require('./data/photos.json');
const resume = require('./data/resume.json');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Sort posts newest first
const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

// Build category list with counts
function getCategories() {
  const map = {};
  posts.forEach(p => {
    if (!map[p.category]) map[p.category] = { slug: p.category, label: p.categoryLabel, count: 0 };
    map[p.category].count++;
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
}

function paginate(items, page, perPage) {
  const total = items.length;
  const totalPages = Math.ceil(total / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    currentPage,
    totalPages,
    total,
  };
}

function formatDate(dateStr) {
  return format(new Date(dateStr), 'MMMM d, yyyy');
}

// Home — 5 posts per page
app.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const { items, currentPage, totalPages, total } = paginate(sortedPosts, page, 5);
  res.render('index', {
    posts: items,
    currentPage,
    totalPages,
    total,
    categories: getCategories(),
    formatDate,
    pageTitle: 'Blog',
    activePage: 'blog',
  });
});

// Category — 10 posts per page
app.get('/category/:slug', (req, res) => {
  const { slug } = req.params;
  const filtered = sortedPosts.filter(p => p.category === slug);
  if (filtered.length === 0) return res.status(404).render('404', { pageTitle: 'Not Found', activePage: '', categories: getCategories() });
  const page = parseInt(req.query.page) || 1;
  const { items, currentPage, totalPages, total } = paginate(filtered, page, 10);
  const categoryLabel = filtered[0].categoryLabel;
  res.render('category', {
    posts: items,
    currentPage,
    totalPages,
    total,
    categorySlug: slug,
    categoryLabel,
    categories: getCategories(),
    formatDate,
    pageTitle: categoryLabel,
    activePage: 'blog',
  });
});

// Single post
app.get('/post/:slug', (req, res) => {
  const post = sortedPosts.find(p => p.slug === req.params.slug);
  if (!post) return res.status(404).render('404', { pageTitle: 'Not Found', activePage: '', categories: getCategories() });
  const related = sortedPosts.filter(p => p.category === post.category && p.id !== post.id).slice(0, 3);
  res.render('post', {
    post,
    related,
    categories: getCategories(),
    formatDate,
    pageTitle: post.title,
    activePage: 'blog',
  });
});

// Projects
app.get('/projects', (req, res) => {
  res.render('projects', {
    projects,
    categories: getCategories(),
    pageTitle: 'Projects',
    activePage: 'projects',
  });
});

// Photos
app.get('/photos', (req, res) => {
  const filterCat = req.query.category || 'all';
  const filtered = filterCat === 'all' ? photos : photos.filter(p => p.category === filterCat);
  const photoCategories = [...new Set(photos.map(p => p.category))];
  res.render('photos', {
    photos: filtered,
    photoCategories,
    activeCategory: filterCat,
    categories: getCategories(),
    pageTitle: 'Photos',
    activePage: 'photos',
  });
});

// Resume
app.get('/resume', (req, res) => {
  res.render('resume', {
    resume,
    categories: getCategories(),
    pageTitle: 'Resume',
    activePage: 'resume',
  });
});

// 404
app.use((req, res) => {
  res.status(404).render('404', { pageTitle: 'Not Found', activePage: '', categories: getCategories() });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
