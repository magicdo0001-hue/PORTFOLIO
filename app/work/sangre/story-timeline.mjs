// Pauses are part of the scroll distance, so visitors can read without a scroll lock.
export const chapterStops = [0, .33, .61, .96];
const keys = [[0, 0], [.13, 1.3], [.27, 3.75], [.38, 3.75], [.44, 4.4], [.56, 5.75], [.66, 5.75], [.75, 7], [.9, 10], [1, 10]];

/** @param {number} progress */
export function storyAt(progress) {
  const p = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const chapter = p < .15 ? 0 : p < .44 ? 1 : p < .75 ? 2 : 3;
  const end = keys.findIndex(([position]) => position >= p);
  if (end === 0) return { chapter, time: 0 };
  const [startP, startTime] = keys[end - 1];
  const [endP, endTime] = keys[end];
  return { chapter, time: startTime + (endTime - startTime) * (p - startP) / (endP - startP) };
}
