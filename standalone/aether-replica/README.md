# SANGRE × Aether 展示原型

本地预览：[打开页面](http://localhost:4190/)。主页现已替换为 SANGRE；Discover Space、`/specs`、`/preorder` 及其原始产品内容保留。

主页包括机身展示、屏幕展开、材质细节、插条剖视和内部爆炸五个章节。继续使用原字体、深蓝背景、菜单、声音与滚动循环；没有新增依赖。

## 运行和检查

依赖已安装，Node.js 20+。本机可用 `./start-preview.ps1` 启动。

```powershell
npm run dev
npm run build
npm test
node tests/sangre-pose.mjs
npm run test:sites
```

`npm test` 要求 4190 预览运行，并安装 Chrome；覆盖桌面／手机的章节导航、声音、保留页面和循环。`QA_DIR` 可指定截图输出目录。当前验收和证据见 `design-qa.md` 与 `REPORT.md`。

## SANGRE 资产

- `public/assets/sangre/`：从用户 KeyShot 场景筛出的机身、试纸条、CAD 内部组件与参考屏幕图。
- `scripts/prepare-sangre.py`：用 Blender 从用户提供的原始 GLB 重建展示资产；源文件不改动。
- `src/sangre.js`：复用原 Three.js 渲染器，添加独立产品镜头、预设姿态、屏幕折叠和插条节奏。
- `src/sangre.css`：主页标注、手机适配和错误重试提示。

插条章节以剖视显示路径，暂时隐藏透明罩；没有编造罩盖开启机构。屏幕展开是依据两个外观端点制作的展示动画，不代表精确铰链运动；屏幕数值是 UI 示意。

## 原站资源

Aether 的原始资产依据用户在会话中确认的作者授权保存；作者为 OFF+BRAND，保留署名及链接。资源公开可访问不等于开源许可。`references/runtime-sources.json` 是供阅读的源码映射内容，不能作为完整上游工程。

原站私有 AI 后端未包含。SANGRE 主页隐藏原 Ask Aether 入口；保留页面沿用原界面，未包含的接口仍返回明确的 503。

生产输出为 `dist/client`；三个页面路径由现有 Vite 配置映射。Sites 包装、worker 和对应测试保持原样。本项目仍以独立本地原型预览，未将它接入个人主页。
