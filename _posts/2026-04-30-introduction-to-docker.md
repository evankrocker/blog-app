---
layout: post
title: "Introduction to Docker"
date: 2026-04-30
categories: [devops]
author: Evan Krocker
excerpt: "Docker changed how we build, ship, and run software. Learn the core concepts of containers and how to containerize your Node.js app."
---

Docker lets you package an application and all its dependencies into a standardized unit called a **container**. Containers ensure your app runs the same everywhere — from your laptop to production.

## Key Concepts

- **Image** — a read-only template for creating containers
- **Container** — a running instance of an image
- **Dockerfile** — instructions to build an image
- **Registry** — a place to store and share images (e.g., Docker Hub)

## A Simple Dockerfile for Node.js

```dockerfile
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

A few notes on this Dockerfile:
- `node:20-alpine` is a minimal base image (~5 MB vs ~300 MB for the full image)
- Copying `package.json` before the rest of the source lets Docker cache the npm install layer
- `npm ci` is faster and more reproducible than `npm install` in CI/container builds

## Essential Commands

```bash
docker build -t myapp .          # build image tagged "myapp"
docker run -p 3000:3000 myapp    # run container, map port 3000
docker ps                        # list running containers
docker stop <id>                 # stop a container
docker logs <id>                 # view container logs
docker exec -it <id> sh          # open shell inside container
```

## Docker Compose

For multi-container setups (app + database, etc.), use Docker Compose:

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
```

```bash
docker compose up    # start all services
docker compose down  # stop and remove containers
```
