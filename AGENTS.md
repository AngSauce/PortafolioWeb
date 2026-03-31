# AGENT GUIDE

## Purpose
- Deliver guidance to autonomous agents working in this Astro portfolio so every change respects the curated experience.
- Highlight the conventions for styling, testing, tooling, and the `cv.json` data source so there is low-context onboarding.

## Environment & Tooling
- Use Node 18 (matches `.github/workflows/deploy.yml`) and Bun exclusively. The workflow installs Bun and then runs `bun install` + `bun run build`.
- Do not mix npm, yarn, or pnpm commands; any deviation risks creating a divergent lock file and breaking CI.
- The site is an Astro 5.x project (`package.json`), so prefer `bun run astro ...` when using Astro CLI helpers.
- All dependencies are installed through Bun (`bun install`). Keep the `bun.lockb` file in sync with any dependency change.

## Setup Checklist
1. Ensure Node 18 is active locally (use `nvm`, `volta`, or your preferred manager).
2. Run `bun install` from the repository root to hydrate `node_modules` and the Bun lock file.
3. Start the dev server via `bun run dev` before running Playwright so the tests have a running target.

## Essential Commands
| Command | Intent |
| :------ | :---- |
| `bun install` | Install/refresh dependencies (mirror CI). |
| `bun run dev` | Launch the Astro dev server (default port 3000). |
| `bun run build` | Compile the site for production, outputting to `dist/`. |
| `bun run preview` | Serve the production build locally for QA. |
| `bun run astro -- --help` | Access Astro CLI utilities (add, check, etc.). |
| `bun exec playwright test` | Run the full Playwright suite. |
| `bun exec playwright test tests/proyectos.spec.ts` | Execute just the `proyectos` spec (recommended for quick verification). |

### Bonus Playwright Flags
- Add `--project=chromium` to target a specific browser or `--grep "keyword"` to scope the run when the suite grows.
- Always ensure `bun run dev` is active on `http://localhost:3000` when running Playwright; the spec assumes that URL.

## Testing Notes
- The single E2E spec lives in `tests/proyectos.spec.ts` and asserts that the project carousel renders three images.
- Playwright depends on the UI being stable: avoid simultaneous CSS navigation or auto-scrolling that hides `#slider` during the test.
- If Playwright fails locally, rerun with `--headed --slow-mo=50` to visually inspect what timing or rendering issue occurred.
- When editing the spec, keep selectors (e.g., `#slider`, `img`) in sync with DOM changes so the test remains reliable.
- Running a single spec requires a running dev server on `http://localhost:3000`; stop the server after the run to avoid port conflicts.

## Visual Language
- The landing experience leans on moody gradients and layered textures—lean on Tailwind combos like `bg-linear-to-r` and `shadow-lg` to match the current tone.
- Keep the palette anchored to the `--backgroundcolor`, `--profilemaincolor`, and `--profilesecondcolor` tokens defined in `Layout.astro`.
- Wherever you need atmospheric depth, combine semi-transparent overlays (`bg-white/10`, `backdrop-blur`) with metallic text treatments (`text-gray-250`).
- Background art (e.g., `BackgroundPaint.astro`) should stay behind the main content; avoid absolute positioning changes that disrupt natural flow.

## Motion & Animation
- Motion should feel intentional: use staggered reveals on load or hover effects that reinforce the layout rhythm rather than distract from it.
- Mirror existing patterns (shine gradients in `AboutMe.astro`, drag-to-scroll `#slider`) when introducing new animations, and keep durations in the 200–500ms range.
- Prefer CSS transitions over JS tweens; reserve scripts for gestures or manual control (carousel prev/next drag, slider snapping).
- Avoid auto-rotating carousels—manual controls keep the interface predictable for Playwright and for users with motion sensitivity.

## UX Voice
- Keep labels and microcopy confident and concise; the tone mirrors a polished professional portfolio.
- Prioritize Spanish copy that reads naturally for local visitors, but fall back to English when mixing brands/components requires it.
- Use verbs that imply action and craft ("Explora", "Descubre", "Construido con").
- Balance technical detail with human readability—avoid dense sentences inside cards.

## Data & JSON Maintenance
- `cv.json` is the canonical data source for `Header`, `Experiencia`, `Proyectos`, etc. When you add a new project, update this file with `name`, `description`, `images`, `url`, and optional `video`/`idvideo` entries.
- Align each project category key (`icest`, `tibugames`, `expertices`) with the matching folder in `src/assets/Proyectos` so asset resolution stays consistent.
- Every image entry needs a matching file and descriptive `alt`. If the filename changes, update both the JSON entry and the actual asset (follow the folder conventions).
- Guard any optional field with optional chaining and fallbacks (`const projects = cv.projects?.[0] ?? {};`). Do not assume every section exists.
- When adding video entries, supply either `video` (full URL) or `idvideo` (YouTube ID) and handle both shapes in the rendering component.

## Error Handling & Logging
- Avoid uncaught exceptions by checking that DOM queries return values before accessing properties when writing inline scripts.
- Log only during development. Remove `console.log` statements before merging; the site should stay quiet in production builds.
- For asynchronous flows, fail gracefully: show a message or hide a section if data is missing rather than letting the layout break.
- When referencing `cv.json`, default to empty arrays/objects so the component renders even if the data is partially populated.
- Guard browser-specific APIs (`document`, `window`) with existence checks when a component might be prerendered or run in SSR.

