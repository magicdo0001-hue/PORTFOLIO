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
});
