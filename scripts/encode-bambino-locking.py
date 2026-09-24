"""Encode the chapter 04 Cycles frames for browser playback and precise seeking.
Usage: python scripts/encode-bambino-locking.py --ffmpeg <ffmpeg executable>
"""
import argparse
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
p = argparse.ArgumentParser()
p.add_argument('--ffmpeg', default='ffmpeg')
p.add_argument('--input', type=Path, default=ROOT / 'tmp/bambino-locking-final')
a = p.parse_args()
output = ROOT / 'public/bambino/locking'
output.mkdir(parents=True, exist_ok=True)
for frame in range(1, 301):
    if not (a.input / f'frame-{frame:04d}.png').is_file():
        raise SystemExit(f'Missing frame {frame}; finish rendering before encoding.')

def run(*args):
    subprocess.run([a.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', *map(str, args)], check=True)

for width, crf in [(1600, 18), (960, 20)]:
    target = output / f'locking-{width}.mp4'
    run('-framerate', 30, '-i', a.input / 'frame-%04d.png', '-frames:v', 300,
        '-vf', f'scale={width}:-2:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow',
        '-crf', crf, '-pix_fmt', 'yuv420p', '-g', 15, '-keyint_min', 15,
        '-sc_threshold', 0, '-bf', 0, '-movflags', '+faststart', '-an', target)
    if target.stat().st_size >= 25 * 1024 * 1024:
        raise SystemExit(f'{target.name} exceeds the hosting asset limit.')
run('-i', a.input / 'frame-0001.png', '-c:v', 'libwebp', '-quality', 88, output / 'poster.webp')
run('-i', a.input / 'frame-0001.png', '-i', a.input / 'frame-0145.png',
    '-i', a.input / 'frame-0300.png', '-filter_complex',
    '[0:v]scale=640:480[a];[1:v]scale=640:480[b];[2:v]scale=640:480[c];[a][b][c]vstack=inputs=3',
    '-frames:v', 1, '-c:v', 'libwebp', '-quality', 88, output / 'keyframes.webp')
meta = json.loads((a.input / 'metadata.json').read_text(encoding='utf-8'))
meta['keyframe_interval'] = .5
meta['variants'] = [{'width': w, 'height': int(w * .75), 'bytes': (output / f'locking-{w}.mp4').stat().st_size} for w in [1600, 960]]
(output / 'metadata.json').write_text(json.dumps(meta, indent=2) + '\n', encoding='utf-8')
license_text = (ROOT / 'art/bambino/hand/LICENSE.md').read_text(encoding='utf-8')
(output / 'NOTICE.txt').write_text('Hand geometry adapted from immersive-web/webxr-input-profiles, generic-hand/right.glb.\nhttps://github.com/immersive-web/webxr-input-profiles/tree/main/packages/assets/profiles/generic-hand\n\n' + license_text, encoding='utf-8')
print(json.dumps(meta, indent=2))
