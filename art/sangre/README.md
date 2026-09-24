# SANGRE web model

- `public/sangre/sangre.glb`: unmodified user-supplied SolidWorks GLB export (2,418,664 bytes).
- `public/sangre/screen.png`: unmodified user-supplied dashboard image. Illustrative interface, not live health data.
- `app/work/sangre/orbit-scene.ts`: presentation materials, display decal and separated assembly view. CAD geometry remains unchanged.

The export contains six meshes in scene traversal order: battery, display, housing, chassis, switch and storage lid. Original Chinese node names have export encoding damage; geometry and order are used to identify parts. Rendering uses warm ivory plastic, a dark display bezel, a transparent lid and a metallic internal chassis, referencing the existing portfolio renders.

The four guided views support the existing research and physical prototype story. Layer offsets explain assembly relationships; they do not simulate a mechanical disassembly sequence. No electronic detection or medical validation is represented.

## Structural reference update

`public/sangre/structure-reference.jpg` is the unmodified user-supplied `10.jpg`. The structure chapter lifts the complete transparent enclosure and removes the display/storage lid, following that reference. `structure-details.ts` supplies illustrative boards, a copper coil, a sensing enclosure, and the base plate/fixing posts absent from the GLB. These are reference-derived presentation geometry, not validated electronics or manufacturing CAD. The original render is available alongside the 3D view for comparison.
