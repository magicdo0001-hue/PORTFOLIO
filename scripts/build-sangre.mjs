import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";
import react from "@vitejs/plugin-react";

const root = fileURLToPath(new URL("../standalone/aether-replica/", import.meta.url));
const output = fileURLToPath(new URL("../public/sangre-showcase/", import.meta.url));
const base = "/sangre-showcase/";
await build({
  root, configFile: false, base, plugins: [react()],
  css: { postcss: { plugins: [] } },
  build: { outDir: output, emptyOutDir: true, target: "es2022" },
});
// The imported runtime also fetches public assets directly. Rebase the exported
// files, leaving its source usable by the independent local preview.
async function rebase(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await rebase(file);
    else if (/\.(?:js|css|html)$/.test(entry.name)) {
      const content = await readFile(file, "utf8");
      await writeFile(file, content.replace(/(["'`(])\/assets(?=\/|["'`])/g, `$1${base}assets`));
    }
  }
}
await rebase(output);
