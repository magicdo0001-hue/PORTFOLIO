// Native scrolling controls camera and mechanical poses; no video or scroll lock.
export const chapterStops = [0, .25, .49, .70, .97];
// p, camera azimuth/elevation/radius, target x/y, unfold, access, explosion
const keys = [
  [0, -.60, .49, 6.55, 0, .52, 0, 0, 0],
  [.12, -.28, .43, 6.35, 0, .52, 0, 0, 0],
  [.23, .47, .60, 5.1, .55, .67, 0, 0, 0],
  [.30, .58, .57, 5.1, .55, .67, 0, 0, 0],
  [.38, -.14, .38, 6.60, -.12, .81, .12, 0, 0],
  [.48, -.21, .32, 7.00, -.15, .99, 1, 0, 0],
  [.54, -.14, .34, 7.00, -.15, .99, 1, 0, 0],
  [.60, .31, .57, 6.40, .24, .84, .50, .2, 0],
  [.69, .44, .60, 7.25, .26, 1.0, 0, 1, 0],
  [.75, .35, .57, 7.25, .26, 1.0, 0, 1, 0],
  [.83, -.32, .40, 7.80, 0, 1.21, 0, .9, .45],
  [.94, -.44, .37, 8.25, 0, 1.30, 0, .9, 1],
  [1, -.34, .39, 8.25, 0, 1.30, 0, .9, 1],
];
/** @param {number} progress */
export function storyAt(progress) {
  const p = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const chapter = p < .17 ? 0 : p < .34 ? 1 : p < .57 ? 2 : p < .79 ? 3 : 4;
  let i = keys.findIndex(k => k[0] >= p); if (i < 1) i = 1;
  const a=keys[i-1], b=keys[i], t=(p-a[0])/(b[0]-a[0]), blend=t*t*(3-2*t);
  const v=a.slice(1).map((value,index)=>value+(b[index+1]-value)*blend);
  return {chapter, yaw:v[0], elevation:v[1], distance:v[2], x:v[3], y:v[4], unfold:v[5], access:v[6], explode:v[7]};
}

const textBounds=[0,.17,.34,.57,.79,1.06];
const ease=(n)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
/** Scroll-reversible line masks and delayed annotations, sharing the camera clock.
 * @param {number} progress @param {number} index @param {number} intro */
export function textAt(progress,index,intro=1) {
  const p=Number.isFinite(progress)?Math.max(0,Math.min(1,progress)):0;
  const start=textBounds[index],end=textBounds[index+1];
  const local=p-start,leave=ease((p-(end-.028))/.028);
  const entry=index===0?intro:local/.045;
  return {line1:ease(entry/ .68),line2:ease((entry-.12)/.80),body:ease((entry-.35)/.65),note:ease((entry-.52)/.48)*(1-leave),leave,visible:p>=start&&p<=end};
}
