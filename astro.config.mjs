import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://astrowind.netlify.app",
  base: "/",
  trailingSlash: 'always',

  integrations: [sitemap()],

  experimental: {
    assets: true,
  },

  // image: {
  //   service: {
  //     entrypoint: "./src/services/images.ts",
  //     config: {
  //       // ... service-specific config. Optional.
  //       service: "squoosh"
  //     }
  //   }
  // },
});
