import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'IE 11'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    // preprocessorOptions: {
    //   // 这里配置 mixin.scss 混合文件的全局引入
    //   scss: {
    //     additionalData: `
    //       @use "@/assets/mixin.scss";
    //     `,
    //   },
    // },
  },
})
