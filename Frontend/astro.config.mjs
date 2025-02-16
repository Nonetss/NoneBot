// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  vite: {
    envPrefix: "VITE_", // Asegura que solo se expongan variables con el prefijo "VITE_"
  },
});
