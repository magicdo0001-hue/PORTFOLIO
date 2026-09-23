# BAMBINO workbench assets

`material-study.blend` contains the user's V2 geometry and the accepted material study. `scripts/build-bambino-assets.py` exports only product meshes, creates the two illustrative models, and writes GLBs under `public/bambino/`.

Rebuild from the repository root:

```powershell
& 'F:\TOOL 2\blender.exe' --background --factory-startup --python-exit-code 1 --python scripts/build-bambino-assets.py
```

- `bambino-v2.glb`: user-supplied final design, exported with separate component groups. Rear tank is clear plastic (transmission 1, IOR 1.49). The browser adds brushed-metal roughness and selectable finishes.
- `bambino-original-reference.glb`: newly authored approximate exterior for explaining the original product's interaction. This is explicitly labeled a form reference, not Breville CAD.
- `portafilter-reference.glb`: newly authored nominal 54 mm basket and handle. Motion illustrates visible hand interaction; it does not validate OEM dimensions, internal mechanisms, forces or locking angle.
- `original-reference.webp`: resized official Breville Bambino BES450 product image. Source: https://www.breville.com/en-au/product/bes450 ; image: https://breville-production-aem-assets.s3.us-west-2.amazonaws.com/BES450/BES450ANZ_CAROUSEL1.png . Displayed with attribution/link in the problem chapter.
- Prototype photographs already present under `public/portfolio/` document the physical iterations. The sequence crossfades photographs before returning to the actual V2 model; it does not claim reconstructed prototype geometry.
- The user's private reference video and its extracted frames are not distributed with this project.

The workbench is shared by Chinese and English routes. Three.js loads only after the detail page mounts. Reading mode and the fallback image keep case-study content available without WebGL. Exploded displacements show groups, not a prescribed assembly order.
