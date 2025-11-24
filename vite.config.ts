import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const root = resolve(__dirname, "src/client/ui");
const outDir = resolve(__dirname, "dist/client_packages/ui");

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    root,
    base: "./",
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
    },
    build: {
      outDir,
      emptyOutDir: true,
      sourcemap: true,      // <--- Source maps completos
      minify: false,        // <--- SIN minificar
      cssCodeSplit: true,   // <--- Mantener css modular
      rollupOptions: isDev
        ? {}
        : {
            // SOLO PARA PRODUCCIÓN
            input: resolve(root, "index.html"),
            output: {
              entryFileNames: "index.js",
              inlineDynamicImports: true,
            },
          },
    },
  };
});
