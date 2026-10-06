# SANGRE procedural product story

The active SANGRE opening uses Three.js geometry built in `app/work/sangre/procedural-model.ts`. There are no GLB loaders, imported meshes or videos in the active display. Other case studies and the research/prototype sections are unchanged.

## Reference and CMF

- Envelope: 158 × 100 × 59 mm from the supplied `final.png` engineering sheet; scene scale is 1 unit = 50 mm.
- Form/finish: `3-2.jpg`, `6.jpg`, `10.jpg` and the engineering views. Warm ivory PP, satin surfaces, rounded wedge walls, black screen surround, clear PET storage cover, a recessed insertion slot and fine parting lines.
- Procedure-built parts: hollow upper/lower shells, molded supports and screw posts, pads/switch, folding display and hinge, removable tray/cover, three-well test strips and sliding details, boards/components, battery, copper winding and optical enclosure.
- `public/sangre/screen.png` is the supplied compact UI. `portrait-dashboard.svg` is the redesigned expanded UI at the exact 900 × 2000 (9:20) display ratio, with one primary trend and five secondary readings. The previous `unfolded-ui.png` is kept as a historical asset. `material-reference.jpg` and `structure-reference.jpg` are original user renders, available through the reference dialog.
- The reconstruction follows the reference silhouette and material roles. Hinge, electronics and assembly paths illustrate the design; they are not verified manufacturing geometry or a functioning detection system.

The display uses one UV-continuous surface with a finite bend radius and a matching flexible bezel. It opens flat without a black seam; the compact interface fades into the expanded layout during unfolding. The hidden hinge follows the bend, and labels follow the moving screen. This is a presentation approximation, informed by [Samsung Flex Hinge](https://www.samsung.com/uk/support/mobile-devices/discover-the-new-flex-hinge-for-the-samsung-galaxy-z-flip5-and-fold5/), not a reproduction of its engineering. The dashboard values and trend are illustrative.

## Camera and typography

`orbit-scene.ts` owns the renderer, studio environment, camera, shadows and part transforms. `story-timeline.mjs` provides one reversible, continuous scroll timeline: overview → material close-up → unfolding → strip positioning → exploded interior. A brief entry orbit settles into the first composition; the renderer sleeps when the pose and pointer settle, when the stage leaves the viewport, or when the tab is hidden.

Aether's scene-led composition informed the presentation. The title uses separate line masks, followed by the description and component callouts. Exit motion runs before each next chapter, and reverse scrolling reverses the masks. Typography is updated from the camera's eased progress, rather than running an unrelated mount animation. Each desktop chapter has a distinct title/annotation composition; narrow views preserve a common reading column and omit fine callout lines. Reduced motion switches directly between held chapter poses. No GSAP, smooth-scroll library or new dependency was added.

Clear PET uses geometric wall thickness, transmission, restrained alpha blending and fine edge highlights. A real scene background is sampled by the refraction pass: an alpha-only canvas would give the transmission buffer a white background. Large neutral studio cards, key/fill/rim lighting and restrained exposure keep the ivory from washing out or turning green. The model uses shared material roles and merges fixed details by material inside each moving assembly.

## Budget and checks

Targets: <= 100 main render calls, <= 300k reported triangles in the guided views, capped DPR (desktop 1.65 / mobile 1.35), one shadow-casting light, 2048 desktop / 1024 mobile shadow maps, no post-processing chain. The folded-display capture measured 48 calls, 88,520 triangles, 28 geometries and 9 textures after the flexible-screen update. Culling the hidden electronics reduced the assembled views from 277k to 89k triangles. These renderer counts include the transmission work; animation frame timing in headless Chrome is diagnostic, not a promise for physical mobile devices.

Run `node --test tests/sangre-timeline.test.mjs` for continuous bounded poses, model envelope, exact reset after unfolding/disassembly, strip clearance above the lid/tray, display aspect ratio / bend length / seam clearance, and the title's staggered entry/exit. Run the existing production build and rendered HTML checks as well. Browser verification covers all five desktop/mobile compositions, intermediate and reverse motion, English, reduced motion, chapter/range controls, reference modal/Escape, rendering failure/retry and continuation into the research section.

Original source GLBs remain in `public/sangre` and `art/sangre/source`; the old rendered film and Blender rebuild scripts are preserved as historical assets. They are not fetched by the active opening. The previous imported-model scene and auxiliary approximated structure implementation have been replaced.
