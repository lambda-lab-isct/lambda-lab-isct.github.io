import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://lambda-lab-isct.github.io",
  output: "static",
  vite: {
    cacheDir: ".astro/vite",
  },
});
