# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — run the Vite dev server against `playground/` (live preview of rendering).
- `pnpm build` — produce distributables: `vite build` emits the UMD/browser bundle, then `unbuild` emits ESM (`.mjs`), CJS (`.cjs`), and `.d.ts` declarations into `dist/`.
- `pnpm test` — run Vitest (watch mode). Use `pnpm vitest run` for a single pass, or `pnpm vitest run -t "<name>"` to run one test by name.
- `pnpm typecheck` — `tsc --noEmit`.
- `pnpm lint` — ESLint (`@antfu/eslint-config`). A `pre-commit` hook runs `eslint --fix` on staged files via lint-staged.
- `pnpm release` — bump version, tag, and push (triggers the publish workflow).

Package manager is **pnpm** (`pnpm@10.19.0`).

## Architecture

This is a library that renders an **IDoc** (intermediate document model from the `modern-idoc` package) into **SVG**. There is no DOM/canvas rendering — the output is a serialized SVG string, a `Blob`, or an `SVGSVGElement` parsed from that string.

### Pipeline

`Document` (loose input) → `normalizeDocument()` → `NormalizedDocument` → `XmlNode` tree → SVG string

1. **Public methods** (`src/methods/`) are thin wrappers that construct a `SvgRenderer` and call one of its terminal methods:
   - `docToSvg` → `toDom()` (parses the string with `DOMParser`)
   - `docToSvgString` → `toString()`
   - `docToSvgBlob` → `toBlob()`

2. **`SvgRenderer`** (`src/renderers/SvgRenderer.ts`) holds all rendering logic. Key points:
   - The constructor calls `normalizeDocument(doc)` — downstream code only ever sees normalized types (`NormalizedElement`, `NormalizedFill`, etc.).
   - `docToXmlNode` builds the root `<svg>`. **Slides/pages are stacked vertically**: viewBox height = single page height × number of children.
   - `elementToXmlNodes` is the recursive workhorse. For each element it assembles, in order: shape paths (into `<defs>`), `fill`, `outline` (stroke + line-end markers), `shadow` (drop shadow as a `<filter>`, rendered only when `shadow.enabled`), `background`/`foreground` fills, `table`, `chart`, `text`, and nested `children`. Note: `modern-idoc` flattens effect fields (`fill`/`outline`/`shadow`/`transform`) directly onto `NormalizedElement` — there is no nested `element.effect`.
   - Element transforms come from `style`: `rotate`/`scaleX`/`scaleY`/`skewX`/`skewY` become a `transform` on the shape group, `left+translateX`/`top+translateY` become the outer `translate`, plus `opacity` and a raw `style.transform` string.
   - `connection`: when an element has no `shape.paths`, a line path is generated from `connection.mode` (`straight`/`orthogonal`/`curved`) inside the element bbox, then styled by `outline`/markers like any other shape.
   - `table` (`parseTable`): lays out cells from `columns`/`rows` (falling back to equal split of the element size), draws cell background + border, and recurses `elementToXmlNodes` into each cell's `children` (honoring `rowSpan`/`colSpan`).
   - `chart`: **not** vectorized. If the element carries a pre-rasterized bitmap in a `raster` field (a fallback convention — see below), it is drawn as an `<image>` via `parseRasterImage`; otherwise a dashed placeholder with the chart title is shown.

### Rasterization fallback (`raster`)

Content that cannot be reasonably vectorized here (charts today; potentially video/complex OLE later) is expected to be pre-rasterized **upstream** and attached to the element as `raster` (a data-URL or URL). This renderer only *consumes* it (`parseRasterImage`). The rasterization itself is intended to live in `modern-idoc` as a shared, renderer-agnostic step, because `modern-idoc` does not yet declare/preserve `raster` — until it does, `normalizeDocument` strips the field and charts fall back to the placeholder. Shapes are referenced via `<use xlink:href>` pointing at path/rect definitions in `<defs>`. A per-element `uuid` (`idGenerator()`) prefixes all generated def IDs to avoid collisions.
   - Fill dispatch: `parseFill`/`_parseFill` route to `parseGradientFill` (linear/radial → `<linearGradient>`/`<radialGradient>` in defs), `parseImageFill` (→ `<pattern>` with crop/stretch-rect transforms), or a solid color string. `fillMap` deduplicates identical gradient defs.
   - **Two rendering config flags** (`SvgRendererOptions`, both default `true`):
     - `embedImage` — fetch each image and inline it as a base64 `data:` URI; when `false`, the original URL is referenced.
     - `embedText` — render glyphs as vector `<path>` (`d` from glyph outlines) when glyph boxes are available; when `false`, fall back to `<text>`/`<tspan>`.

3. **Text layout** is delegated to `measureText` from `modern-text`. The renderer feeds it paragraphs/fragments (adjusting line-height for padding) plus `this.doc.fonts`, then converts the measured characters into either glyph paths or positioned `<tspan>`s.

4. **`XmlRenderer`** (`src/renderers/XmlRenderer.ts`) is a minimal, dependency-free serializer: an `XmlNode` ({ tag, attrs, children }) tree → XML string. It HTML-encodes text children, expands a `style` attr object into a CSS string, and drops empty/`null`/`undefined` attributes. The whole renderer produces `XmlNode` trees and serializes them here at the end.

### Dependencies

- **`modern-idoc`** — the document model and its `normalizeDocument`, plus utilities (`idGenerator`, `isNone`, `parseColor`). This is the source of truth for all input/normalized types.
- **`modern-text`** — text shaping/measurement (`measureText`).
- The `playground/` additionally uses `modern-font` to load a fallback font before rendering.

When changing rendering behavior, the playground (`playground/src/main.ts`) is the fastest way to see results visually; the `test/` suite is currently a placeholder.
