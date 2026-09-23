# Archive → project transition

The embedded archive now owns a reversible transition into the real project page. The original archive iframe stays mounted, so closing restores the same selected record without replaying startup.

- The selected cassette uses the existing `archive-assembly.glb`; its two fasteners rotate around their own shafts, rise clear of their seats, then fly vertically offscreen. The transparent cover lifts off and follows upward. The material-batched fastener triangles are split only in the temporary runtime assembly. No new asset or change to extraction/array geometry is introduced.
- Before opening, the camera and dragged cassette settle into the detail pose while the page and assembly load concurrently.
- Opening: 2200 ms. Fasteners unscrew for about 400 ms and fly out by 825 ms, with a 55 ms stagger. The cover then lifts and exits by 1386 ms; the live page appears and expands over the remaining 814 ms from the projected card interior to the viewport. A restrained green edge disappears at full size.
- Closing: 1800 ms, proportional to the current opening progress when interrupted. The live page compresses back into the card, the cover returns, then the fasteners descend and tighten, and the archive returns to its existing overview motion.
- Parent URL stores the overlay as `#project=%2Fwork%2Fbambino` (or the English route). This preserves the archive route's mounted scene through framework history updates. The hash supports reload/share, Back and Forward. Direct `/work/...` URLs still open normally.
- Project Return/Home links and Escape close the layer. Other project/language links retain ordinary full-page navigation.
- Only same-origin messages from the known archive iframe and the five existing project routes are accepted.
- Background content is inert while open; focus returns to the archive. The hidden archive renderer pauses while the detail page is full screen. Closing disposes the temporary assembly and removes the project iframe.
- Reduced motion skips the spatial animation. During loading, cancellation is available; late model results are disposed after cancellation. A load failure falls back to the normal project URL.

## Verification

Chrome / Playwright on Windows, 1440 × 960 and 390 × 844:

1. Select BAMBINO and open the archive detail. Click PROJECT DETAILS: inspect independent screw rotation, upward fastener flight, upward cover removal and the subsequent page expansion.
2. Use the model and switch to Structure inside the expanded page. Return: the current page shrinks into the same card; selection survives.
3. Repeat with browser Back, Forward and Escape. No background remount or startup replay.
4. Load the English shared hash directly with reduced motion. Check full-screen mobile sizing and return to the English archive.
5. Abort the project request, cancel while preparing, then reopen. Also press Escape during expansion. No orphaned model, blocked background, or stale animation.
6. Open SANGRE and use its Home link: the same closing mechanism applies.

TypeScript checks for both applications, targeted ESLint, production build, and the four existing rendered-page/asset regression checks pass. Existing large-bundle build warnings remain unchanged.
