import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// GitHub Pages project site: https://<user>.github.io/garage-vn/
// Scenario Studio (editor.html) is local-only: available in `vite` / `npm run editor`,
// never included in the production build that deploys to Pages.
export default defineConfig({
  plugins: [react()],
  base: "/garage-vn/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
