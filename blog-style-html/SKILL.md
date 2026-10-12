---
name: blog-style-html
description: >-
  Use when making any single-file HTML article, explainer (讲解 html), report,
  study notes or readable document page: Joye's blog style (joyehuang.me) with
  one calm column, a single blue-teal accent, Satoshi + Noto Sans SC, and inline
  SVG diagrams that animate in on scroll. Not for slides.
---

> **Sources & credit.** Look: tokens from joyehuang.me (Astro "Pure" theme), 2026-10-11.
> Craft: adapted from Thariq Shihipar's **html-plan** skill
> (https://github.com/anthropics/claude-plugins-community/tree/main/html-plan —
> plugin.json says MIT; the repository is Apache-2.0), announced at
> https://x.com/trq212/status/2107192901537329354. Ideas taken, no code copied
> verbatim: one centered column token, tokens-first CSS with light + dark,
> a 5-step type scale, one accent, borders not shadows, sentence-case labels,
> exhibits (figures) as bordered cards with a caption *under* the exhibit,
> margin section numbers that collapse on narrow screens, `text-wrap: balance`.

# Blog-Style HTML

Output: **one self-contained `.html` file** (CSS + JS inline, fonts from CDN).

## How to build

These files sit next to this `SKILL.md`, and paths below are relative to the
skill directory:

- `style.css` — all design
- `script.js` — theme toggle, scroll-triggered animation, highlighter
- `head.html` / `tail.html` — page shell with header + toggle
- `build.py` — stitches the shell, CSS, and JS into one HTML file
- `template.html` — a built example

1. Write only the `<article>…</article><footer>…</footer>` body (copy the shape
   from `template.html`).
2. `python3 build.py "<title>" body.html out.html`

   `build.py` reads `style.css`, `script.js`, `head.html`, and `tail.html` from
   its own directory (the skill directory), so the body and output paths can
   point anywhere. Do **not** hand-edit CSS per page; if the design needs to
   change, change `style.css` in the skill directory.

## Hard rules

1. **Centered.** Header, article and footer share one column
   (`max-width: var(--col)` = 44rem, `margin-inline: auto`). The hero
   (kicker, h1, dek, meta) is centre-aligned; body text is left-aligned.
   When the page is based on a source (X post, article, talk, paper), the FIRST
   element of the hero, above the kicker, MUST be the `.source` pill linking the
   original (author + platform). Never bury the original link in the body.
   Figures marked `.wide` may break out 4rem each side on ≥1000px.
2. **No fake navigation.** Header = "Joye" (link to joyehuang.me) + theme toggle. Nothing else.
3. **Light and dark.** Default follows the system; the toggle sets
   `html[data-theme]` and saves `localStorage.theme`; a head script applies it
   before paint. Never hard-code colours in SVG — use the `.s-*` / `.t-*` classes
   or `var(--…)`.
4. **One accent** (`--accent`, muted blue-teal) + ink greys. Yellow is only for
   the `.mark` highlighter, at most twice per page.
5. **Type:** Satoshi + Noto Sans SC; sizes 13 · 15 · 17 · 22 · h1 clamp(30–42).
   Mono (JetBrains Mono) only for kicker, labels, section numbers, code.
6. **Reduced motion:** everything renders final state; replay buttons hide.

## Components

| Need | Use |
|---|---|
| Summary | `.callout` with `.lbl` "TL;DR" |
| Section | `<h2><span class="n">01</span>Title</h2>` |
| One killer quote | `p.pull` (centered, accent rules) |
| Several tweets / replies | `.replies > figure.reply` with `blockquote` + `figcaption` (`.tag`/`.tag.pro`, `.who`, link) |
| Numbered takeaways | `ol.steps` |
| Diagram | `figure.fig[data-anim]` (+`.wide`) → inline SVG + `figcaption` (`<b>图 n</b>` + one sentence + `.replay`) |

## Diagrams (animated inline SVG)

- viewBox width 720; text via `text-anchor="middle"` for centred labels;
  keep labels ≥14 user units (CSS enlarges them on mobile — check nothing collides).
- Shapes: `.s-node`, `.s-node-acc`, lines `.s-ink` `.s-acc` `.s-dim`, areas
  `.s-area` `.s-area-dim`, grid `.s-grid`, axis `.s-axis`; text `.t-ink` `.t-dim` `.t-acc`.
  Arrowheads: `<marker>` filled with `var(--accent)`.
- Motion classes, staggered with `style="--at:.35s"`:
  `.draw` (stroke draws; add `pathLength="1"`), `.rise` (fade+lift group),
  `.fade`, `.grow` (area grows from baseline), `.flow` (a dot travels
  `offset-path: path('…')` in a loop — for pipelines).
- Every figure says what to notice in its caption, and says "示意图" if not real data.

## Content rules

Never invent facts, numbers, quotes or links. Quote tweets verbatim and link them.

## QA (required)

Playwright at 390 and 1280, light and dark. **Scroll the whole page first**
(animations are scroll-triggered), wait ~3s, then screenshot. Check: article
and header are centred (left margin = right margin), no horizontal scroll,
figure labels don't overlap at 390, toggle works and persists on reload,
reduced-motion shows no `.armed` figures. Be critical; iterate.

## Add Joye's own context
When the page explains someone else's post, article or talk, end with a section
that connects it to Joye's real situation (his team Joye & Co., the co-context
repo harness, his projects, talks and blog themes). Use only facts from memory,
the repo or his public pages; never invent. Close with one open question for him.

## 「转化成 notes」按钮
每个发布的页面右上角（日/月切换旁）都有一个「转化成 notes」胶囊按钮（`.notes-btn`，强调色），运行时用 `location.href` 链到 `https://convert.joyehuang.dev/?url=<本页地址>`。Worker `notes-convert` 确认后触发 routine「HTML 页面转 notes」，派 cloud agent 把页面写成 joyehuang.me/notes 的新笔记并开 PR。模板（template.html / head.html / style.css / script.js）已自带，不要删。
