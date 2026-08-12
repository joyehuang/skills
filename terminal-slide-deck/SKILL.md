---
name: terminal-slide-deck
description: >-
  Build a self-contained, single-file HTML slide deck in a distinctive
  cyan-on-near-black terminal aesthetic — monospace accents, a console/terminal
  motif, deliberate slow animations, crafted HTML/SVG data-viz components
  (timelines, concentric-ring diagrams, bar charts, hub-and-spoke and loop SVGs,
  streaming chat cards, comparison paths, pipelines), keyboard/touch navigation,
  fullscreen, and a reduced-motion fallback. Use this whenever someone wants a
  presentation or slides in THIS look — e.g. "make a deck/slides in the terminal
  (or dark / cyan / hacker / technical) style", "build a presentation that looks
  like this", "turn these notes into a slick dark slide deck", or any request to
  reproduce this house style for their own content. The deck's CONTENT is whatever
  the user is presenting (any topic, any language — CJK fonts are bundled); this
  skill supplies the style, layout, animation, typography, and component library.
  Prefer this over hand-rolling slide CSS from scratch.
---

> **Source / author:** This skill is the house slide style of **Joye Huang** —
> [joyehuang.me](https://joyehuang.me) ([@joyehuang](https://github.com/joyehuang)).
> The cyan-on-near-black terminal aesthetic mirrors Joye's personal site. Free to
> use and adapt; a link back to [joyehuang.me](https://joyehuang.me) is appreciated.

# Terminal Slide Deck

A reusable **house style** for slide decks. The output is always **one
self-contained HTML file** — all CSS and JS inline, fonts via Google Fonts CDN,
no build step, no `localStorage`. It opens in any browser, navigates by
keyboard/touch, goes fullscreen, and respects reduced-motion.

This skill supplies the **look and the building blocks**; the user supplies the
**content** (any topic, any language). The reusable engine lives in the
[demo reference HTML](references/demo-reference.html). **Start from that file —
don't rebuild the CSS/JS.**

## What you're reproducing
A dark, calm, "developer terminal" aesthetic: near-black background with a faint
cyan glow, monospace eyebrows prefixed `> `, a blinking cyan cursor, hairline
borders, and **bespoke HTML/SVG visuals** instead of clip-art. Animations are
deliberate and slow (staggered reveals, sequenced entrances) — never frantic.
Open the [Demo Reference HTML](references/demo-reference.html) to see the style
and component behavior in a browser.

---

## Workflow

### 1. Understand the deck
Find out (or ask briefly — one message, don't interrogate):
- **The topic / purpose** and roughly how many sections.
- **The content** the user already has (an outline, notes, bullet points, data).
- **Language** (defaults to whatever the user writes in; CJK is supported).

If the user hands you raw notes, propose a slide breakdown before building.

### 2. Start from the template
Copy `references/demo-reference.html` to your working file. Keep the entire
`<style>` and `<script>` blocks — that's the engine. The 12 demo slides are a
**neutral example to replace**, and a live gallery of what the components look
like.

### 3. Lay out the slides
Use the **layout helper classes** (below). **Give every content slide a visual** —
copy snippets from `assets/components.md` (the CSS for each is already in the
template) or adapt a demo slide in place. Keep section **dividers** clean for
rhythm. Whenever you add or remove slides, the counter updates itself from the DOM
(the `#total` span is set by JS), so you don't have to renumber anything.

### 4. Write the copy
Keep it tight: a headline plus 1–3 short lines per slide. **Let the visual carry
the weight.** Clear and concrete beats clever. Match the user's language; technical
terms can stay in English even in non-English decks.

### 5. Verify and deliver
Run the checklist (below), then `present_files` the finished `.html` with a short
summary.

---

## Layout helper classes
Put these on the `<section class="slide …">`. They compose:

| Class | Effect |
|---|---|
| `cover` | two-column cover grid (headline left, terminal/visual right) |
| `whoami` | two-column intro grid (text + a portrait/visual) |
| `split` | generic two-column content grid (text + visual, side by side) |
| `narrow` | constrains width — good for centered, text-led slides |
| `center` | centers the column (use with `narrow` for dividers/closing/big visuals) |

`.inner` is the content wrapper inside each slide. The default single-column slide
is just `<div class="inner narrow">…`. For a two-column slide, add `split` to the
section and put two children inside `.inner` (first = left, second = right). On
narrow screens every two-column layout collapses to one column automatically.

For a right-aligned text column next to a left visual, wrap the text in
`<div class="col-right">`.

---

## Design tokens (the look — keep these)
The template encodes all of this. Preserve it; don't drift the palette.

- **Colors:** bg `#0B0B10`, text `#FAFAFA`, dim `#BCBCC2`, faint `#74768A`,
  accent cyan `#B4EBFD`, cyan-soft `rgba(180,235,253,.12)`, teal `#517E94` /
  `#6FA3B8`, hairline `#2C2D39`. The palette is cool; the **only** warm exception
  is the ✓ / ✕ comparison icons (green `#5FBF86`, red `#E5746B`).
- **Type:** Geist (sans) + Geist Mono (mono) + Noto Sans SC (CJK), via Google
  Fonts. Use the `--mono-cjk` stack anywhere monospace text contains CJK
  characters (including SVG `<text>`).
- **Motif:** monospace eyebrows `> …`, section dividers `~/deck $ open 0N`, cool
  traffic-light window dots, blinking cyan cursor, faint cyan ambient glow + corner
  rings + subtle grain.
- **Highlight** one or two words per headline with `<span class="cy">…</span>`.

## Animation principles
- Reveals stagger via `class="up" style="--i:N"` (N = order). Keep it ~140ms apart.
- **Sequence** entrances rather than firing everything at once — e.g. the rings
  draw outer→inner, *then* the orbiting dots fade in; the chat card thinks, *then*
  streams its reply; the backlog cards stack one by one.
- Anything you add must have a **`prefers-reduced-motion` fallback** (the
  template's reduce-motion block shows the pattern: show final state, no motion).

---

## Component library
CSS for all of these is already in the template `<style>`. Copy the HTML from
**`assets/components.md`**. Choose by what the content needs:

| Component | Use it for |
|---|---|
| terminal window | a cover start-screen or any "console" moment |
| interactive timeline | phases, history, a dated sequence |
| concentric rings + orbits | "this expands outward in layers" |
| bar chart | a before/after or two-value comparison |
| nesting boxes | "each layer contains the previous" |
| backlog stack | accumulation / a growing pile |
| chat card (thinking + streaming) | a question→answer / assistant interaction |
| signal/noise sorter | triage / "which of these matters" |
| labeled card with light-up keywords | highlighting the vocabulary of a topic |
| comparison paths (✓ / ✕) | "do this, not that" |
| filter pipeline | input → process → output |
| radial hub-and-spoke (SVG) | a center with services/parts around it |
| loop (SVG) | a virtuous cycle / flywheel |
| action cards | a closing call-to-action |
| source chips / inline link | attaching a citation to a claim |

Need something not here? Build a new HTML/SVG visual in the same palette and
motif, honor reduced-motion, and add its CSS to the `<style>`. Prefer hand-built
HTML/SVG over stock images.

---

## A flexible structure (not a script)
Adapt freely to the content. A reliable shape:
**Cover → (Section divider → 2–4 content slides with visuals)×N → Closing.**
Open with a terminal cover, break the deck into a few numbered sections with clean
dividers, make each content slide earn its visual, and close with action cards plus
a one-line takeaway. Don't force every component in — pick the few that fit.

---

## Verification checklist
```bash
f=<your working .html>
grep -c 'class="slide' "$f"                     # number of slides
grep -c 'localStorage\|sessionStorage' "$f"     # must be 0 (a comment match is fine)
grep -c '</style>' "$f"; grep -c '</script>' "$f"  # exactly 1 each
```
- For every inline `<svg>`, confirm tag balance (each child self-closes or has a
  matching close tag).
- If you added JS, confirm brace/paren balance and that it's wired into `show(n)`.
- Open-check: the first slide should have `class="slide active …"`.

---

## Files in this skill
- `references/demo-reference.html` — the engine + a neutral 12-slide demo. Start here.
- `assets/components.md` — copy-paste HTML for each visual component.
