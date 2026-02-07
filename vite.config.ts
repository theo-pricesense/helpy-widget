import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    preact(),
    cssInjectedByJsPlugin(), // CSS를 JS에 번들링
  ],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "Helpy",
      formats: ["es", "umd"],
      fileName: (format) =>
        format === "umd" ? "helpy-widget.umd.cjs" : "helpy-widget.js",
    },
    rollupOptions: {
      // Preact는 번들에 포함
      external: [],
      output: {
        // 전역 변수로 노출
        globals: {},
        // 단일 파일로 출력
        inlineDynamicImports: true,
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    sourcemap: false,
    // 작은 번들 크기 유지
    cssCodeSplit: false,
  },
});