# 3D Layout Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the landing page to the layout and structure of the "3a Dark · 3D" draft, with live three.js scenes in the hero, the idea section and the contact section, while keeping the current night palette.

**Architecture:** One framework-free module (`createNetLaveScene.ts`) builds and disposes a three.js scene inside a given element. A small client component (`NetLaveScene.tsx`) dynamically imports that module in an effect, so three.js stays out of the server render and loads in its own chunk. Sections stay Server Components and render `<NetLaveScene>` as an absolutely positioned background or figure. Layout changes are SCSS-module only. Type is rescaled through the existing tokens in `_tokens.scss`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript strict, SCSS modules, three.js 0.186 (`three`, `@types/three`).

**Spec:** The reference design is `../../Design system color update/NetLave Restyle.dc.html`, section `3a` (lines 29–111), and its scene script `../../Design system color update/netlave-3d.js`. The decisions taken in conversation are listed under Global Constraints.

## Global Constraints

- Colors stay as they are. Use only the existing tokens (`--color-*` in `src/styles/_tokens.scss`). Do not bring over the demo's hex values (`#57d7c9`, `#0a0d10`, `#8d9ba0`, `rgba(255,255,255,.08)` …). Map them to tokens: accent → `--color-accent`, page → `--color-background`, muted text → `--color-text-muted`, hairlines → `--color-border`, card/figure ground → `--color-surface`. Translucent tints use `color-mix(in srgb, var(--token) N%, transparent)`.
- Fonts stay Space Grotesk and IBM Plex Mono. Only the sizes, line heights and tracking change (Task 2).
- Buttons keep their current styles (`buttons.module.scss` is not touched).
- three.js comes from pnpm (`three`, plus `@types/three` as a dev dependency). No CDN imports.
- Scene assets live in `public/scene/`: copy `studio_small_08_1k.hdr` (1.5 MB) and `water-normal-1k.png` (158 KB) from `../../Design system color update/assets/`. The 4K HDR, the 4096px normal maps and `render.png` (a stitched elevation map that 3a doesn't use) are not copied.
- Use pnpm only. Every commit must pass the Husky hook. Never use `--no-verify`.
- Branches: one epic, `epic/3d-layout-skeleton`, branched from `design/update-color-palette` (PR #4, the night palette, is still open). One `feature/<name>` branch per task, branched from the epic and merged back with `git merge --no-ff` using the message `Merge feature/<name> into the 3D layout skeleton epic`. One PR, epic → `main`.
- Commits are atomic and use plain-English summaries in the style of `git log`. No `feat:` prefixes. No AI attribution: no `Co-Authored-By` lines and no "Generated with" lines in commits or PRs.
- Use clear, descriptive names for components, CSS classes and variables. Mobile-first SCSS with `$tablet-min-width` (768px) and `$desktop-min-width` (1024px) from `_breakpoints.scss`.
- There's no test runner, and none gets added (AGENTS.md: no speculative dependencies). The checks for each task are `pnpm typecheck && pnpm lint && pnpm lint:styles && pnpm format:check && pnpm build` plus a browser check with the Playwright MCP against `pnpm dev`, at 375px and 1280px wide.

## Review Focus

1. **WebGL unavailable, or three.js fails to load:** the page still renders all its text and links, there's no uncaught error, and the scene element stays empty. Checked in Task 1, Step 6.
2. **`prefers-reduced-motion: reduce`:** each scene draws one still frame (again once the HDR loads and on resize) and runs no animation loop. Checked in Task 1, Step 6.
3. **375px phone width:** no horizontal scroll, and the giant headings wrap instead of overflowing. Checked in Tasks 3–7 with `document.documentElement.scrollWidth <= innerWidth`.
4. **Scenes off-screen:** a scene that isn't in view stops calling `requestAnimationFrame`, so three WebGL scenes don't render at the same time. Checked in Task 1, Step 6.
5. **React Strict Mode double-mount / HMR:** each `<NetLaveScene>` holds exactly one `<canvas>`. Cleanup removes the canvas and disposes the renderer, geometries, materials and textures. Checked in Tasks 1, 4 and 6 by counting canvases.

---

### Task 0: Epic branch and PR

- [ ] **Step 1:** `git switch design/update-color-palette && git pull`, then `git switch -c epic/3d-layout-skeleton`.
- [ ] **Step 2:** Commit this plan: `git add docs/superpowers/plans/2026-10-22-3d-layout-skeleton.md && git commit -m "Add the plan for the 3D layout skeleton"`.
- [ ] **Step 3:** `git push -u origin epic/3d-layout-skeleton`, then open a **draft** PR to `main` titled `Move the landing page to the 3D layout skeleton`. The body lists the feature branches as a checklist and notes that it depends on #4.

### Task 1: 3D scene component — `feature/3d-scene`

**Files:**

- Modify: `package.json`, `pnpm-lock.yaml`
- Create: `public/scene/studio_small_08_1k.hdr`, `public/scene/water-normal-1k.png`
- Create: `src/components/scene/createNetLaveScene.ts`
- Create: `src/components/scene/NetLaveScene.tsx`
- Modify: `src/components/Hero.tsx`, `src/components/Hero.module.scss` (mount only; the layout comes in Task 3)

**Interfaces (Produces):**

- `export type SceneVariant = "both" | "knot" | "field";`
- `export function createNetLaveScene(container: HTMLElement, options: { variant: SceneVariant; speed: number }): () => void` — builds the scene and returns `dispose`.
- `export function NetLaveScene(props: { variant: SceneVariant; speed?: number; className?: string })` is a `"use client"` component. It renders `<div className={className} aria-hidden="true" />`. In `useEffect` it runs `import("./createNetLaveScene")`, calls `createNetLaveScene` unless the effect was already cleaned up, and calls `dispose` on cleanup. If the import fails, it logs `console.error` and nothing else. `speed` defaults to `1`.

- [ ] **Step 1:** `git switch -c feature/3d-scene epic/3d-layout-skeleton`, then `pnpm add three` and `pnpm add -D @types/three`. Commit `package.json` and `pnpm-lock.yaml` together: `Add three.js`.
- [ ] **Step 2:** Copy the two assets into `public/scene/`. Commit: `Add the studio HDR and water normal map for the 3D scenes`.
- [ ] **Step 3: Write `createNetLaveScene`.** Port the dark (`additive`) branch of `netlave-3d.js` (`_init`, lines 28–177) with the same geometry, camera, fog distances, materials and motion constants. Drop the light-theme branches and the `accent` / `fog` / `blend` attributes. Changes from the demo:
  - Colors come from the container: `getComputedStyle(container).getPropertyValue("--color-accent" | "--color-background" | "--color-surface").trim()`. The accent goes to the rim light and the points, the background to the fog, and the surface to the water and the knot body.
  - Load the HDR with `HDRLoader` from `three/addons/loaders/HDRLoader.js` (it replaces `RGBELoader` in 0.186) from `/scene/studio_small_08_1k.hdr`, and the normal map from `/scene/water-normal-1k.png`.
  - Create the renderer inside a `try`. If it throws, return a no-op `dispose`.
  - Pointer parallax listens on `window` (`pointermove`) and measures against `container.getBoundingClientRect()`, so text laid over the scene doesn't block it.
  - An `IntersectionObserver` on the container starts the `requestAnimationFrame` loop when the scene comes into view and cancels it when it leaves.
  - With reduced motion: no loop. Render once at start, again after the HDR loads, and on every resize.
  - `dispose` cancels the frame, disconnects the `ResizeObserver` and `IntersectionObserver`, removes the pointer listener, disposes every geometry, material and texture plus the PMREM target, calls `renderer.dispose()`, and removes the canvas.
- [ ] **Step 4:** Write `NetLaveScene.tsx` to the interface above. Commit Steps 3–4 together: `Add the NetLave 3D scene component`.
- [ ] **Step 5:** Mount `<NetLaveScene variant="both" className={styles.heroScene} />` as the first child of the hero. Give `.hero` `position: relative; overflow: hidden`. `.heroScene` is `position: absolute; inset: 0`, and `.heroContent` gets `position: relative`. Commit: `Show the 3D scene behind the hero`.
- [ ] **Step 6: Verify.** Run the check command from Global Constraints and expect it to pass. Then in `pnpm dev` with Playwright:
  - The hero shows the water, dot field and knot, and the knot moves.
  - `document.querySelectorAll("canvas").length === 1` (dev runs Strict Mode).
  - Count `requestAnimationFrame` calls with an init script. Scroll to the bottom, and over one second the count stays at 0.
  - With `emulateMedia({ reducedMotion: "reduce" })`, two screenshots taken 1s apart match.
  - With an init script that makes `HTMLCanvasElement.prototype.getContext` return `null`, the hero text still renders and there are no uncaught console errors.
- [ ] **Step 7:** `git switch epic/3d-layout-skeleton && git merge --no-ff feature/3d-scene -m "Merge feature/3d-scene into the 3D layout skeleton epic" && git push`.

### Task 2: Type scale and section rhythm — `feature/type-scale`

**Files:** `src/styles/_tokens.scss`, `src/app/globals.scss`, `src/styles/layout.module.scss`, `src/components/{Idea,Founders,Contact}.tsx` (label markup only)

**Interfaces (Produces):** the tokens `--font-size-display`, `--font-size-numeral`, `--font-size-wordmark`, `--font-size-label`, `--line-height-display`, `--letter-spacing-display`, `--letter-spacing-heading` and `--space-4xl`, plus the CSS module classes `layoutStyles.section` (no border) and `layoutStyles.sectionLabel` (the `NN — Name` form). Later tasks use these names.

- [ ] **Step 1:** In `_tokens.scss`, set these values (desktop sizes come from 3a):
  - `--font-size-heading-1: clamp(3rem, 1.25rem + 7.5vw, 7.5rem)` (120px)
  - `--font-size-display: clamp(3rem, 1rem + 8vw, 7rem)` (founders and contact headings, 112px)
  - `--font-size-heading-2: clamp(2.25rem, 1.5rem + 3vw, 3.75rem)` (60px)
  - `--font-size-heading-3: clamp(1.25rem, 1rem + 1vw, 1.75rem)` (28px)
  - `--font-size-numeral: clamp(3rem, 2rem + 3vw, 4.5rem)` (72px)
  - `--font-size-wordmark: clamp(4.5rem, 1rem + 15vw, 12.5rem)` (200px)
  - `--font-size-lead: 1.1875rem`, `--font-size-label: 0.75rem`
  - `--line-height-heading: 1.02`, `--line-height-display: 0.95`
  - `--letter-spacing-heading: -0.04em`, `--letter-spacing-display: -0.05em`
  - `--space-4xl: 7.5rem`

  In `globals.scss`, use `--letter-spacing-heading` for h1–h3, and give `h1` `--line-height-display` and `--letter-spacing-display`. Commit: `Rescale the type for the larger layout`.

- [ ] **Step 2:** In `layout.module.scss`, drop the `.section` border-bottom and use `padding-block: var(--space-3xl)`, or `var(--space-4xl)` from desktop. `.sectionLabel` becomes the 3a label: mono, `--font-size-label`, `0.1em` tracking, uppercase, `--color-accent`, and no `::after` rule. Remove `.sectionNumber`. Change the three labels to the text `01 — The idea`, `02 — Founders` and `03 — Contact`. Commit: `Replace the section dividers with numbered dash labels`.
- [ ] **Step 3:** Verify with the check command. At 375px and 1280px, the headings are larger and there are no section dividers. Merge into the epic as in Task 1, Step 7.

### Task 3: Hero layout — `feature/hero-layout`

**Files:** `src/components/Hero.tsx`, `src/components/Hero.module.scss`
**Consumes:** `NetLaveScene` (Task 1), type tokens (Task 2)

- [ ] **Step 1:** Rebuild the hero to match 3a, lines 41–56:
  - The scene fills the section. Over it goes a gradient overlay as a `::after` on the scene wrapper: `color-mix` of `--color-background` at 20% at the top, clear from 30% to 55%, then 85% at the bottom, with `pointer-events: none`.
  - Desktop height is `56.25rem`. Below desktop it's `calc(100svh - var(--header-height))`.
  - Content order: top row with the eyebrow pill (`.categoryPill`, hairline border, blurred `--color-background` tint, accent dot) and on the right `.pageMeta` "Founders’ page — 2026". Then the headline (`max-width: 12ch`). Then a bottom row with `.introduction` (lead text and the existing call-to-action buttons, max `27.5rem`) and on the right `.figureCaption` "Fig. 01 — the closed cycle" / "Live · WebGL" (the second line in accent).
  - `.cycleCaption` "TSE water → irrigation → power" is vertical text pinned bottom-left, and shows only from desktop up. `.pageMeta` and `.figureCaption` show only from tablet up.
  - The decorative captions get `aria-hidden="true"`.
  - Use flex/grid for the layout. Only the scene, the overlay and `.cycleCaption` are absolutely positioned.
- [ ] **Step 2:** Verify with the check command. Compare 1280px against 3a. At 375px: no horizontal scroll, the headline wraps, and the buttons are visible without scrolling. Commit: `Lay the hero out over the full-bleed 3D scene`. Merge into the epic.

### Task 4: Idea layout — `feature/idea-layout`

**Files:** `src/components/Idea.tsx`, `src/components/Idea.module.scss`

- [ ] **Step 1:** Build the intro as a grid: text on the left, and from desktop up a second column of `30rem` with `.knotFigure`. On phone the figure stacks below the text with `aspect-ratio: 1`. On desktop its height is `30rem`. Style: `1rem` radius, `--color-border` hairline, `--color-surface` ground, `overflow: hidden`, `<NetLaveScene variant="knot" speed={0.8} />` filling it, and a caption "Fig. 02 — one loop, three stages" bottom-left. The h2 uses `max-width: 16ch`. Verify that there are 2 canvases on the page. Commit: `Put a 3D knot figure beside the idea intro`.
- [ ] **Step 2:** Steps become rows. Each row is a grid of `10rem 1fr 1fr` from tablet up, with `--color-border` hairlines on top and a bottom hairline on the last row. Numerals are `--font-size-numeral` in accent with `line-height: 0.9`. From desktop up, rows 2 and 3 step in by `10rem` and `20rem` (`:nth-child`). On phone, show the numeral above the title and the description. Remove the arrows and the circled numbers. Commit: `Lay the idea steps out as a stepped list with large numerals`.
- [ ] **Step 3:** Verify with the check command and at 375px and 1280px. Merge into the epic.

### Task 5: Founders layout — `feature/founders-layout`

**Files:** `src/components/Founders.tsx`, `src/components/Founders.module.scss`

- [ ] **Step 1:** Header row: from tablet up, the label and h2 "Meet the<br />founders" (`--font-size-display`, `--line-height-display`, `--letter-spacing-display`) sit on the left, and the intro sits on the right (`max-width: 34ch`, right-aligned, aligned to the bottom). On phone they stack. Commit: `Put the founders heading and intro side by side`.
- [ ] **Step 2:** Turn the cards into a 1-column list on phone and 3 columns from tablet up. Each card has a `.portrait` at `aspect-ratio: 3/4`, with a `0.75rem` radius, a hairline, a `--color-surface` ground and a `repeating-linear-gradient(135deg, …)` stripe of `color-mix(--color-text 4%)`. Name and role sit over the bottom of the portrait on a `--color-background` gradient. The bio goes below the portrait. From desktop up, the columns are offset by `6rem`, `0` and `3rem` (`:nth-child` margin-top). Remove the "Photo" text. Commit: `Show founders as staggered portrait cards`.
- [ ] **Step 3:** Verify with the check command and at 375px and 1280px. Merge into the epic.

### Task 6: Contact layout — `feature/contact-layout`

**Files:** `src/components/Contact.tsx`, `src/components/Contact.module.scss`

- [ ] **Step 1:** Put `<NetLaveScene variant="field" speed={0.6} />` behind the section with an overlay: `--color-background` solid at the top, fading to 60% at 40% and to 20% at the bottom. Below desktop the section height follows its content. From desktop up, `min-height: 35rem`. The two-column content grid goes from tablet up: the label plus the h2 in `--font-size-display` on the left, the intro and email on the right. Verify that there are 3 canvases on the page. Commit: `Put the water field behind the contact section`.
- [ ] **Step 2:** Replace the button and the small address with one `.emailLink` `founders@example.com ↗` (the arrow in a `<span aria-hidden="true">`). It's mono, `clamp(1.25rem, 0.5rem + 2.5vw, 2.5rem)`, `display: block`, with a `--color-border` underline. On hover, the text and underline change to `--color-accent`. Use `overflow-wrap: anywhere` so it can't overflow at 375px. Commit: `Make the email address the contact call to action`.
- [ ] **Step 3:** Verify with the check command and at 375px and 1280px. Merge into the epic.

### Task 7: Header and footer — `feature/header-footer-layout`

**Files:** `src/components/SiteHeader.tsx`, `SiteHeader.module.scss`, `SiteFooter.tsx`, `SiteFooter.module.scss`

- [ ] **Step 1:** Prefix each header nav link with a `.navigationNumber` span in accent (`String(index + 1).padStart(2, "0")`, `aria-hidden="true"`), with a gap between it and the label. Commit: `Number the header navigation links`.
- [ ] **Step 2:** Footer: a grid with the outlined wordmark (`--font-size-wordmark`, `line-height: 0.8`, `--letter-spacing-display`, `color: transparent`, `-webkit-text-stroke: 1px var(--color-border)`, `aria-hidden="true"`) and, from tablet up, the nav and copyright aligned to the bottom-right. On phone they stack. Commit: `Give the footer an outlined NetLave wordmark`.
- [ ] **Step 3:** Verify with the check command, and confirm there's no horizontal scroll at 375px (the wordmark must fit). Merge into the epic.

### Task 8: Final check and PR

- [ ] **Step 1:** On the epic, run the full check command. Then use Playwright at 375, 768 and 1280px: no horizontal scroll, 3 canvases, every anchor link lands below the sticky header, and the reduced-motion and no-WebGL checks from Task 1, Step 6 still pass.
- [ ] **Step 2:** Push. Update the PR body (feature checklist ticked, 1280px and 375px screenshots), then mark the PR ready for review.
