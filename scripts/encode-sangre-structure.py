"""Encode the completed SANGRE Cycles sequence for browser playback."""
import argparse,json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--ffmpeg',default='ffmpeg');p.add_argument('--input',type=Path,default=ROOT/'tmp/sangre-film-final');a=p.parse_args();out=ROOT/'public/sangre/film';out.mkdir(parents=True,exist_ok=True)
meta=json.loads((a.input/'metadata.json').read_text())
for frame in range(1,meta['frames']+1):
 if not (a.input/f'frame-{frame:04d}.png').is_file():raise SystemExit(f'Missing frame {frame}; finish rendering first.')
def run(*args):subprocess.run([a.ffmpeg,'-hide_banner','-loglevel','error','-y',*map(str,args)],check=True)
for width,crf in [(1440,18),(960,20)]:
 target=out/f'structure-{width}.mp4'
 run('-framerate',meta['fps'],'-i',a.input/'frame-%04d.png','-frames:v',meta['frames'],'-vf',f'scale={width}:-2:flags=lanczos','-c:v','libx264','-preset','slow','-crf',crf,'-pix_fmt','yuv420p','-g',12,'-keyint_min',12,'-sc_threshold',0,'-bf',0,'-movflags','+faststart','-an',target)
 if target.stat().st_size>=25*1024*1024:raise SystemExit(f'{target.name} exceeds asset limit')
run('-i',a.input/'frame-0001.png','-c:v','libwebp','-quality',90,out/'poster.webp')
run('-i',a.input/'frame-0001.png','-i',a.input/'frame-0091.png','-i',a.input/'frame-0137.png','-i',a.input/'frame-0240.png','-filter_complex','[0:v]scale=640:480[a];[1:v]scale=640:480[b];[2:v]scale=640:480[c];[3:v]scale=640:480[d];[a][b][c][d]xstack=inputs=4:layout=0_0|640_0|0_480|640_480','-frames:v',1,'-c:v','libwebp','-quality',88,out/'keyframes.webp')
meta['variants']=[{'width':w,'height':w*3//4,'bytes':(out/f'structure-{w}.mp4').stat().st_size} for w in [1440,960]];meta['keyframe_interval']=.5
(out/'metadata.json').write_text(json.dumps(meta,indent=2)+'\n',encoding='utf-8');print(json.dumps(meta,indent=2))
