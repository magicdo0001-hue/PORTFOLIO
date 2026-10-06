import assert from "node:assert/strict";
import test from "node:test";
import { Box3, Vector3, Mesh } from "three";
import { storyAt, chapterStops, textAt } from "../app/work/sangre/story-timeline.mjs";
import { createSangreModel } from "../app/work/sangre/procedural-model.ts";

test("SANGRE camera and mechanical timeline is bounded, continuous and reversible", () => {
  for(const p of [NaN,Infinity,-1])assert.deepEqual(storyAt(p),storyAt(0));
  assert.deepEqual(storyAt(2),storyAt(1));
  assert.deepEqual(chapterStops.map(p=>storyAt(p).chapter),[0,1,2,3,4]);
  let previous=storyAt(0);
  for(let step=0;step<=1000;step++){
    const pose=storyAt(step/1000);
    for(const [key,value] of Object.entries(pose)){
      assert.ok(Number.isFinite(value));
      if(key!=="chapter")assert.ok(Math.abs(value-previous[key])<.2,`${key} jumps at ${step}`);
    }
    for(const key of ["unfold","access","explode"])assert.ok(pose[key]>=0&&pose[key]<=1);
    assert.deepEqual(storyAt(step/1000),pose);previous=pose;
  }
  assert.equal(storyAt(.49).unfold,1);assert.equal(storyAt(.70).access,1);assert.equal(storyAt(.97).explode,1);
});

test("procedural assembly preserves the drawing envelope and resets after disassembly",()=>{
  const model=createSangreModel();model.pose(0,0,0);model.root.updateMatrixWorld(true);
  const bounds=new Box3();model.root.traverseVisible(o=>{if(o instanceof Mesh){o.geometry.computeBoundingBox();bounds.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld));for(const v of o.geometry.getAttribute("position").array)assert.ok(Number.isFinite(v));}});
  const size=bounds.getSize(new Vector3());assert.ok(size.x>3.1&&size.x<3.25);assert.ok(size.z>1.95&&size.z<2.15);assert.ok(size.y>1.15&&size.y<1.30);
  for(const name of ["lower-shell","upper-shell","folding-display","clear-storage-cover","test-strip","copper-coil","18650-battery","optical-module"])assert.ok(model.root.getObjectByName(name));
  const snapshot=()=>{const result=[];model.root.traverse(o=>result.push([o.name,o.position.toArray(),o.rotation.toArray(),o.visible]));return result;};
  const closed=snapshot();
  for(let i=42;i<=100;i++){model.pose(0,i/100,0);model.root.updateMatrixWorld(true);const stripBounds=new Box3().setFromObject(model.strip);assert.ok(stripBounds.max.y<new Box3().setFromObject(model.lid).min.y,"strip must clear the lifted cover");if(i>=58)assert.ok(!stripBounds.intersectsBox(new Box3().setFromObject(model.root.getObjectByName("removable-storage-tray"))),"strip must clear the tray after lifting");}
  model.pose(1,1,1);assert.equal(model.materials.shellClear.transmission,1);assert.ok(model.shell.position.y>1);model.pose(0,0,0);assert.deepEqual(snapshot(),closed);
});

test("type masks leave before the next chapter and reveal in reading order",()=>{
  for(const [index,p] of chapterStops.entries()){
    const text=textAt(p,index);assert.ok(text.visible);assert.equal(text.line1,1);assert.equal(text.line2,1);assert.equal(text.note,1);
  }
  const entering=textAt(.185,1);assert.ok(entering.line1>entering.line2);assert.ok(entering.line2>entering.body);assert.ok(entering.body>=entering.note);
  assert.equal(textAt(.17,0).leave,1);assert.equal(textAt(.17,1).line1,0);
  assert.equal(textAt(0,0,0).line1,0);assert.equal(textAt(0,0,1).line2,1);
  assert.equal(textAt(.30,0).visible,false);
});
