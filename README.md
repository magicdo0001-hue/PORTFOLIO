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
