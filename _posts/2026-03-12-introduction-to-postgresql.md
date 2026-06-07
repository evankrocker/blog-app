---
layout: post
title: "Introduction to PostgreSQL"
date: 2026-03-12
categories: [databases]
author: Evan Krocker
excerpt: "PostgreSQL is one of the world's most advanced open-source relational databases. Learn how to set it up and start querying data."
---

PostgreSQL (Postgres) is a powerful, open-source relational database system with over 35 years of active development. It's known for its reliability, feature richness, and standards compliance.

## Installation

```bash
# Ubuntu / Debian
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# macOS via Homebrew
brew install postgresql@16
brew services start postgresql@16
```

## Basic SQL

```sql
-- Create a table
CREATE TABLE posts (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  content    TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert rows
INSERT INTO posts (title, content)
VALUES ('My First Post', 'Hello, world!');

-- Query data
SELECT * FROM posts ORDER BY created_at DESC;

-- Update a row
UPDATE posts SET title = 'Updated Title' WHERE id = 1;

-- Delete a row
DELETE FROM posts WHERE id = 1;
```

## Useful Query Patterns

```sql
-- Pagination
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10 OFFSET 20;

-- Count
SELECT COUNT(*) FROM posts;

-- Join
SELECT posts.title, users.name
FROM posts
JOIN users ON posts.user_id = users.id;

-- Aggregate
SELECT category, COUNT(*) AS total
FROM posts
GROUP BY category
ORDER BY total DESC;
```

## Node.js Integration

```bash
npm install pg
```

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function getPosts() {
  const { rows } = await pool.query(
    'SELECT * FROM posts ORDER BY created_at DESC LIMIT $1',
    [10]
  );
  return rows;
}
```

Always use **parameterized queries** (`$1`, `$2`, ...) — never interpolate user input directly into SQL strings, as that opens the door to SQL injection.
