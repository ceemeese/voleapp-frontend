import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        'pinia',
        {
          'axios': [
            ['default', 'axios'] 
          ],
          'primevue/usetoast': [
            'useToast'
          ],
          'primevue/useconfirm': [
            'useConfirm'
          ],
          '@primevue/forms/resolvers/zod': [
            'zodResolver'
          ]
        },
        {
          from: 'vue-router',
          imports: ['RouteLocationRaw'],
          type: true,
        }
      ],
      dirs: [
        './src/stores/**',
        './src/composables/**',
        './src/components/**',
        './src/helpers/**',
        './src/utils/**',
        './src/types/**',
        './src/modules/**/composables/**',
      ],
      dts: true,
      vueTemplate: true
    }),
    Components({
      resolvers: [
        PrimeVueResolver(),

        (componentName) => {
          const prefixes = ['Base', 'User', 'Schedule', 'Event', 'Footer', 'Grouped', 'Header', 'Login', 'Navbar', 'Nav', 'Register'];
          const match = prefixes.some(prefix => componentName.startsWith(prefix));

          if (match) {
            return { 
              name: componentName, 
              from: 'ui'
            }
          }
        }
      ],
      dts: true,
    }),
  ],
  optimizeDeps: {
    include: [
      'animejs',
      'zod',
      'primevue/chart',
      'primevue/toggleswitch',
      'primevue/autocomplete',
      'axios'
    ]
  },
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
