import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue': path.resolve(__dirname, 'node_modules/vue'),
      'primevue': path.resolve(__dirname, 'node_modules/primevue'),
      '@primevue/core': path.resolve(__dirname, 'node_modules/@primevue/core')
    },
    preserveSymlinks: false,
    dedupe: ['vue', 'primevue', '@primevue/core']
  },
})
