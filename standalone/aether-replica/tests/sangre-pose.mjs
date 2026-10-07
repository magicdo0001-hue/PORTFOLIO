import assert from 'node:assert/strict';
import { poseAt } from '../src/sangre.js';

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
console.log('PASS: folded / expanded / cartridge / exploded / loop poses');
