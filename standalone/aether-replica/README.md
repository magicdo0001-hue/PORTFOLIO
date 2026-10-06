# Aether 1 独立复刻

本地预览：http://localhost:4190/

三个页面：`/`、`/specs`、`/preorder`。原始视觉、模型、贴图、字体和声音保存在 `public/assets`，运行时无需请求原站资源。

本任务依据用户在会话中确认的作者授权完成。作者为 OFF+BRAND，页面保留原作者署名与链接。公开可访问的打包文件不等于开源许可。

## 运行

需要 Node.js 20+。依赖已在本机安装。

```powershell
npm install
npm run dev
```

在本机也可运行 `./start-preview.ps1`，脚本直接调用已安装的 Vite。

```powershell
npm run build
npm run preview
npm test
```

测试要求预览已在 4190 端口运行，并且本机安装 Google Chrome。`npm test` 检查桌面、手机布局、菜单、声音、问答失败与重试、页面转场、规格内容和循环返回。带原站参考采集的完整对照：

```powershell
node scripts/verify-browser.mjs --compare
```

## 文件

- `index.html`、`specs.html`、`preorder.html`：三个页面的实际标记及本地样式链接。
- `src/App.jsx`、`src/main.jsx`：一次性 React 挂载和作者运行时的启动。
- `public/assets/vendor/aether-runtime.js`：保留作者的前端动画逻辑，改为同源资源地址，移除内联源码映射以减少传输。
- `vite.config.mjs`：本地路径映射与未包含的私有 AI 接口响应。
- `asset-manifest.json`：来源 URL、获取结果和本地路径。
- `references/runtime-sources.json`：从原打包文件源码映射提取的作者模块，供阅读；不代表完整可重建的上游工程。
- `qa/`：原站、本地截图和浏览器检查证据。
- `design-qa.md`：视觉验收。
- `REPORT.md`：任务汇报。

原站私有 AI 服务没有包含在前端交付内。参考采集时原站该接口返回 502；本地明确返回 503，保留 Thinking → Error - Try Again → 重试的实际界面，不伪造生成式回答。

生产文件在 `dist/client`。Vite 生产预览支持上述三个路径；如以后使用其他静态服务器，需要把 `/specs` 与 `/preorder` 分别映射到对应 HTML。此次交付仅运行本地预览。
