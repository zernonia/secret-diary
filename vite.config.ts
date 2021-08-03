import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Components from "vite-plugin-components"
import ViteIcons, { ViteIconsResolver } from "vite-plugin-icons"
import WindiCSS from "vite-plugin-windicss"
import Pages from "vite-plugin-pages"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          ace: ["vue3-ace-editor"],
        },
      },
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
  ],
})
