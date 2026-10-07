import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { poseAt } from '../src/sangre.js';

const metadata=JSON.parse(readFileSync(new URL('../public/assets/sangre/metadata.json',import.meta.url)));
assert(metadata.screenFront[1]>.6&&metadata.screenFront[2]<-.6,'UI must face the front/up, as in the engineering Front view');
assert(metadata.screenCenter[2]<-.015,'UI belongs on the front slope, not the rear slope');
assert(metadata.screenWidth>.075&&metadata.screenWidth<.08,'Use the 77.5 mm front panel, not the 88.5 mm rear panel');
for(const p of [0,.125,.375]){
  const [yaw,pitch]=poseAt(p).camera;
  const view=[Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)];
  assert(view.reduce((dot,v,i)=>dot+v*metadata.screenFront[i],0)>.4,'Presentation camera must see the front display');
}

assert.equal(poseAt(0).unfold,0);
assert.equal(poseAt(.125).unfold,1);
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
  for(const key of ['unfold','explode','inserted'])assert(pose[key]>=0&&pose[key]<=1);
}
console.log('PASS: source front surface / front cameras / folded / expanded / cartridge / exploded / loop poses');
