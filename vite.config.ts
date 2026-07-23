import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages project site: https://<user>.github.io/garage-vn/
export default defineConfig({
  plugins: [react()],
  base: "/garage-vn/",
});
