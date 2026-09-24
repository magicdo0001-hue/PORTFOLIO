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

## Chapter 04 pre-rendered locking study

`render-bambino-locking.py` opens the material study without overwriting it. It adds an illustrative portafilter and a translucent right hand, poses the thumb against the fixed support, and renders a locked camera at 1600 x 1200, 30 fps, for 10 seconds. The grip/contact/turn are fitted to the user's private operation video and prototype photographs; they do not assert measured locking angles or internal mechanical tolerances.

```powershell
& 'F:\TOOL 2\blender.exe' -b --factory-startup --python-exit-code 1 --python scripts/render-bambino-locking.py -- --output 'E:\Codex File\OWN WEB\tmp\bambino-locking-final'
python scripts/encode-bambino-locking.py --ffmpeg 'F:\TOOL 2\bin\ffmpeg.exe'
```

Requires Blender with Cycles/OptiX and FFmpeg with libx264/libwebp. `--preview` renders three smaller keyframes; `--frames 1,145,300` renders selected full-quality frames. PNG masters and the generated scene stay in ignored `tmp/`. The encoder rejects missing frames and assets over the hosting size limit, outputs desktop/mobile H.264 with a keyframe every 0.5 seconds, no B frames, and faststart, plus a poster and a static fallback sheet. Recalibrate the HTML hotspot from `metadata.json` if the camera changes.

Hand source: [WebXR Input Profiles generic right hand](https://github.com/immersive-web/webxr-input-profiles/tree/main/packages/assets/profiles/generic-hand), downloaded 2026-09-24. The original asset is stored as `hand/right.glb`; MIT terms are retained in `hand/LICENSE.md` and published alongside the derived video as `public/bambino/locking/NOTICE.txt`. No hand textures or private reference footage are published.

The video loads on chapter 04 or in reading mode. Manual playback respects reduced-motion users; scrubbing pauses, stage controls seek, and playback continues from the selected position. Leaving the viewport/tab pauses playback. Leaving the chapter releases the video; entering chapter 04 or reading mode disposes the realtime workbench.

The player probes a one-byte HTTP Range before attaching the source. A 206 response retains progressive playback. If an asset server ignores Range, the full 200 response is reused as a seekable Blob (one download), with an AbortController and object-URL cleanup on exit. This also supports the local Cloudflare preview.
