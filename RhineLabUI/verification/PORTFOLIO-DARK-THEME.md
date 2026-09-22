# Portfolio dark-green theme — 2026-09-22

用户已明确授权修改原始源码以应用暗绿主题，并要求告知改动。

## 视觉与材质

- 背景与场景雾：#0d110e；强调色：#9bdd2a。
- 盖板使用带绿调的物理透射材质；保留 transmission、折射率及磨砂/清晰切换管线。
- 深色底板、绿色内部嵌件、灰白标签；中性环境光保留玻璃边缘与厚度。
- 高/低精度材质在注册前统一着色，让阵列、抽取过渡及独立查看器配色一致。

## 修改的原始文件

| 文件 | 改动 |
| --- | --- |
| src/scene.ts | 场景背景、地面、材质主题接入、标签颜色与玻璃底色渐变 |
| src/appearance.ts | 材质过渡中的暖色渐变改为绿色；透射及解密逻辑不变 |
| src/archive-lighting.ts | 暖光调整为中性光与暗绿环境补光 |
| src/model-viewer.ts | 查看器背景与场景雾 |
| src/brand.ts | 标签标志颜色，路径及内容不变 |
| src/main.ts | 开场 SVG 的描边及填充色 |
| src/style.css | 暗色界面、场景遮罩、文字、按钮及状态样式 |
| src/quality-settings.css | 画质控件颜色 |
| src/decryption.css | 解密标记与玻璃模式按钮颜色 |
| src/document-decryption.css | 正文揭示遮罩颜色 |
| index.html | 浏览器主题色 |

新增 src/portfolio-theme.ts，集中管理模型配色。
外层 app/rhine-lab-experience.css 同步暗绿配色；构建日志及 README 同步更新说明。

## 验证

- 子项目 TypeScript 检查、独立 Vite 构建、作品集生产构建通过。
- 作品集现有回归测试 2/2 通过；透明解密及装配验证脚本通过。
- Chrome 1600×1000：选档、详情、设置、清晰/磨砂切换、拆解、重组、返回和继续浏览均通过；未发现 JavaScript 运行异常。
- 手机保持原版横向画布。英文主页存在原页面导航/内容轻微横向超出，本次配色调整未修改相关布局。
- 与本次开始前 SHA-256 快照比较，public、content、art 中模型/素材/档案数据均未变化。

本次修改前的原始文件副本保存在项目 tmp/rhine-dark-backup 中，可用于对照及恢复。
