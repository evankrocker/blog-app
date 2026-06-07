---
layout: post
title: "CSS Grid Layout: A Practical Guide"
date: 2026-04-05
categories: [css]
author: Evan Krocker
excerpt: "CSS Grid is the most powerful layout system available in CSS. This guide covers everything from basic grids to complex magazine-style layouts."
---

CSS Grid is a two-dimensional layout system that fundamentally changes how we build web layouts. Unlike Flexbox (which is one-dimensional), Grid lets you control both columns and rows simultaneously.

## Creating a Basic Grid

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
```

`1fr` means "one fraction of available space." Three `1fr` columns will each take up one third of the container.

## Spanning Cells

```css
.featured {
  grid-column: 1 / 3;  /* span columns 1 and 2 */
  grid-row: 1 / 3;     /* span rows 1 and 2 */
}

/* Shorthand using span */
.wide {
  grid-column: span 2;
}
```

## Named Grid Areas

Named areas make complex layouts readable:

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 260px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

## Responsive Grids Without Media Queries

`auto-fit` + `minmax` creates a responsive grid that automatically adjusts the number of columns:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

This single declaration replaces multiple `@media` breakpoints for simple card layouts.

## Grid vs. Flexbox

Use **Grid** for two-dimensional layouts — page structure, card grids, complex forms.
Use **Flexbox** for one-dimensional flows — nav bars, button groups, centering a single item.

They complement each other well; many components use both.
