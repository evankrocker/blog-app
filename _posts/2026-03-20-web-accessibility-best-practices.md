---
layout: post
title: "Web Accessibility Best Practices"
date: 2026-03-20
categories: [css]
author: Evan Krocker
excerpt: "Building accessible websites is both a moral responsibility and increasingly a legal one. Here are the key practices every developer should follow."
---

Web accessibility (a11y) ensures that websites are usable by people with disabilities. Beyond being the right thing to do, accessibility improves SEO and usability for everyone.

## Semantic HTML

Use HTML elements for their intended purpose. A `<button>` is better than a `<div>` with a click handler because it's keyboard-focusable, responds to Enter/Space, and announces itself to screen readers.

```html
<!-- Bad -->
<div class="btn" onclick="submit()">Submit</div>

<!-- Good -->
<button type="submit">Submit</button>
```

Use landmark elements to structure your page: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`.

## ARIA Attributes

ARIA fills the gaps where native HTML semantics fall short.

```html
<nav aria-label="Main navigation">

<button aria-expanded="false" aria-controls="menu" aria-haspopup="true">
  Menu
</button>

<img src="sunset.jpg" alt="A sunset over the mountains">

<!-- Decorative images get empty alt -->
<img src="divider.svg" alt="">
```

## Keyboard Navigation

All interactive elements must be reachable and operable via keyboard. Test your site by unplugging your mouse and using Tab, Shift+Tab, Enter, Space, and arrow keys.

## Color Contrast

WCAG 2.1 AA requires a contrast ratio of at least **4.5:1** for normal text and **3:1** for large text. Use the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify your palette.

```css
/* Low contrast — avoid */
color: #999;
background: #fff;  /* ratio ~2.8:1 */

/* WCAG AA compliant */
color: #595959;
background: #fff;  /* ratio ~7:1 */
```

## Focus Management

Never hide focus indicators without providing an alternative. Users navigating by keyboard depend on them.

```css
/* Bad */
*:focus { outline: none; }

/* Good — custom focus style */
*:focus-visible {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
  border-radius: 2px;
}
```

## Screen Reader Testing

Test with a real screen reader: **NVDA** (free, Windows), **VoiceOver** (built into macOS/iOS), or **TalkBack** (Android). Nothing replaces firsthand testing.
