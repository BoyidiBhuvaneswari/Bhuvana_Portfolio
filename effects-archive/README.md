# Archived visual effects

These effects were removed from the active portfolio but preserved for possible future reuse.

## Cursor sparkles

Files: `cursor-sparkles.js` and `cursor-sparkles.css`.

Add this canvas near the start of `<body>`:

```html
<canvas id="sparkle-cursor" aria-hidden="true"></canvas>
```

Copy the CSS into the active stylesheet and load the JavaScript after the canvas exists.

## Floating formulas

Files: `floating-formulas.js` and `floating-formulas.css`.

Add this container near the start of `<body>`:

```html
<div id="math-bg" aria-hidden="true"></div>
```

Copy the CSS into the active stylesheet and load the JavaScript after the container exists.

## Particle network

Files: `particle-network.js` and `particle-network.css`.

Archived on 25 September 2026 — this was the active portfolio background until it was replaced with the floating formulas effect. The `script.js` version of the network code was archived into `particle-network.js`.

Add this canvas near the start of `<body>`:

```html
<canvas id="particle-network" aria-hidden="true"></canvas>
```

Copy the CSS into the active stylesheet and load the JavaScript after the canvas exists.

## Floating formulas — restored

Files: `floating-formulas.js` and `floating-formulas.css` are the archived copies. The live effect runs from `script.js` and `style.css` with the `#math-bg` container in `index.html`. The restored version uses a stronger gold color (`rgba(212,175,55,.35)`) with a soft glow so the symbols are clearly visible.

All effects respect `prefers-reduced-motion` and can be restored independently.