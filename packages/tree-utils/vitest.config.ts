import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.spec.ts"],
  },
  resolve: {
    alias: {
      "tree-utils": resolve(__dirname, "./src/index.ts"),
    },
  },
});
