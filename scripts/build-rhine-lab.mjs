import { access, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const project = fileURLToPath(new URL("../", import.meta.url));
const source = path.join(project, "RhineLabUI");
const output = path.join(project, "public", "rhine-lab");
const base = "/rhine-lab/";

function runNode(args, cwd = source) {
  const result = spawnSync(process.execPath, args, { cwd, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error("RhineLab build step failed (" + result.status + ").");
}

const viteEntry = path.join(source, "node_modules/vite/dist/node/index.js");
try {
  await access(viteEntry);
} catch {
  const npm = process.env.npm_execpath;
  if (!npm || !path.basename(npm).startsWith("npm")) {
    throw new Error("Install RhineLab dependencies first: npm ci --prefix RhineLabUI");
  }
  // The upstream lockfile uses this registry. Keep that lockfile unchanged.
  runNode([npm, "ci", "--registry=https://registry.npmmirror.com", "--no-audit", "--no-fund"]);
}

runNode([path.join(source, "scripts/export-records.mjs")]);
runNode([path.join(source, "node_modules/typescript/bin/tsc"), "--project", source]);
const { build } = await import(pathToFileURL(viteEntry).href);
console.log("Building RhineLab sources into " + output);
await build({
  root: source,
  configFile: false,
  base,
  // Do not inherit the portfolio's Tailwind/PostCSS configuration.
  css: { postcss: { plugins: [] } },
  plugins: [{
    name: "rhine-public-paths",
    enforce: "pre",
    transform(code, id) {
      const relative = path.relative(source, id.split("?")[0]).replaceAll("\\", "/");
      if (!relative.startsWith("src/") || !relative.endsWith(".ts")) return null;
      // Adapt absolute public URLs only in build output. Never edit upstream files.
      return {
        code: code.replace(/(["'\x60])\/(assets|audio|archives|fonts)\//g, "$1" + base + "$2/"),
        map: null,
      };
    },
  }],
  build: { outDir: output, emptyOutDir: true, assetsDir: "bundled", target: "es2022" },
});
await copyFile(path.join(source, "LICENSE"), path.join(output, "LICENSE.txt"));
