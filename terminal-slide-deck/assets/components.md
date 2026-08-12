# Component library — copy-paste snippets

The **CSS for every component below already lives in `references/demo-reference.html`**.
These are just the HTML blocks to drop into a slide's `.inner`, with `[ … ]`
placeholders to replace. Keep the class names exactly.

## Contents
1. [Layout](#layout) — how slides are structured
2. [Slide shells](#slide-shells) — divider, agenda
3. [Text + sourcing](#text--sourcing)
4. [Data & concept visuals](#data--concept-visuals)
5. [Card visuals](#card-visuals)
6. [SVG diagrams](#svg-diagrams)

---

## Layout
Layout is driven by **helper classes on the `<section>`**, not by slide IDs — add
or reorder slides freely.

- Single column (default): `<section class="slide"><div class="inner narrow"> … </div></section>`
- Centered (dividers, closing, a big centered visual): add `center` →
  `<div class="inner narrow center">`
- Two columns (text + visual): add `split` to the section, put **two children**
  inside `.inner` (first = left, second = right):
  ```html
  <section class="slide split" id="sN">
    <div class="inner">
      <div> … text (eyebrow / headline / lead) … </div>
      <div> … a visual component … </div>
    </div>
  </section>
  ```
- Cover and intro have their own grids: `class="slide cover"` and `class="slide whoami"`.
- Right-aligned text column beside a left visual: wrap the text in `<div class="col-right">`.

On narrow screens, every two-column layout collapses to one column automatically.
The slide counter updates itself from the DOM, so renumbering is unnecessary.

---

## Slide shells

### Section divider
```html
<section class="slide" id="sN">
  <div class="inner">
    <div class="sec-prompt up" style="--i:0">~/deck $ open <b>0N</b></div>
    <div class="sec-wrap">
      <div class="sec-num up" style="--i:1">0N</div>
      <div class="sec-meta">
        <h1 class="h-sec up" style="--i:2">[ Section title ]</h1>
        <div class="sec-sub up" style="--i:3">[ one-line subtitle ]</div>
      </div>
    </div>
  </div>
</section>
```

### Agenda (2×2)
```html
<div class="agenda">
  <div class="ag up" style="--i:3"><span class="k">01</span><span class="v">[ item ]</span></div>
  <div class="ag up" style="--i:4"><span class="k">02</span><span class="v">[ item ]</span></div>
  <div class="ag up" style="--i:5"><span class="k">03</span><span class="v">[ item ]</span></div>
  <div class="ag up" style="--i:6"><span class="k">04</span><span class="v">[ item ]</span></div>
</div>
```

---

## Text + sourcing

### Eyebrow / headline / lead
```html
<div class="eyebrow up" style="--i:0">&gt; [ kicker ]</div>
<h1 class="h-slide up" style="--i:1">[ headline ], <span class="cy">[ highlight ]</span></h1>
<p class="lead up" style="--i:2; margin-top:clamp(18px,2.6vmin,30px)">[ body, <b>emphasis</b> here ]</p>
```

### Source chips + inline link
```html
<div class="sources up" style="--i:4">
  <span class="src-tag">source</span>
  <a class="chip" href="https://REAL-URL" target="_blank" rel="noopener">[ name ]</a>
</div>
```
Inline: `… as <a class="ulink" href="https://REAL-URL" target="_blank" rel="noopener">this report</a> notes …`

---

## Data & concept visuals

### Interactive timeline
The **last row auto-highlights** as "now".
```html
<div class="tl">
  <div class="tlrow up" style="--i:2">
    <span class="tl-dot"></span><span class="tl-when">[ when ]</span>
    <div><div class="tl-term">[ label ]</div><div class="tl-by">[ note ] - <em>[ status/who ]</em></div></div>
    <div class="tl-src"><a class="chip" href="https://REAL-URL" target="_blank" rel="noopener">[ src ]</a></div>
  </div>
  <!-- repeat tlrow -->
</div>
<div class="tl-cap up" style="--i:7">[ closing line ]<small>[ small note ]</small></div>
```

### Concentric rings + orbits
Rings draw outer→inner, then dots fade in (CSS-handled). Keep 4 layers.
```html
<div class="ringgrid">
  <div class="ringstage up" style="--i:2">
    <div class="rg r4"></div><div class="rg r3"></div><div class="rg r2"></div><div class="rg r1"></div>
    <div class="orb o4"><i></i></div><div class="orb o3"><i></i></div><div class="orb o2"><i></i></div><div class="orb o1"><i></i></div>
    <div class="core"><small>[ core ]</small></div>
  </div>
  <div class="legend">
    <div class="lg l1 up" style="--i:3"><span class="sw"></span><div><div class="t">[ layer 1 ]</div><div class="d">[ desc ]</div></div></div>
    <div class="lg l2 up" style="--i:4"><span class="sw"></span><div><div class="t">[ layer 2 ]</div><div class="d">[ desc ]</div></div></div>
    <div class="lg l3 up" style="--i:5"><span class="sw"></span><div><div class="t">[ layer 3 ]</div><div class="d">[ desc ]</div></div></div>
    <div class="lg l4 up" style="--i:6"><span class="sw"></span><div><div class="t">[ layer 4 ]</div><div class="d">[ desc ]</div></div></div>
  </div>
</div>
<div class="ring-cap up" style="--i:7">[ summary ] <b>[ key phrase ]</b></div>
```

### Bar chart (before/after)
Bar **heights** are set in CSS (`.bar.before .col`, `.bar.after .col`) — edit them
to match your values; the `.val` label is the absolute number shown above.
```html
<div class="barwrap up" style="--i:3">
  <div class="bar before"><div class="col"><span class="val">[ old ]</span></div></div>
  <div class="bar after"><div class="col"><span class="val">[ new ]</span></div></div>
</div>
<div class="bar-axis up" style="--i:4"><span>[ left ]</span><span>[ right ]</span></div>
<div class="delta up" style="--i:4">[ +delta · note ]</div>
```

### Nesting boxes
```html
<div class="nest up" style="--i:2">
  <div class="nbox n4">[ outer ]</div>
  <div class="nbox n3">[ … ]</div>
  <div class="nbox n2">[ … ]</div>
  <div class="nbox n1">[ inner ]</div>
</div>
```

### Signal/noise sorter
```html
<div class="sorter up" style="--i:3">
  <div class="sin">[ input? ]</div>
  <div class="sarrow">-&gt;</div>
  <div class="sbranch">
    <div class="sbr good">[ keep ]</div>
    <div class="sbr mid">[ neutral ]</div>
    <div class="sbr bad">[ drop ]</div>
  </div>
</div>
```

### Filter pipeline
```html
<div class="pipe up" style="--i:3">
  <div class="pipe-box"><div class="pipe-h">[ input ]</div><div class="pipe-item">[ detail ]</div></div>
  <div class="pipe-arrow">-&gt;</div>
  <div class="pipe-box hot"><div class="pipe-h">[ process ]</div><div class="pipe-item">[ what it does ]</div></div>
  <div class="pipe-arrow">-&gt;</div>
  <div class="pipe-box"><div class="pipe-h">[ output ]</div><div class="pipe-item">[ result ]</div></div>
</div>
```

### Backlog stack
Cards appear one-by-one (CSS-staggered); front card (`s1`) is brightest.
```html
<div class="stack">
  <div class="scard s5">[ item ] <span class="q">?</span></div>
  <div class="scard s4">[ item ] <span class="q">?</span></div>
  <div class="scard s3">[ item ] <span class="q">?</span></div>
  <div class="scard s2">[ item ] <span class="q">?</span></div>
  <div class="scard s1">[ item ] <span class="q">?</span></div>
  <div class="stack-badge">[ badge ]</div>
</div>
```

---

## Card visuals

### Chat card (thinking + streaming reply)
Put it on a `split` slide. **Any slide containing `id="chatBody"` animates
automatically** (thinking dots → typewriter) via the template's `animateChat()`.
```html
<div class="chatcard up" style="--i:2">
  <div class="winbar"><i class="t1" style="background:var(--faint)"></i><i class="t2" style="background:var(--teal)"></i><i class="t3" style="background:var(--cyan)"></i><span class="ttl">assistant</span></div>
  <div class="chat-body" id="chatBody">
    <div class="msg you"><span class="who">you</span>[ question ]</div>
    <div class="msg thinking"><span class="who">assistant</span><span class="dots"><i></i><i></i><i></i></span></div>
    <div class="msg bot" data-text="[ the reply — it gets typed out character by character ]"><span class="who">assistant</span><span class="botxt"></span><span class="tcur"></span></div>
  </div>
</div>
```

### Right-side stacked cards (content appears layer by layer)
```html
<div class="col-right">
  <div class="eyebrow up" style="--i:0">&gt; [ kicker ]</div>
  <h1 class="h-slide up" style="--i:1">[ headline ] <span class="cy">[ highlight ]</span></h1>
  <div class="rcard up" style="--i:2">[ card one ]</div>
  <div class="rcard up" style="--i:3">[ card two, <b>emphasis</b> ]</div>
</div>
```

### Labeled card with light-up keywords
Each `.kw` lights up on a stagger via inline `animation-delay` (keep them ascending).
```html
<div class="jdcard up" style="--i:2">
  <div class="jd-head">[ card title ]</div>
  <div class="jd-body">
    <div class="jd-row">[ line ] <span class="kw" style="animation-delay:.9s">[ term ]</span> / <span class="kw" style="animation-delay:1.05s">[ term ]</span></div>
    <div class="jd-row">[ line ] <span class="kw" style="animation-delay:1.2s">[ term ]</span></div>
    <!-- bump each delay by ~.15s -->
  </div>
  <div class="jd-note">[ small note ]</div>
</div>
```

### Comparison paths (✓ / ✕)
The marks are the one warm-color exception (green / red).
```html
<div class="paths">
  <div class="path bad up" style="--i:3">
    <div class="phead"><span class="mark">✕</span>[ the wrong way ]</div>
    <div class="flow">
      <span class="pstep">[ step ]</span><span class="parr">↓</span>
      <span class="pstep">[ step ]</span><span class="parr">↓</span>
      <span class="pstep">[ bad outcome ]</span>
    </div>
  </div>
  <div class="path good up" style="--i:4">
    <div class="phead"><span class="mark">✓</span>[ the right way ]</div>
    <div class="flow">
      <span class="pstep">[ step ]</span><span class="parr">↓</span>
      <span class="pstep">[ step ]</span><span class="parr">↓</span>
      <span class="pstep">[ good outcome ]</span>
    </div>
  </div>
</div>
```

### Action cards (closing)
```html
<div class="acts up" style="--i:2">
  <div class="actcard"><div class="act-n">01</div><div class="act-t">[ action ]</div><div class="act-d">[ detail ]</div></div>
  <div class="actcard hot"><div class="act-n">02</div><div class="act-t">[ action ]</div><div class="act-d">[ detail ]</div></div>
</div>
```

---

## SVG diagrams
Colors are hardcoded in the SVG (matching the palette) because SVG presentation
attributes don't read CSS variables. Keep the hexes consistent. `<text>` already
uses the CJK-capable mono family via the wrapper CSS.

### Radial hub-and-spoke (a center with parts around it)
6 nodes on a hexagon — **no node sits straight above or below the hub**, so no
spoke dangles vertically. Edit labels; keep the geometry.
```html
<div class="hub up" style="--i:2">
  <svg viewBox="0 0 620 400" role="img" aria-label="[ describe ]">
    <ellipse class="orbit" cx="310" cy="200" rx="240" ry="150"/>
    <line class="spoke" x1="310" y1="200" x2="430" y2="70"/>
    <line class="spoke" x1="310" y1="200" x2="550" y2="200"/>
    <line class="spoke" x1="310" y1="200" x2="430" y2="330"/>
    <line class="spoke" x1="310" y1="200" x2="190" y2="330"/>
    <line class="spoke" x1="310" y1="200" x2="70" y2="200"/>
    <line class="spoke" x1="310" y1="200" x2="190" y2="70"/>
    <g><rect class="chan" x="382" y="53" width="96" height="34" rx="9"/><text class="chan-t" x="430" y="75" text-anchor="middle">[ node ]</text></g>
    <g><rect class="chan" x="502" y="183" width="96" height="34" rx="9"/><text class="chan-t" x="550" y="205" text-anchor="middle">[ node ]</text></g>
    <g><rect class="chan" x="382" y="313" width="96" height="34" rx="9"/><text class="chan-t" x="430" y="335" text-anchor="middle">[ node ]</text></g>
    <g><rect class="chan" x="142" y="313" width="96" height="34" rx="9"/><text class="chan-t" x="190" y="335" text-anchor="middle">[ node ]</text></g>
    <g><rect class="chan" x="22" y="183" width="96" height="34" rx="9"/><text class="chan-t" x="70" y="205" text-anchor="middle">[ node ]</text></g>
    <g><rect class="chan" x="142" y="53" width="96" height="34" rx="9"/><text class="chan-t" x="190" y="75" text-anchor="middle">[ node ]</text></g>
    <rect class="hubbox" x="214" y="152" width="192" height="96" rx="18"/>
    <text class="hub-t1" x="310" y="187" text-anchor="middle">[ center ]</text>
    <text class="hub-t2" x="310" y="208" text-anchor="middle">[ subtitle ]</text>
    <text class="hub-cap" x="310" y="231" text-anchor="middle">[ trait - trait - trait ]</text>
  </svg>
</div>
```

### Loop (a virtuous cycle)
4 nodes clockwise; the cyan `back` arc closes the loop. Edit labels; keep geometry.
```html
<div class="loop up" style="--i:2">
  <svg viewBox="0 0 480 340" role="img" aria-label="[ describe ]">
    <defs>
      <marker id="ah" markerWidth="10" markerHeight="10" refX="6.5" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L7,3 L0,6 Z" fill="#517E94"/></marker>
      <marker id="ahc" markerWidth="10" markerHeight="10" refX="6.5" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L7,3 L0,6 Z" fill="#B4EBFD"/></marker>
    </defs>
    <circle class="guide" cx="240" cy="165" r="125"/>
    <path class="arc" d="M278.6,46.1 A125,125 0 0 1 357.5,122.2" marker-end="url(#ah)"/>
    <path class="arc" d="M357.5,207.8 A125,125 0 0 1 282.8,282.5" marker-end="url(#ah)"/>
    <path class="arc" d="M197.2,282.5 A125,125 0 0 1 122.5,207.8" marker-end="url(#ah)"/>
    <path class="arc back" d="M122.5,122.2 A125,125 0 0 1 197.2,47.5" marker-end="url(#ahc)"/>
    <text class="ctr" x="240" y="170" text-anchor="middle">&#8635; [ center ]</text>
    <text class="blab" x="128" y="96" text-anchor="middle">[ back-arc label ]</text>
    <g><rect class="lnode" x="178" y="19" width="124" height="42" rx="21"/><text class="lt" x="240" y="45" text-anchor="middle">[ top ]</text></g>
    <g><rect class="lnode" x="303" y="144" width="124" height="42" rx="21"/><text class="lt" x="365" y="170" text-anchor="middle">[ right ]</text></g>
    <g><rect class="lnode" x="178" y="269" width="124" height="42" rx="21"/><text class="lt" x="240" y="295" text-anchor="middle">[ bottom ]</text></g>
    <g><rect class="lnode hot" x="53" y="144" width="124" height="42" rx="21"/><text class="lt hot" x="115" y="170" text-anchor="middle">[ left (highlight) ]</text></g>
  </svg>
</div>
```
