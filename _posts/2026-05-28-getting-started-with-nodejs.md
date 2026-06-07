---
layout: post
title: "Getting Started with Node.js"
date: 2026-05-28
categories: [javascript]
author: Evan Krocker
excerpt: "Node.js has revolutionized server-side JavaScript development. In this post, we'll cover everything you need to know to get started building scalable applications."
---

Node.js has revolutionized server-side JavaScript development. Built on Chrome's V8 engine, it allows developers to run JavaScript outside the browser — opening up a world of possibilities for building fast, scalable network applications.

## Why Node.js?

Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. This makes it perfect for data-intensive real-time applications that run across distributed devices.

## Installing Node.js

Head over to [nodejs.org](https://nodejs.org) and download the LTS version for your platform. The installer includes npm (Node Package Manager), which you'll use to manage dependencies.

```bash
node -v
npm -v
```

## Your First App

Create a file called `app.js` and add the following:

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

Run it with `node app.js` and visit `http://localhost:3000`.

## What's Next?

From here, explore **Express** for building web servers, **npm** for managing packages, and the Node.js docs for its rich built-in modules (fs, path, http, crypto, and more).
