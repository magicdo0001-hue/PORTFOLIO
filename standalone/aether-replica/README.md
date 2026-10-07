# SANGRE × Aether 展示原型

新版现已接入个人网站 `/work/sangre` 与 `/en/work/sangre`。Discover 入口切换到各语言原有的标准案例正文（`#story`），可返回产品展示。旧耳机规格、预购和私有 AI 页面已移除。

主页包括机身展示、屏幕展开、材质细节、插条剖视和内部爆炸五个章节。继续使用原字体、深蓝背景、菜单、声音与滚动循环；没有新增依赖。

## 运行和检查

依赖已安装，Node.js 20+。本机可用 `./start-preview.ps1` 启动。

```powershell
npm run dev
npm run build
npm test
node tests/sangre-pose.mjs
node scripts/verify-portfolio.mjs
npm run test:sites
```

`npm test` 要求 4190 预览运行，并安装 Chrome；覆盖桌面／手机的章节导航、声音、案例入口和循环。`QA_DIR` 可指定截图输出目录。当前验收和证据见 `design-qa.md` 与 `REPORT.md`。

## SANGRE 资产

- `public/assets/sangre/`：从用户 KeyShot 场景筛出的机身、试纸条、CAD 内部组件与参考屏幕图。
- `scripts/prepare-sangre.py`：用 Blender 从用户提供的原始 GLB 重建展示资产；源文件不改动。
- `src/sangre.js`：复用原 Three.js 渲染器，添加独立产品镜头、预设姿态、屏幕折叠和插条节奏。
- `src/sangre.css`：主页标注、手机适配和错误重试提示。

插条章节以剖视显示路径，暂时隐藏透明罩；没有编造罩盖开启机构。屏幕展开是依据两个外观端点制作的展示动画，不代表精确铰链运动；屏幕数值是 UI 示意。

## 原站资源

Aether 的原始资产依据用户在会话中确认的作者授权保存；作者为 OFF+BRAND，保留署名及链接。资源公开可访问不等于开源许可。`references/runtime-sources.json` 是供阅读的源码映射内容，不能作为完整上游工程。

原站私有 AI 后端未包含，入口及内容已移除。现有接口防护保留，但产品页不再调用。

独立生产输出为 `dist/client`，仅构建 SANGRE 展示文档；Sites 包装与 worker 检查保持。主站 `predev`／`prebuild` 使用根项目已安装的 Vite 与 React 插件，将展示生成到 `public/sangre-showcase/`，重定位运行时资源路径，无需在部署环境另装原型依赖。该目录为生成文件，不提交 Git。

本地 4190 原型的旧 Specs／Preorder 地址会转向 4175 主站的标准案例；主站的正式入口保持 `/work/sangre`。新版用独立 iframe 隔离原作者拥有 DOM 的动画运行时，校验同源消息后切换阅读模式、返回档案与响应 Escape。阅读模式暂停隐藏渲染器；直接访问 `#story` 时，原生 iframe 懒加载避免启动未显示的 3D 展示。主站服务端提前输出已有产品图，减少等待空白。

`verify-portfolio.mjs` 要求主站运行在 4175（可用 `LOCAL_URL` 覆盖），验证真实档案入口中的阅读往返、返回与 Escape，以及子 iframe 历史不会阻止关闭。所有验证脚本在失败或成功后均关闭其临时 Chrome。
