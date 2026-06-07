---
layout: post
title: "Responsive Design with Bootstrap 5"
date: 2026-05-22
categories: [css]
author: Evan Krocker
excerpt: "Bootstrap 5 makes building responsive, mobile-first websites fast and easy. Let's explore the grid system, components, and utilities that make it so powerful."
---

Bootstrap 5 is the most popular CSS framework for building responsive, mobile-first websites. With its comprehensive suite of components and a powerful grid system, you can build beautiful UIs without writing tons of custom CSS.

## The Grid System

Bootstrap uses a 12-column grid system. You can create flexible layouts using `container`, `row`, and `col` classes:

```html
<div class="container">
  <div class="row">
    <div class="col-md-6">Left column</div>
    <div class="col-md-6">Right column</div>
  </div>
</div>
```

Breakpoints (`sm`, `md`, `lg`, `xl`, `xxl`) let you control how the layout changes at each screen size.

## Key Components

Bootstrap ships with dozens of ready-to-use components: navbars, cards, modals, forms, buttons, alerts, and much more. All are customizable via CSS variables or Sass.

```html
<div class="card shadow-sm">
  <div class="card-body">
    <h5 class="card-title">Card Title</h5>
    <p class="card-text">Some description here.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
```

## Utility Classes

Bootstrap 5 introduced a massive set of utility classes for spacing, typography, flexbox, colors, and more — significantly reducing the need for custom CSS.

```html
<!-- Flexbox utilities -->
<div class="d-flex justify-content-between align-items-center gap-3">
  <span class="fw-bold text-primary">Label</span>
  <button class="btn btn-sm btn-outline-secondary ms-auto">Action</button>
</div>
```

## Bootstrap Without the Bloat

Use the CDN for quick prototypes, or import only the Bootstrap modules you need via npm + Sass for production builds to keep your bundle lean.
