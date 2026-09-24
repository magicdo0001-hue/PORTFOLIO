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

test("renders the archive homepage and five distinct case studies", async () => {
  const response = await render();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.match(html, /严文厚/);
  const englishResponse = await render("/en");
  assert.equal(englishResponse.status, 200);
  const englishHtml = await englishResponse.text();
  for (const homeHtml of [html, englishHtml]) {
    assert.match(homeHtml, /src="\/rhine-lab\/index.html"/);
    assert.equal((homeHtml.match(/<iframe\b/g) ?? []).length, 1);
    assert.doesNotMatch(homeHtml, /home-hero|home-project-wheel|profile-about|profile-capabilities|profile-contact/);
    assert.doesNotMatch(homeHtml, /#(?:profile|contact|top)|site-pdf-downloads|wenhou-yan-resume|wenhou-yan-portfolio/);
  }
  assert.match(html, /href="\/work"/);
  assert.match(html, /href="\/en"/);
  assert.match(englishHtml, /href="\/en\/work"/);
  assert.match(englishHtml, /切换至中文/);
  const oldLab = await render("/home-lab");
  assert.equal(oldLab.status, 308);
  assert.equal(new URL(oldLab.headers.get("location"), "http://localhost").pathname, "/");

  const englishWorkResponse = await render("/en/work");
  assert.equal(englishWorkResponse.status, 200);
  const englishWorkHtml = await englishWorkResponse.text();
  assert.match(englishWorkHtml, /\/en\/work\/battery-packaging/);
  assert.match(englishWorkHtml, /\/en\/work\/vertical-car-park/);

  const englishCases = [
    [
      "/en/work/battery-packaging",
      /CR2032 CIRCULAR SAFETY PACKAGING/,
      /PIDA Student finalist/,
    ],
    [
      "/en/work/vertical-car-park",
      /ARTI64/,
      /FROM PRODUCT TO SYSTEM/,
    ],
  ];
  for (const [path, expectedTitle, expectedCopy] of englishCases) {
    const caseResponse = await render(path);
    assert.equal(caseResponse.status, 200);
    const caseHtml = await caseResponse.text();
    assert.match(caseHtml, expectedTitle);
    assert.doesNotMatch(caseHtml, /#(?:profile|contact)|site-pdf-downloads/);
    assert.match(caseHtml, expectedCopy);
    assert.match(caseHtml, /切换至中文/);
  }
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
      /CR2032 纽扣电池可回收包装/,
      [
        "battery-museum-02.jpeg",
        "battery-museum-01.jpeg",
        "battery-museum-03.jpeg",
        "battery-museum-04.jpeg",
        "battery-museum-05.jpeg",
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
      "../app/rhine-lab-experience.tsx",
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

test("BAMBINO workbench keeps all five chapters readable in both locales", async () => {
  for (const path of ["/work/bambino", "/en/work/bambino"]) {
    const response = await render(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    for (const id of ["overview", "problem", "iterations", "locking", "structure"]) {
      assert.ok(html.includes(`id="read-${id}"`), `${path}: ${id} content exists before WebGL`);
    }
    assert.match(html, /bambino-cutout\.png/);
    assert.match(html, /data-testid="model-viewport"/);
    assert.match(html, /type="range"/);
    assert.doesNotMatch(html, /\.mp4/);
  }
});

test("BAMBINO exported assets preserve transparent tank and selectable groups", async () => {
  const data = await readFile(new URL("../public/bambino/bambino-v2.glb", import.meta.url));
  assert.equal(data.toString("utf8", 0, 4), "glTF");
  const json = JSON.parse(data.toString("utf8", 20, 20 + data.readUInt32LE(12)));
  const tank = json.materials.find(material => /clear|tank/i.test(material.name));
  assert.equal(tank.extensions.KHR_materials_transmission.transmissionFactor, 1);
  for (const name of ["group head", "方水箱", "PCB"]) {
    assert.ok(json.nodes.some(node => node.name?.includes(name)), `missing component ${name}`);
  }
});
