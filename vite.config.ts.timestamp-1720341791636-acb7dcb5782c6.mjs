// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "file:///D:/vue_project/guiguzhenxuan/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/vue_project/guiguzhenxuan/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///D:/vue_project/guiguzhenxuan/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import path from "path";
import { viteMockServe } from "file:///D:/vue_project/guiguzhenxuan/node_modules/vite-plugin-mock/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///D:/vue_project/guiguzhenxuan/vite.config.ts";
var vite_config_default = defineConfig(({ command, mode }) => {
  let env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // Specify symbolId format
        symbolId: "icon-[dir]-[name]"
      }),
      viteMockServe({
        localEnabled: command === "serve"
      })
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
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
          rewrite: (path2) => path2.replace(/^\/api/, "")
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx2dWVfcHJvamVjdFxcXFxndWlndXpoZW54dWFuXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFx2dWVfcHJvamVjdFxcXFxndWlndXpoZW54dWFuXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi92dWVfcHJvamVjdC9ndWlndXpoZW54dWFuL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyB2aXRlTW9ja1NlcnZlIH0gZnJvbSAndml0ZS1wbHVnaW4tbW9jaydcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+IHtcbiAgLy8gXHU2MjdFXHU1MjMwXHU1RjUzXHU1MjREXHU4RkQwXHU4ODRDXHU3Njg0XHU3M0FGXHU1ODgzIFx1NjYyRlx1NUYwMFx1NTNEMVx1NkEyMVx1NUYwRlx1OEZEOFx1NjYyRlx1NzUxRlx1NEVBN1x1NkEyMVx1NUYwRiAgIFx1NTE4RFx1NjI4QVx1OERERlx1OERFRlx1NUY4NFx1OEZENFx1NTZERVxuICBsZXQgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKVxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xuICAgICAgICAvLyBTcGVjaWZ5IHRoZSBpY29uIGZvbGRlciB0byBiZSBjYWNoZWRcbiAgICAgICAgaWNvbkRpcnM6IFtwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ3NyYy9hc3NldHMvaWNvbnMnKV0sXG4gICAgICAgIC8vIFNwZWNpZnkgc3ltYm9sSWQgZm9ybWF0XG4gICAgICAgIHN5bWJvbElkOiAnaWNvbi1bZGlyXS1bbmFtZV0nXG4gICAgICB9KSxcbiAgICAgIHZpdGVNb2NrU2VydmUoe1xuICAgICAgICBsb2NhbEVuYWJsZWQ6IGNvbW1hbmQgPT09ICdzZXJ2ZSdcbiAgICAgIH0pXG5cbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgICB9XG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgc2Nzczoge1xuICAgICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiAnQGltcG9ydCBcIi4vc3JjL3N0eWxlcy92YXJpYWJsZS5zY3NzXCI7J1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHByb3h5OiB7XG4gICAgICAgIFtlbnYuVklURV9BUFBfQkFTRV9BUEldOiB7XG4gICAgICAgICAgLy8gXHU4M0I3XHU1M0Q2XHU2NzBEXHU1MkExXHU1NjY4XHU1NzMwXHU1NzQwXHU2M0E1XHU1M0UzXG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9TRVJWRSxcbiAgICAgICAgICAvLyBcdTY2MkZcdTU0MjZcdThERThcdTU3REZcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgLy8gXHU4REVGXHU1Rjg0XHU5MUNEXHU1MTk5ICBcdTYyOEEvYXBpIFx1NjZGRlx1NjM2Mlx1NEUzQVx1N0E3QVx1NEUzMlxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0USxTQUFTLGVBQWUsV0FBVztBQUMvUyxTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLFNBQVM7QUFDaEIsU0FBUyw0QkFBNEI7QUFDckMsT0FBTyxVQUFVO0FBQ2pCLFNBQVMscUJBQXFCO0FBTHVJLElBQU0sMkNBQTJDO0FBUXROLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFFakQsTUFBSSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQztBQUNyQyxTQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUEsTUFDSixxQkFBcUI7QUFBQTtBQUFBLFFBRW5CLFVBQVUsQ0FBQyxLQUFLLFFBQVEsUUFBUSxJQUFJLEdBQUcsa0JBQWtCLENBQUM7QUFBQTtBQUFBLFFBRTFELFVBQVU7QUFBQSxNQUNaLENBQUM7QUFBQSxNQUNELGNBQWM7QUFBQSxRQUNaLGNBQWMsWUFBWTtBQUFBLE1BQzVCLENBQUM7QUFBQSxJQUVIO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLE1BQ3REO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osbUJBQW1CO0FBQUEsVUFDbkIsZ0JBQWdCO0FBQUEsUUFDbEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsQ0FBQyxJQUFJLGlCQUFpQixHQUFHO0FBQUE7QUFBQSxVQUV2QixRQUFRLElBQUk7QUFBQTtBQUFBLFVBRVosY0FBYztBQUFBO0FBQUEsVUFFZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxRQUM5QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFFRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
