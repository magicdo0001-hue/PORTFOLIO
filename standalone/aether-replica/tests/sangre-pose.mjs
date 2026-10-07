import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { poseAt } from '../src/sangre.js';
import { quadMatrix } from '../src/screen-projection.js';

const metadata=JSON.parse(readFileSync(new URL('../public/assets/sangre/metadata.json',import.meta.url)));
assert(metadata.screenFront[1]>.6&&metadata.screenFront[2]<-.6,'UI must face the front/up, as in the engineering Front view');
assert(metadata.screenCenter[2]<-.015,'UI belongs on the front slope, not the rear slope');
assert(metadata.screenWidth>.075&&metadata.screenWidth<.08,'Use the 77.5 mm front panel, not the 88.5 mm rear panel');
assert(metadata.travel[2]<-.99,'Cartridge must start outside the front (-Z) and slide inward');
assert(metadata.stripEndOffset>0&&metadata.stripEndOffset<.02,'Keep the red end exposed at the front lip');
for(const p of [0,.125,.375]){
  const [yaw,pitch]=poseAt(p).camera;
  const view=[Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)];
  assert(view.reduce((dot,v,i)=>dot+v*metadata.screenFront[i],0)>.4,'Presentation camera must see the front display');
}

assert.equal(poseAt(0).unfold,0);
assert.equal(poseAt(.125).unfold,1);
assert.equal(poseAt(.05).unfold,0,'Close-up begins with the compact screen');
assert.equal(poseAt(.125).closeup,1);
assert.equal(poseAt(.375).closeup,0);
assert.equal(poseAt(.375).unfold,0);
assert.equal(poseAt(.81).explode,1);
assert.equal(poseAt(1).explode,0);
assert.equal(poseAt(.5).stripVisible,true);
assert.equal(poseAt(.7).stripVisible,false);
assert.equal(poseAt(.64).inserted,1);
assert.deepEqual(poseAt(0).camera,poseAt(1).camera);
for(let p=-.1;p<=1.1;p+=.001){
  const pose=poseAt(p);
  assert(pose.camera.every(Number.isFinite));
  for(const key of ['unfold','closeup','explode','inserted'])assert(pose[key]>=0&&pose[key]<=1);
}
for(const quad of [[[20,30],[620,30],[620,1030],[20,1030]],[[55,32],[580,75],[645,1000],[12,865]]]){
  const matrix=quadMatrix(quad,600,1000);
  for(const [i,[x,y]]of [[0,[0,0]],[1,[600,0]],[2,[600,1000]],[3,[0,1000]]]){
    const w=matrix[3]*x+matrix[7]*y+1;
    assert(Math.abs((matrix[0]*x+matrix[4]*y+matrix[12])/w-quad[i][0])<1e-6);
    assert(Math.abs((matrix[1]*x+matrix[5]*y+matrix[13])/w-quad[i][1])<1e-6);
  }
}
console.log('PASS: CAD front / screen close-up / unfold / CSS perspective mapping / cartridge / exploded / loop');
