# Prototype Instructions

## SANGRE adaptation (2026-10-07)

- Replace the homepage earbuds with the user's SANGRE CAD and KeyShot materials. Preserve the existing background, typography and scroll-loop language.
- Keep Discover Space and independent `/specs` and `/preorder` contents and original models unchanged for this iteration.
- Testing uses a labelled presentation cutaway: hide the clear cover to reveal the guide; do not invent its opening mechanism.
- The cartridge slides horizontally from the FRONT, alongside the display (-Z in the web model), toward the back, sample wells upward. Keep this confirmed travel direction.
- Latest user correction: the FLAT end enters first; the BEVELED end stays outside. Preserve the source CAD orientation; the previous 180-degree rotation was wrong. Identify ends by actual geometry, not the red marker or an arbitrary PCA sign. Earlier red-end-outside wording was our mistaken inference and is superseded.
- Use Design Taste Frontend for visual review, then iterate on rendered desktop and mobile evidence.
- User CAD describes the enclosure and components. Display hinge interpolation is a presentation approximation. Screen readings are illustrative, not verified clinical functionality.
- Match the engineering sheet's Front view and KeyShot render when placing UI. The 90-gloss `.012` surface is the back; the front screen is the thin 20-gloss `.016` surface. Rear cradle and port must never be mistaken for the front display.
- Exploded view should clearly separate the lid, upper enclosure, sensing assembly, lower enclosure and feet, with display and battery separated to the side. Check the whole explosion interval at desktop and phone sizes; a larger gap must not crop components or obscure captions.
- Screen presentation must include a close-up, real animated controls and a compact-to-tall content extension. Match `1-1.png` and `3-2.jpg`; use live DOM projected onto the front screen, with only one accessible interactive surface. Demo tests and readings are illustrative; preserve page scrolling and keep the surrounding Discover content unchanged.
- The left black front/rear frames, hinge and adjoining support/electronics form ONE display assembly. Keep the original `.014` front frame and its connection to `.018`/`.020`; never replace it with an isolated rectangle or leave rear pieces in the enclosure during explosion. Move the complete screen assembly together and check its connection folded, unfolding and exploded.
- Parts must fade in/out with scroll progress instead of popping on/off: exterior/interior handoff, cartridge entry/exit and the storage cutaway. Preserve material appearance at endpoints and reverse smoothly when scrolling backward; hide only after opacity reaches zero.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
