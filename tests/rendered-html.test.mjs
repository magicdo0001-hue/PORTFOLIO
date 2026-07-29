import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the portfolio index and three distinct case studies", async () => {
  const response = await render();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.match(html, /严文厚 Wenhou Yan/);
  assert.match(html, /Research into/);
  assert.match(html, /把复杂问题推进到/);
  assert.match(html, /SANGRE/);
  assert.match(html, /BAMBINO V2/);
  assert.match(html, /SIMPLE UNI LIFE/);
  assert.match(html, /wyan39702@gmail\.com/);
  assert.match(html, /下载PDF作品集/);
  assert.match(html, /\/wenhou-yan-portfolio-cn\.pdf/);
  assert.ok(
    html.indexOf("关于") < html.indexOf("项目") &&
      html.indexOf("项目") < html.indexOf("下载简历"),
    "navigation follows 关于 → 项目 → 下载简历",
  );
  assert.ok(
    html.indexOf("PROFILE / 2026") < html.indexOf("可旋转项目球面"),
    "profile content appears before the embedded project index",
  );
  assert.doesNotMatch(html, /PROJECT INDEX \/ 03 CASES/);

  const workResponse = await render("/work");
  assert.equal(workResponse.status, 200);
  const workHtml = await workResponse.text();
  assert.match(workHtml, /可旋转项目球面/);
  assert.match(workHtml, /SANGRE/);
  assert.match(workHtml, /BAMBINO V2/);
  assert.match(workHtml, /SIMPLE UNI LIFE/);
  assert.match(workHtml, /OPEN/);
  assert.match(workHtml, /PROJECT/);
  assert.match(workHtml, /\/work\/sangre/);
  assert.match(workHtml, /\/work\/bambino/);
  assert.match(workHtml, /\/work\/simple-uni-life/);

  const sphereSource = await readFile(
    new URL("../app/work/sphere-project-menu.tsx", import.meta.url),
    "utf8",
  );
  const globalStyles = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  assert.match(sphereSource, /snapNode\.current = frontNode/);
  assert.match(sphereSource, /--focus-scale/);
  assert.match(sphereSource, /\/portfolio\/sangre-sphere\.jpg/);
  assert.match(sphereSource, /imageIndex: ringIndex/);
  assert.match(sphereSource, /project\.images\[node\.imageIndex\]/);
  assert.match(globalStyles, /\.site-nav[\s\S]*backdrop-filter: blur\(28px\)/);
  assert.match(globalStyles, /\.site-nav__glass[\s\S]*border-radius: 999px/);
  assert.match(globalStyles, /\.site-nav__glass:active/);
  assert.match(
    globalStyles,
    /\.work-index__hero\s*{[\s\S]*?color: var\(--white\);/,
  );

  const cases = [
    [
      "/work/sangre",
      /慢性病管理需要的/,
      ["FORM STUDIES", "VOLUME ITERATION", "VACUUM FORMING", "INTERACTION TEST"],
    ],
    ["/work/bambino", /不该在锁定手柄时/, ["LOCKING MECHANISM"]],
    [
      "/work/simple-uni-life",
      /高风险的小决策/,
      ["RESEARCH CONTEXT", "COURSE SEARCH", "STRUCTURED RESULTS", "COURSE DECISION PAGE", "USER DASHBOARD"],
    ],
  ];

  for (const [path, expected, pendingAssets] of cases) {
    const caseResponse = await render(path);
    assert.equal(caseResponse.status, 200);
    const caseHtml = await caseResponse.text();
    assert.match(caseHtml, expected);
    for (const label of pendingAssets) assert.match(caseHtml, new RegExp(label));
  }

  const sources = await Promise.all(
    [
      "../app/page.tsx",
      "../app/home-project-wheel.tsx",
      "../app/work/sphere-project-menu.tsx",
      "../app/work/sangre/page.tsx",
      "../app/work/bambino/page.tsx",
      "../app/work/simple-uni-life/page.tsx",
    ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
  );
  const assets = sources.flatMap((source) =>
    [...source.matchAll(/["'](\/portfolio\/[^"']+)["']/g)].map(
      ([, path]) => path,
    ),
  );

  assert.ok(assets.length > 0);
  await Promise.all(
    assets.map((path) =>
      access(new URL(`../public${path}`, import.meta.url)),
    ),
  );
  await access(new URL("../public/wenhou-yan-resume.pdf", import.meta.url));
  await access(
    new URL("../public/wenhou-yan-portfolio-cn.pdf", import.meta.url),
  );
});
