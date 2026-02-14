import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "build",
  format: ["esm"],
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: false,
  target: "node20",
  // tsup resolve path aliases do tsconfig automaticamente
  tsconfig: "tsconfig.json",
  // Externalizar dependências do node_modules
  external: [
    // Prisma precisa do generated client em runtime
    /generated\/prisma/,
  ],
  noExternal: [
    // Não incluir nenhum pacote no bundle — manter tudo externo
  ],
  banner: {
    // Fix para __dirname em ESM
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
});
