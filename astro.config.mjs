import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.lambda.comp.isct.ac.jp",
  output: "static",
  vite: {
    cacheDir: ".astro/vite",
  },
});
