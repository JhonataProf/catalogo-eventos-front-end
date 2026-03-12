import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setupTests.ts",
      css: true,
      include: [
        "src/**/*.spec.ts",
        "src/**/*.test.ts",
        "src/**/*.spec.tsx",
        "src/**/*.test.tsx",
      ],
      coverage: {
        provider: "v8",
        reporter: ["text", "html", "json-summary"],
        reportsDirectory: "./coverage",
        clean: true,
        skipFull: true,
        exclude: [
          "coverage/**",
          "dist/**",
          "**/*.d.ts",
          "**/vite.config.*",
          "**/vitest.config.*",
          "src/test/**",
          "src/main.tsx",
          "src/assets/**",
        ],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  }),
);
