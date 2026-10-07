# SANGRE 主页视觉验收

日期：2026-10-07。结果：本轮通过。评判技能：Design Taste Frontend。

| 检查项 | 首轮问题与修正 | 最终结果 |
| --- | --- | --- |
| 主视觉层次 | 产品镜头影响原背景；背景和产品采用各自镜头，在同一画布合成 | 设备清楚，原背景空间关系保留 |
| 屏幕 | 背板遮住 UI、展开轴与图像半幅顺序错误 | 折叠／展开可见，完整图像顺序正确 |
| 动作说明 | 原插条被透明罩遮挡 | 剖视显示真实几何路径，说明罩盖隐藏；灰色条体与样本标记 |
| 结构展示 | 视角与文字靠近组件 | 调整观察高度、组件间距、外围标注及说明宽度 |
| 字体与节奏 | 手机隐藏换行后词语相连 | 保留原字体，补充单词间隔，标题清楚 |
| 手机与窄屏 | 标注重叠，设备比例偏小 | 390／320 px 下显示完整，无横向溢出，单重点标注 |
| 动态与失败 | 新动画缺少关键帧模式与失败入口 | 减少动态效果时使用章节姿态；资产失败可重试 |
| 循环与保留内容 | 末尾缩放差；保护 Discover 内容 | 起止姿态相同；保留页面仍使用原模型 |

最终证据目录：`C:/Users/严/.codex/visualizations/2026/10/06/01a11086-2db3-7203-8735-754fb721f06b/sangre-qa/`。
生产截图为 `final-desktop-*`、`final-mobile-*`、`final-small-*`；原站复刻历史截图仍保留。视觉评判结合人工查看截图，不能用 DOM 断言代替模型质量判断。

边界：展开机构是展示插值；屏幕为设计示意；未验证实际手机硬件帧率。原背景仍保留自身粒子运动。模型材质采用实时网页 PBR，未宣称等同 KeyShot 离线渲染。

---

以下为替换前的历史验收。

# Aether 1 前端复刻视觉验收

final result: passed

验收日期：2026-10-06。验收范围：原站三个公开导航页面及当前可观察的前端交互状态。私有 AI 成功响应与实际移动设备帧率不在已通过范围内。

**Findings**

没有可操作的 P0／P1／P2 前端视觉或交互回归。模型、贴图、原字体、SVG、文案和作者运行时均保留；所有必要资源已经本地化。以下是明确的交付边界，不是已经完成的后端功能：

- 私有 AI 后端未包含。原站参考返回 502，本地接口明确返回 503，两者均进入原 `Error - Try Again` 界面。成功回答与其后续详情／历史状态未验证。
- 实时粒子、流体、浮动角度、音频波形受时刻和输入影响；并排截图中的帧差不作为静态布局差异。没有把 DOM 测量结果称为整个 WebGL 画面逐像素相等。

**Source and implementation evidence**

- 原站：`https://www.aether1.ai/`、`/specs`、`/preorder`。
- source visual truth path：`qa/reference/desktop-*.png`、`qa/reference/mobile-*.png`。
- implementation screenshot path：`qa/implementation/desktop-*.png`、`qa/implementation/mobile-*.png`。
- full-view comparison evidence：`qa/comparisons/desktop-overview-1.jpg` 至 `desktop-overview-4.jpg`；`mobile-overview-1.jpg` 至 `mobile-overview-7.jpg`。此外每一状态均保存单独并排对照图。
- focused region comparison evidence：`qa/comparisons/focus-desktop-home.jpg`、`focus-desktop-menu.jpg`、`focus-desktop-ask-open.jpg`、`focus-desktop-specs-top.jpg`、`focus-mobile-home.jpg`、`focus-mobile-ask-open.jpg`。
- 数值证据：`qa/comparison-metrics.json`。浏览器记录与断言：`qa/results.json`。
- viewport：桌面 CSS 1440 × 900；手机 CSS 390 × 844。
- source and implementation pixel dimensions：分别为 1440 × 900 和 390 × 844，双方 `deviceScaleFactor: 1`。无需密度归一；总览图缩放双方比例一致，局部图使用原尺寸裁切。
- state：主页、菜单、Sound、Craft、Controls、Power、内部视角、核心、声音开启、Ask 展开／错误、规格页顶部与各滚动段、Preorder／页脚、主页返回、循环返回。桌面 24 组，手机 21 组，共 45 对、90 张。

**Required fidelity surfaces**

| 表面 | 实际检查 | 结果 |
| --- | --- | --- |
| 字体与排版 | 原 Manrope／Azeret Mono 本地文件；字号、字重、行高、换行；标题与控件局部图 | 采样属性相同，局部对照一致 |
| 间距与布局 | 标题、导航、问答框、按钮、规格页段落；桌面／手机构图；高度与滚动位置 | 采样矩形及滚动位置最大差 0 px |
| 色彩与视觉样式 | 原 CSS、前景文字颜色、玻璃背景、蓝色网格与外壳 | 采样颜色相同，视觉样式一致 |
| 图像与资产质量 | 原 GLB、AO／法线／透明／发光贴图、matcap、光晕；原 SVG 标记；模型拆解和规格页材质 | 无占位或手绘近似替代，资产与主题一致 |
| 内容 | 五章标题、规格参数／价格、Preorder 虚构产品说明、全部页脚链接；控件文案 | 已采样文字相同，完整正文保留 |

**Comparison history**

1. 在完整采集后建立本地实现。首轮桌面首页并排比较检查标题、产品比例、导航、底部控件及原尺寸标题区域，没有发现可操作的 P0／P1／P2 差异。
2. 扩大到桌面和手机的全部 45 对状态，并保存全景与局部图，逐项检查上述五个保真表面。所有已采样字体、内容、颜色、尺寸和位置相同，没有需要改变视觉的发现。
3. 补充生产直接访问与触屏滑动证据。`qa/production-results.json`、`qa/comparisons/touch-swipe.jpg`、`qa/production-home.png`、`qa/production-specs.png`、`qa/production-preorder.png` 可重查；没有发现新增的视觉问题。

辅助修正：补拍仍在载入的原站截图，修正测试脚本含空格路径处理与手机标题换行假设；恢复原触控检测类；删除重复页面字符串打包。这些属于采集、实现和检查修正，没有被计为发现视觉缺陷后的迭代次数。

**Primary interactions and console checks**

- 菜单与章节跳转、声音启用和静音、问答展开／空输入／失败／重试、规格页与声明页转场、全部外部页脚链接地址、返回首页、末尾无限循环均检查。
- 本地桌面 15 项、手机 13 项断言通过；必要本地资产没有失败请求，外部运行资源请求为零。
- 浏览器未发现未预期的错误。提交问答时出现本地 503 和原运行时的 `Submission failed` 日志，属于已说明的后端边界。
- 生产 `/`、`/specs`、`/preorder` 均直接渲染成功。触屏样式类存在，滑动推进正常，390 px 视口无横向溢出。

**Open Questions**

需要作者后端才能验证原 AI 成功结果及其衍生界面；本次没有验证实际手机硬件性能。

**Implementation Checklist**

- [x] 三个公开页面与当前可观察状态
- [x] 必要模型、材质、字体、图标和声音本地化
- [x] 桌面与手机并排比较
- [x] 字体、布局、色彩、资产、内容五项检查
- [x] 交互与浏览器错误检查
- [x] 生产构建、直达路径、触屏检查
- [x] 可复跑检查、实现汇报与启动说明

**Follow-up Polish**

没有通过篡改动画参数去消除运行时帧差。若后续获得后端，可继续采集和验证 AI 成功状态；这是新增验证范围。
