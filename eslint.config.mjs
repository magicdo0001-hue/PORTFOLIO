import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "RhineLabUI/**",
    "public/rhine-lab/**",
    "tmp/**",
    "**/dist/**",
    // Imported minified runtime/decoder assets and reference captures are not maintained application source.
    "standalone/aether-replica/public/assets/vendor/**",
    "standalone/aether-replica/public/assets/draco/**",
    "参考/**",
  ]),
  {
    files:["standalone/aether-replica/src/**/*.{js,jsx}"],
    // This standalone prototype uses Vite, so native images and page links are intentional.
    rules:{"@next/next/no-img-element":"off","@next/next/no-html-link-for-pages":"off"},
  },
]);

export default eslintConfig;
