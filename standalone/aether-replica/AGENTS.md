# Prototype Instructions

## SANGRE adaptation (2026-10-07)

- Replace the homepage earbuds with the user's SANGRE CAD and KeyShot materials. Preserve the existing background, typography and scroll-loop language.
- Keep Discover Space and independent `/specs` and `/preorder` contents and original models unchanged for this iteration.
- Testing uses a labelled presentation cutaway: hide the clear cover to reveal the guide; do not invent its opening mechanism.
- The recorded cartridge motion is a flat slide along its long axis, sample wells upward, with the red-marked end remaining outside.
- Use Design Taste Frontend for visual review, then iterate on rendered desktop and mobile evidence.
- User CAD describes the enclosure and components. Display hinge interpolation is a presentation approximation. Screen readings are illustrative, not verified clinical functionality.
- Match the engineering sheet's Front view and KeyShot render when placing UI. The 90-gloss `.012` surface is the back; the front screen is the thin 20-gloss `.016` surface. Rear cradle and port must never be mistaken for the front display.
- Exploded view should clearly separate the lid, upper enclosure, sensing assembly, lower enclosure and feet, with display and battery separated to the side. Check the whole explosion interval at desktop and phone sizes; a larger gap must not crop components or obscure captions.
- Screen presentation must include a close-up, real animated controls and a compact-to-tall content extension. Match `1-1.png` and `3-2.jpg`; use live DOM projected onto the front screen, with only one accessible interactive surface. Demo tests and readings are illustrative; preserve page scrolling and keep the surrounding Discover content unchanged.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
