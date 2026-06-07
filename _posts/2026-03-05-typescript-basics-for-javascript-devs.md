---
layout: post
title: "TypeScript Basics for JavaScript Developers"
date: 2026-03-05
categories: [javascript]
author: Evan Krocker
excerpt: "TypeScript adds static typing to JavaScript, catching bugs at compile time. If you already know JavaScript, picking up TypeScript is easier than you think."
---

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing, interfaces, and other features that make large codebases much more maintainable.

## Setup

```bash
npm install -D typescript
npx tsc --init   # generates tsconfig.json
```

## Basic Types

```typescript
let name: string = 'Alice';
let age: number = 30;
let isActive: boolean = true;
let tags: string[] = ['ts', 'js'];
let tuple: [string, number] = ['hello', 42];
```

TypeScript can also infer types, so you don't always need annotations:

```typescript
let count = 0;       // inferred as number
const label = 'foo'; // inferred as string literal "foo"
```

## Interfaces

Interfaces describe the shape of an object:

```typescript
interface Post {
  id: number;
  title: string;
  content: string;
  published?: boolean;  // optional field
  readonly slug: string; // immutable after creation
}
```

## Functions

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Arrow function with typed params and return
const add = (a: number, b: number): number => a + b;

// Optional and default params
function createUser(name: string, role: string = 'user', age?: number) {
  return { name, role, age };
}
```

## Generics

Generics let you write reusable, type-safe code:

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = first([1, 2, 3]);    // type: number | undefined
const str = first(['a', 'b']);   // type: string | undefined
```

## Type vs. Interface

Both work for describing object shapes. Prefer `interface` for public APIs (they're extendable via `extends`). Use `type` for unions, intersections, and computed types:

```typescript
type Status = 'active' | 'inactive' | 'pending';
type PostWithAuthor = Post & { author: string };
```

TypeScript's incremental adoption story is excellent — you can add it to an existing JavaScript project file by file using `// @ts-check` or `allowJs: true` in `tsconfig.json`.
