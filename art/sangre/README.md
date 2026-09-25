# SANGRE web model

- `public/sangre/sangre.glb`: unmodified user-supplied SolidWorks GLB export (2,418,664 bytes).
- `public/sangre/screen.png`: unmodified user-supplied dashboard image. Illustrative interface, not live health data.
- `app/work/sangre/orbit-scene.ts`: presentation materials, display decal and separated assembly view. CAD geometry remains unchanged.

The export contains six meshes in scene traversal order: battery, display, housing, chassis, switch and storage lid. Original Chinese node names have export encoding damage; geometry and order are used to identify parts. Rendering uses warm ivory plastic, a dark display bezel, a transparent lid and a metallic internal chassis, referencing the existing portfolio renders.

The four guided views support the existing research and physical prototype story. Layer offsets explain assembly relationships; they do not simulate a mechanical disassembly sequence. No electronic detection or medical validation is represented.

## Structural reference update

`public/sangre/structure-reference.jpg` is the unmodified user-supplied `10.jpg`. The structure chapter lifts the complete transparent enclosure and removes the display/storage lid, following that reference. `structure-details.ts` supplies illustrative boards, a copper coil, a sensing enclosure, and the base plate/fixing posts absent from the GLB. These are reference-derived presentation geometry, not validated electronics or manufacturing CAD. The original render is available alongside the 3D view for comparison.

## Chapter 04 pre-rendered film

The 12-second, 24 fps film is rendered offline with Blender Cycles at 1440 × 1080, at least 48 samples in motion, 96 for the held structure frame, and GPU denoising. Chapter 04 disposes the realtime scene, loads only its video, and pauses when offscreen or the tab is hidden. Reduced-motion users receive a still poster until they choose Play. Stage buttons and the timeline seek to a paused frame; videos use half-second keyframes and a seekable Blob fallback for servers that ignore HTTP Range.

Mechanical sources are preserved in `source/assembly-exploded.glb` and `source/test-strip.glb`. The actual upper/lower enclosure, supports, pads and retainer replace the earlier approximate base. The supplied flat display is divided into two render-scene panels and folded around an inferred presentation hinge; the original source file is unchanged. `source/unfolded-reference.jpg` is the supplied 3-2.jpg; `source/unfolded-ui.svg` and its PNG are an adapted illustrative dashboard, not live health readings. Boards and the copper coil remain reference-derived illustrations. The strip retains its geometry/material regions; only its approach path is animated.

Rebuild:

```powershell
& "F:\TOOL 2\blender.exe" -b --factory-startup --python-exit-code 1 --python scripts/render-sangre-structure.py -- --output "E:\Codex File\OWN WEB\tmp\sangre-film-final"
python scripts/encode-sangre-structure.py --ffmpeg "F:\TOOL 2\bin\ffmpeg.exe"
```

Use `--preview` for four low-resolution keyframes and `--frames 1,91,137,240` for selected full-quality frames. Existing output frames are retained to resume interrupted renders; use a fresh output directory after changing the scene. PNG masters and the generated Blender scene remain in ignored tmp. The final two-second held frame uses frame 240. Encoded deliverables are 1440/960 H.264 videos, a poster, four static keyframes and render metadata under `public/sangre/film`.
