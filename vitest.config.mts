import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

// `import.meta.dirname` is undefined on Node < 20.11, so use the portable
// fileURLToPath(new URL(...)) form to stay compatible with Node 18.17+/20.x.
const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "."),
    },
  },
  test: {
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["node_modules", ".next"],
  },
});
