# SANGRE web model

- `public/sangre/sangre.glb`: unmodified user-supplied SolidWorks GLB export (2,418,664 bytes).
- `public/sangre/screen.png`: unmodified user-supplied dashboard image. Illustrative interface, not live health data.
- `app/work/sangre/orbit-scene.ts`: presentation materials, display decal and separated assembly view. CAD geometry remains unchanged.

The export contains six meshes in scene traversal order: battery, display, housing, chassis, switch and storage lid. Original Chinese node names have export encoding damage; geometry and order are used to identify parts. Rendering uses warm ivory plastic, a dark display bezel, a transparent lid and a metallic internal chassis, referencing the existing portfolio renders.

The four guided views support the existing research and physical prototype story. Layer offsets explain assembly relationships; they do not simulate a mechanical disassembly sequence. No electronic detection or medical validation is represented.
