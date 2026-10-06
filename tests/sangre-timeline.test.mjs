import assert from "node:assert/strict";
import test from "node:test";
import { storyAt, chapterStops } from "../app/work/sangre/story-timeline.mjs";

test("SANGRE scroll stays bounded, reversible and holds each reading pose", () => {
  for (const p of [NaN, Infinity, -1]) assert.deepEqual(storyAt(p), { chapter: 0, time: 0 });
  assert.deepEqual(storyAt(2), { chapter: 3, time: 10 });
  let previous = 0;
  for (let step = 0; step <= 1000; step++) {
    const { time, chapter } = storyAt(step / 1000);
    assert.ok(time >= previous && time <= 10); assert.ok(chapter >= 0 && chapter <= 3); previous = time;
  }
  assert.deepEqual(chapterStops.map(p => storyAt(p).chapter), [0, 1, 2, 3]);
  for (const [a, b, time] of [[.28, .37, 3.75], [.57, .65, 5.75], [.91, 1, 10]]) {
    assert.equal(storyAt(a).time, time); assert.equal(storyAt(b).time, time);
  }
});
