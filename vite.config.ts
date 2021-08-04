import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Components from "vite-plugin-components"
import ViteIcons, { ViteIconsResolver } from "vite-plugin-icons"
import WindiCSS from "vite-plugin-windicss"
import Pages from "vite-plugin-pages"
import ViteFonts from "vite-plugin-fonts"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
    },
  },
  plugins: [
    vue(),
    Components({
      directoryAsNamespace: true,
      customComponentResolvers: ViteIconsResolver(),
    }),
    ViteIcons(),
    WindiCSS(),
    Pages(),
    ViteFonts({
      google: {
        families: [
          {
            name: "Inter",
            styles: "wght@400;500;600;800",
          },
        ],
      },
    }),
  ],
})
