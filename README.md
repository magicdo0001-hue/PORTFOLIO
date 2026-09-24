# Wenhou Yan Portfolio

严文厚的产品设计作品集，使用 Next.js、React、Vinext 与 Cloudflare Workers 构建。

## 本地开发

需要 Node.js `>=22.13.0`。

```bash
npm ci
npm run dev
```

## 构建与测试

```bash
npm run build
npm test
```

## 独立公开部署

网站部署到 Cloudflare Workers，不依赖 OpenAI Sites、GPT 登录或
`chatgpt.site` 域名。

首次本地部署：

```bash
npx wrangler login
npm run deploy:cloudflare
```

生产环境由 `.github/workflows/deploy-cloudflare.yml` 自动发布。GitHub 仓库需要配置：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

合并到 `main` 后，GitHub Actions 会安装依赖、构建并发布到 Cloudflare
Workers 的公开 `workers.dev` 地址。

Cloudflare 配置位于 `wrangler.jsonc`。如果以后需要数据库，可在该文件中增加
名为 `DB` 的 D1 binding。

## Rhine Lab 原版体验

主页 / 及英文主页 /en 仅保留 RhineLab 交互体验，旧入口 /home-lab 永久跳转至 /。旧首页的轮播、个人介绍、能力卡片、联系方式和 PDF 下载菜单已移除；项目列表及五个独立项目详情继续保留。体验中的文字、档案、模型几何和交互沿用 RhineLabUI，配色已按用户授权调整为作品集暗绿主题。

- Windows 本地依赖安装完成后，可双击 start-preview.cmd 启动 http://localhost:4175，无需全局 npm。
- npm run dev 和 npm run build 会先执行 scripts/build-rhine-lab.mjs；首次使用 npm 执行且子项目依赖不存在时，会按子项目锁文件安装依赖。
- npm run build:rhine 可单独重新构建。RhineLabUI 源码后续若有更新，需重新执行该命令。
- 独立构建生成 public/rhine-lab，iframe 隔离其全局样式、事件和渲染环境；模型、音频、导出文档的 URL 仅在构建时加上子路径，原文件不改写。
- 父项目的 TypeScript 和 ESLint 已排除 RhineLabUI；子项目在构建时独立进行 TypeScript 检查。生成目录和嵌套 node_modules 不提交。
- 移动端保留原版横向画布，可使用“独立打开”横屏体验。
