import { defineConfig } from "tsup";
import type { Plugin } from "esbuild";

// Plugin que reescreve imports de generated/prisma para o caminho correto
// relativo ao build/server.js → ../generated/prisma
const prismaAliasPlugin: Plugin = {
  name: "prisma-alias",
  setup(build) {
    build.onResolve({ filter: /generated\/prisma/ }, () => ({
      path: "../generated/prisma",
      external: true,
    }));
  },
};

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "build",
  format: ["esm"],
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: false,
  target: "node20",
  tsconfig: "tsconfig.json",
  noExternal: [],
  esbuildPlugins: [prismaAliasPlugin],
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
});
