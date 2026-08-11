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
  assert.match(html, /严文厚/);
  assert.match(html, /把研究推进为/);
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
    html.indexOf("关于我 / 2026") < html.indexOf("可旋转项目球面"),
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
  assert.match(workHtml, /查看/);
  assert.match(workHtml, /项目/);
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
  assert.match(sphereSource, /\/portfolio\/sangre-menu-01\.jpg/);
  assert.match(sphereSource, /imageIndex: ringIndex/);
  assert.match(sphereSource, /project\.images\[node\.imageIndex\]/);
  const menuAssets = [
    "sangre-menu-01.jpg",
    "sangre-menu-02.jpg",
    "sangre-menu-03.png",
    "sangre-menu-04.jpg",
    "bambino-menu-01.jpg",
    "bambino-menu-02.jpg",
    "bambino-menu-03.jpg",
    "bambino-menu-04.jpg",
    "unilife-menu-01.png",
    "unilife-menu-02.png",
    "unilife-menu-03.png",
    "unilife-menu-04.png",
  ];
  for (const asset of menuAssets) {
    assert.match(sphereSource, new RegExp(asset.replace(".", "\\.")));
    await access(new URL(`../public/portfolio/${asset}`, import.meta.url));
  }
  assert.match(
    globalStyles,
    /\.glass-surface--svg[\s\S]*backdrop-filter: var\(--filter-id\) saturate\(var\(--glass-saturation, 1\)\)/,
  );
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
      [
        "sangre-form-studies.png",
        "sangre-volume-iteration.jpg",
        "sangre-vacuum-forming.jpg",
        "sangre-interaction-test.jpg",
      ],
    ],
    ["/work/bambino", /不该在锁定手柄时/, ["bambino-layer-04.jpg"]],
    [
      "/work/simple-uni-life",
      /高风险的小决策/,
      [
        "unilife-friction-search.png",
        "unilife-friction-paths.png",
        "unilife-friction-social.png",
        "unilife-friction-reviews.png",
        "unilife-product-story.mp4",
        "unilife-video-poster.png",
        "unilife-course-search.png",
        "unilife-structured-results.png",
        "unilife-layer-04.png",
        "unilife-course-structure.png",
      ],
    ],
    [
      "/work/battery-packaging",
      /ENERGIZER PACKAGING/,
      [
        "battery-museum-02.jpeg",
        "battery-museum-01.jpeg",
        "battery-museum-04.jpeg",
      ],
    ],
    [
      "/work/vertical-car-park",
      /ARTI64/,
      [
        "arti64-collection.jpg",
        "arti64-printing.jpg",
        "arti64-market-table.jpg",
      ],
    ],
  ];

  const localizedPages = [html, workHtml];

  for (const [path, expected, expectedAssets] of cases) {
    const caseResponse = await render(path);
    assert.equal(caseResponse.status, 200);
    const caseHtml = await caseResponse.text();
    localizedPages.push(caseHtml);
    assert.match(caseHtml, expected);
    assert.doesNotMatch(caseHtml, /IMAGE PENDING/);
    for (const asset of expectedAssets) assert.match(caseHtml, new RegExp(asset));
  }

  const obsoleteEnglishCopy = [
    "Research into",
    "VIEW SELECTED WORK",
    "PROFILE / 2026",
    "SELECTED CASE STUDY",
    "EXPLORE",
    "NEXT CASE",
    "AVAILABLE FOR PRODUCT DESIGN OPPORTUNITIES",
    "BACK HOME",
    "DRAG TO ROTATE",
    "THE BRIEF",
    "DISCOVERY",
    "ENGINEERING PROOF",
    "THE TENSION",
    "USER MOTION",
    "MECHANISM",
    "RESOLUTION",
    "THE CONTEXT",
    "PRODUCT LOGIC",
    "INTERFACE SYSTEM",
    "OUTCOME",
  ];
  for (const pageHtml of localizedPages) {
    for (const phrase of obsoleteEnglishCopy) {
      assert.doesNotMatch(pageHtml, new RegExp(phrase));
    }
  }

  const uniLifeSource = await readFile(
    new URL("../app/work/simple-uni-life/page.tsx", import.meta.url),
    "utf8",
  );
  const uniLifeMedia = [
    ...uniLifeSource.matchAll(/["'](\/portfolio\/[^"']+)["']/g),
  ].map(([, path]) => path);
  assert.equal(
    new Set(uniLifeMedia).size,
    uniLifeMedia.length,
    "UniLife page does not repeat media files",
  );
  assert.match(uniLifeSource, /autoPlay[\s\S]*muted[\s\S]*loop[\s\S]*playsInline/);

  const sources = await Promise.all(
    [
      "../app/page.tsx",
      "../app/home-project-wheel.tsx",
      "../app/work/sphere-project-menu.tsx",
      "../app/work/sangre/page.tsx",
      "../app/work/bambino/page.tsx",
      "../app/work/simple-uni-life/page.tsx",
      "../app/work/battery-packaging/page.tsx",
      "../app/work/vertical-car-park/page.tsx",
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

test("integrates the Infinite Menu museum into the work page", async () => {
  const response = await render("/work");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /id="museum"/);
  assert.match(html, /work-museum__transition/);
  assert.match(html, /work-museum__stage/);
  assert.match(html, /sangre-menu-01\.jpg/);
  assert.match(html, /bambino-menu-03\.jpg/);
  assert.match(html, /unilife-menu-01\.png/);
  assert.match(html, /battery-museum-01\.jpeg/);
  assert.match(html, /arti64-display-wall\.jpg/);
  assert.match(html, /\/work\/battery-packaging/);
  assert.match(html, /\/work\/vertical-car-park/);
  assert.equal(
    (html.match(/class="site-nav shell"/g) ?? []).length,
    1,
    "the combined page renders one global navigation",
  );
  assert.equal(
    (html.match(/class="site-footer"/g) ?? []).length,
    0,
    "the combined page does not repeat the profile contact footer",
  );

  const legacyResponse = await render("/infinite-menu-lab");
  assert.ok(
    [307, 308].includes(legacyResponse.status),
    "the old museum route redirects to the integrated chapter",
  );
  assert.match(legacyResponse.headers.get("location") ?? "", /\/work#museum$/);

  const componentSource = await readFile(
    new URL("../app/infinite-menu-lab/InfiniteMenu.jsx", import.meta.url),
    "utf8",
  );
  const componentStyles = await readFile(
    new URL("../app/infinite-menu-lab/InfiniteMenu.css", import.meta.url),
    "utf8",
  );

  assert.match(componentSource, /from 'gl-matrix'/);
  assert.match(componentSource, /class ArcballControl/);
  assert.match(componentSource, /class InfiniteGridMenu/);
  assert.match(componentSource, /#version 300 es/);
  assert.match(componentSource, /window\.location\.assign\(activeItem\.link\)/);
  assert.match(componentSource, /Math\.min\(img\.naturalWidth, img\.naturalHeight\)/);
  assert.match(componentSource, /768/);
  assert.match(componentSource, /className={`project-copy/);
  assert.match(componentSource, /face-meta/);
  assert.match(componentSource, /project-pagination/);
  assert.match(componentSource, /activeItem\.index/);
  assert.match(componentSource, /focusItem\(itemIndex\)/);
  assert.match(componentSource, /focusTo\(targetOrientation\)/);
  assert.match(componentSource, /handleProjectNumberClick/);
  assert.match(componentSource, /item\.isProjectCover/);
  assert.match(componentSource, /touchAction = 'pan-y'/);
  assert.match(componentSource, /查看/);
  assert.match(componentStyles, /#infinite-grid-menu-canvas/);
  assert.match(componentStyles, /\.action-button\.active/);
  assert.match(componentStyles, /var\(--acid, #a4ff00\)/);
  assert.match(componentStyles, /\.project-copy::before/);
  assert.match(componentStyles, /\.project-pagination__item\.active/);
  assert.match(componentStyles, /\.action-button::before/);
  assert.match(componentStyles, /action-button-enter/);
  assert.match(componentStyles, /\.action-button\.active:hover/);
  assert.match(componentStyles, /@media \(max-width: 1100px\)/);

  const globalStyles = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  assert.match(globalStyles, /\.work-museum__transition/);
  assert.match(globalStyles, /\.work-museum__stage/);
  assert.match(
    globalStyles,
    /\.work-museum__stage\s*{[\s\S]*?scroll-snap-align: start;/,
  );
  assert.match(
    globalStyles,
    /\.sphere-project-menu__viewport\s*{[\s\S]*?touch-action: pan-y;/,
  );
});
