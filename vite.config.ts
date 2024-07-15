import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 找到当前运行的环境 是开发模式还是生产模式   再把跟路径返回
  let env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]'
      }),
      viteMockServe({
        localEnabled: command === 'serve'
      })

    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";'
        }
      }
    },
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          // 获取服务器地址接口
          target: env.VITE_SERVE,
          // 是否跨域
          changeOrigin: true,
          // 路径重写  把/api 替换为空串
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }

  }
})