## Review & Handoff
- After development, run `bun run build` and `bun exec playwright test tests/proyectos.spec.ts` with the dev server running to catch markup or interaction regressions.
- Manually verify `#slider` and any new animations on both desktop and mobile viewport widths before signing off.
- Document any new data keys you introduce (`video`, `idvideo`, `images`) inside this guide so future agents can extend the carousel without guessing.
- If you touch assets, run `bun run build` again to ensure Vite processes them, then inspect `dist/` if necessary.

## Maintenance Checklist
- Confirm that `cv.json` additions include descriptive `alt` text, working URLs, and the right folder keys.
- Use `bun exec playwright test tests/proyectos.spec.ts` after a layout change that touches `#slider` to ensure the carousel still renders three images.
- When animations change, confirm there are corresponding CSS fallbacks in the component-level `<style>` block.

## Code Styling Rules
### Astro Frontmatter
- Keep frontmatter lean; import only what the component uses (layouts, data, helper types).
- Favor destructured props (e.g., `const { experiencias } = Astro.props;`) over repeated `Astro.props` lookups.
- Use TypeScript interfaces in `.astro` components when passing structured data between files (see `Experiencia.astro`).

### Import Ordering
- Order imports by origin: 1) built-in/runtime helpers, 2) third-party libraries (e.g., `simple-icons-astro`), 3) layouts/components, 4) data (like `cv.json`), 5) styles and assets.
- Keep import lines short and grouped logically with a blank line between sections.

### Naming & Structure
- Components follow PascalCase (`AboutMe.astro`, `Header.astro`).
- IDs and class names use kebab-case (`#slider`, `.text-3xl`).
- Section headings should be semantically wrapped in `<section>` with descriptive titles and optional `aria` labels.

### Tailwind + CSS
- Leverage Tailwind utility classes for spacing, layout, typography, colors, and responsive behavior (`md:`, `lg:` variants).
- Maintain the custom design tokens defined inside `Layout.astro` (`--backgroundcolor`, `--profilemaincolor`, `--profilesecondcolor`, `--accent-dark`).
- Use gradients, texture effects, and the `shine` animation pattern sparingly (see `AboutMe.astro`) to reinforce the brand tone.
- Keep global styles minimal; prefer encapsulated `<style>` blocks inside the component when a bespoke animation is required.

### Typography & Look
- Continue using the `Geologica` variable font; pair it with `system-ui` and `sans-serif` as fallbacks.
- Titles should feel bold and modern (`text-3xl`, `font-bold`), while body text stays relaxed (`text-gray-600`, `leading-relaxed`).
- Avoid default Inter/Roboto stacks unless a new font is explicitly introduced; the current palette leans into mid-tone grays and calm blues.

### Data Handling
- The canonical dataset is `cv.json`. Always guard against undefined paths (`cv.projects?.[0] ?? { ... }`).
- Keep the JSON keys (`icest`, `tibugames`, `expertices`) aligned with folder names inside `src/assets/Proyectos` for asset resolution.
- Update `cv.json` whenever project data changes so the UI can render new cards without manual duplication.

### Asset Resolution
- Prefer `import.meta.glob` or static `import` statements for assets so Vite can optimize them; never hard-code `/src/assets/...` in markup.
- When adding new images, place them under the matching category folder and register the filename + alt text inside `cv.json`.
- Provide meaningful `alt` text for every image; when an image is purely decorative, use `aria-hidden="true"` and skip the text.

### Scripts & Interactivity
- Inline scripts use `<script is:inline>` and must reference unique selectors (see the `#slider` drag handler).
- When adding new DOM interactions, ensure they do not introduce global state leaks; scope variables to the component and guard their existence before calling methods.
- Prefer CSS transitions/animations for performance; add JavaScript only when you need fine-grained control (drag, toggle, or complex sequencing).

### Accessibility
- All links should include `rel="noopener noreferrer"` when they open external targets.
- Buttons in the carousel include `sr-only` text so screen readers know what `Anterior` / `Siguiente` do.
- Maintain focus styles via Tailwind `focus:` utilities to keep navigation accessible, especially inside sticky headers like `Header.astro`.

## Accessibility Audits
- Walk through the interface with keyboard-only navigation to ensure every interactive element is reachable.
- Keep an eye on color contrast between text (`text-gray-250`, `text-white`) and the ever-present dark backgrounds; adjust opacity overlays if contrast drops below WCAG AA.
- When adding new sections, include `aria-label`/`aria-labelledby` attributes where semantics are not obvious.

## Deployment & CI Tips
- Deployment runs on GitHub Actions and targets Pages. The `deploy` job depends on the `build` job that uploads `./dist`.
- Keep `bun run build` artifact-ready: no debug toggles that assume `dev` mode, and do not import local-only modules (like Node `fs`) into client components.
- If you update dependencies, rerun `bun install` and commit the regenerated `bun.lockb` file.
- Run `bun run preview` before pushing to catch hydration issues that only appear in production rendering.
- Keep the `dist/` folder clean between builds; remove lingering artifacts before packaging with GitHub Pages.

## Cursor/Copilot Instructions
- There are no `.cursor/rules/` files and no `.github/copilot-instructions.md`. No additional agent-specific instructions exist in this repository.

## Troubleshooting & Next Steps
- If `bun run dev` fails, delete `node_modules`, rerun `bun install`, and confirm Bun is using the Node 18 toolchain.
- Before pushing, run `bun run build` locally and then `bun exec playwright test tests/proyectos.spec.ts` after the server is running to catch regressions early.
- Consider adding more Playwright specs if new interactive components appear. Keep each spec focused (one scenario per test) and rely on selectors that survive layout tweaks.
- Use `bun run preview` to verify the production output, and watch the carousel on mobile viewports to ensure the drag-to-scroll still works.
- After running Playwright, stop the dev server so the port is free for follow-on tasks.
