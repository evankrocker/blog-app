---
layout: post
title: "Git Workflows for Teams"
date: 2026-04-22
categories: [devops]
author: Evan Krocker
excerpt: "Choosing the right Git workflow for your team can dramatically improve productivity and code quality. Let's compare the most popular approaches."
---

Git is the backbone of modern software development, but the workflow you choose can make a big difference in team velocity and code quality. Here are the most common approaches.

## Feature Branch Workflow

Each feature lives in its own branch. When done, you open a pull request and merge to `main` after review. Simple and effective for most teams.

```bash
git checkout -b feature/user-auth
# ... make changes ...
git push -u origin feature/user-auth
# open pull request on GitHub/GitLab
```

## Gitflow

Gitflow uses dedicated branches for features, releases, and hotfixes. It's more structured and works well for projects with scheduled release cycles.

- `main` — production-ready code only
- `develop` — integration branch
- `feature/*` — new features branched from develop
- `release/*` — release preparation
- `hotfix/*` — emergency production fixes

Gitflow can feel heavy for small teams or fast-moving projects. Consider whether the ceremony is worth it before adopting.

## Trunk-Based Development

Everyone commits to `main` (trunk) multiple times per day, relying on **feature flags** to hide incomplete work. Preferred by high-velocity teams practicing continuous deployment.

```bash
# Short-lived branches, merged same day
git checkout -b fix/typo-in-readme
git commit -m "Fix typo in README"
git push && gh pr create --fill
```

## Tips for Any Workflow

- **Write clear commit messages** in the imperative mood: `Add user auth` not `Added user auth`
- **Keep PRs small and focused** — they're easier to review and safer to merge
- **Rebase over merge** for a cleaner history when it makes sense
- **Protect `main`** with required reviews, status checks, and no direct pushes
- **Use `.gitignore` and git hooks** to prevent committing secrets or build artifacts
