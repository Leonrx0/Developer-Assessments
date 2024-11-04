import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 配置代理
  server: {
    proxy: {
      '/api': {
        target: 'http://47.109.141.255:51601/',
        changeOrigin: true,   // 修改源
        rewrite: (path) => path.replace(/^\/api/, "")   //  /api 替换为空字符串
      }
    }
  }
})

