export type Locale = "zh" | "en";
export const chapters = [
  { id: "overview", zh: "项目概览", en: "Overview", label: "THE OBJECT" },
  { id: "problem", zh: "原有问题", en: "The problem", label: "THE FRICTION" },
  { id: "iterations", zh: "演进与验证", en: "Iterations", label: "THE PROCESS" },
  { id: "locking", zh: "锁定细节", en: "The interaction", label: "THE INTERACTION" },
  { id: "structure", zh: "结构拆解", en: "The structure", label: "THE ASSEMBLY" },
] as const;
export const iterations = [
  { zh: "蓝色泡沫", en: "Blue foam", image: "/portfolio/bambino-interaction.webp", zhTitle: "先让动作有一个尺度。", enTitle: "Give the action a physical scale.", zhBody: "用低成本粗模观察手部路径、操作高度与触达位置。先确定人与机器的关系，再推进外形。", enBody: "A low-cost volume model explores hand paths, operating height and reach before the form is resolved.", zhFinding: "检查重点：操作高度、触达与视角", enFinding: "Focus: height, reach and viewing angle" },
  { zh: "纸板与混合原型", en: "Cardboard assembly", image: "/portfolio/bambino-prototype.jpg", zhTitle: "把轮廓变成可操作的体积。", enTitle: "Turn the silhouette into an object.", zhBody: "通过纸板与局部模型组合，检查完整机身比例、前面板倾角及操作空间。真实原型照片保留了这一阶段的制作痕迹。", enBody: "A mixed-material prototype brings the body proportions, panel angle and working space together at full scale.", zhFinding: "检查重点：整机比例、面板倾角与操作空间", enFinding: "Focus: proportions, panel angle and working space" },
  { zh: "打印件与动作验证", en: "Printed interaction", image: "/portfolio/bambino-build.webp", zhTitle: "让支点进入真实动作。", enTitle: "Put the support into the hand.", zhBody: "握住手柄时，大拇指接触冲煮头旁的突出结构。通过实体操作观察手柄转动与支点的配合。", enBody: "The thumb contacts the projecting support beside the group head while the hand turns the handle. Physical prototypes explore this relationship.", zhFinding: "检查重点：拇指接触位置与手柄转动", enFinding: "Focus: thumb contact and handle rotation" },
  { zh: "最终方案", en: "Final design", image: "/bambino/stainless-poster.webp", zhTitle: "把结构与表面收拢成一台机器。", enTitle: "Resolve structure and surface together.", zhBody: "最终模型整合机身、冲煮头与操作界面。拉丝不锈钢为主推方案，透明塑料水箱保留材质区分。", enBody: "The final model unifies body, group head and controls. Natural brushed stainless steel is paired with a clear plastic water tank.", zhFinding: "呈现重点：完整造型、材质与装配关系", enFinding: "Focus: final form, material and assembly" },
] as const;
export const finishes = [
  { id: "steel", zh: "拉丝不锈钢", en: "Brushed steel", swatch: "#b9bebc" },
  { id: "white", zh: "白色", en: "White", swatch: "#e7e8e4" },
  { id: "black", zh: "黑色", en: "Black", swatch: "#242628" },
  { id: "blue", zh: "深蓝色", en: "Deep blue", swatch: "#152654" },
] as const;
export type Finish = typeof finishes[number]["id"];
export const partLabels: Record<string, [string, string]> = {
  "左侧": ["机身外壳", "Body shell"], "顶部": ["顶部与操作面板", "Top and control panel"],
  "方水箱": ["透明水箱", "Clear water tank"], "后盖板": ["后部外壳与底座", "Rear enclosure and base"],
  "group head": ["冲煮头与拇指支点", "Group head and thumb support"], "污水池": ["滴水盘", "Drip tray"],
  "wand": ["蒸汽管", "Steam wand"], "main but": ["操作旋钮", "Control dial"],
  "水箱提杆": ["水箱提手", "Tank handle"], "PCB": ["控制板", "Control board"],
  "泵": ["泵体", "Pump"], "漂浮子": ["水位浮子", "Level float"], "底板": ["底板", "Base plate"],
  "加热块": ["加热块", "Heating block"], "电磁阀": ["电磁阀", "Solenoid valve"],
  "屏幕": ["显示屏", "Display"], "按钮": ["操作按钮", "Control button"],
};
