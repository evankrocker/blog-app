---
layout: post
title: "Building REST APIs with Express"
date: 2026-04-15
categories: [javascript]
author: Evan Krocker
excerpt: "Express makes building REST APIs in Node.js remarkably straightforward. This tutorial walks through creating a full CRUD API from scratch."
---

Express is the de-facto standard for building REST APIs in Node.js. It's minimal, flexible, and has a rich ecosystem of middleware.

## Setup

```bash
npm init -y
npm install express
```

## Basic Structure

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/posts', (req, res) => {
  res.json({ posts: [] });
});

app.post('/api/posts', (req, res) => {
  const post = req.body;
  // save to database...
  res.status(201).json(post);
});

app.listen(3000, () => console.log('API running on port 3000'));
```

## Route Parameters

```javascript
app.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const post = findPostById(id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
});

app.patch('/api/posts/:id', async (req, res) => {
  const updated = await updatePost(req.params.id, req.body);
  res.json(updated);
});

app.delete('/api/posts/:id', async (req, res) => {
  await deletePost(req.params.id);
  res.status(204).end();
});
```

## Middleware

Middleware functions run before your route handlers. Use them for logging, authentication, validation, and error handling.

```javascript
// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Error handler (must have 4 params)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
```

## Organizing Routes

Split routes into separate files as your API grows:

```javascript
// routes/posts.js
const router = require('express').Router();
router.get('/', getPosts);
router.post('/', createPost);
router.get('/:id', getPost);
module.exports = router;

// server.js
app.use('/api/posts', require('./routes/posts'));
```
