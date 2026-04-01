import { getPluginsList } from "./build/plugins";
import { include, exclude } from "./build/optimize";
import { type UserConfigExport, type ConfigEnv, loadEnv } from "vite";
import {
  root,
  alias,
  wrapperEnv,
  pathResolve,
  __APP_INFO__
} from "./build/utils";

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH } =
    wrapperEnv(loadEnv(mode, root));
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias
    },
    // 服务端渲染
    server: {
      // 端口号
      port: VITE_PORT,
      host: "0.0.0.0",
      // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
      proxy: {
        // "/api": {
        //   // 这里填写后端地址
        //   target: "http://127.0.0.1:9003",
        //   changeOrigin: true,
        //   rewrite: path => path.replace(/^\/api/, "")
        // },
        "/api/consumer/management": {
          // 这里填写后端地址
          // target: "http://192.168.3.124:8081",
          target: "http://211.91.61.25:28181",
          changeOrigin: true,
          rewrite: path =>
            path.replace(/^\/api\/consumer\/management/, "/api/management")
        },
        "/api/consumer/identity": {
          target: "http://211.91.61.25:27081",
          changeOrigin: true,
          rewrite: path =>
            path.replace(/^\/api\/consumer\/identity/, "/api/identity")
        },
        "/api/consumer/catalog": {
          target: "http://211.91.61.25:28184",
          changeOrigin: true,
          rewrite: path =>
            path.replace(/^\/api\/consumer\/catalog/, "/api/catalog")
        },
        "/api/consumer/public": {
          target: "http://211.91.61.25:21004",
          changeOrigin: true,
          rewrite: path =>
            path.replace(/^\/api\/consumer\/public/, "/api/public")
        },
        /** 提供者 */
        "/api/providerQA/management": {
          target: "http://211.91.61.25:29391",
          changeOrigin: true,
          rewrite: path =>
            path.replace(/^\/api\/providerQA\/management/, "/api/management")
        },
        
        "/api/providerQA/public": {
          target: "http://211.91.61.25:21004",
          changeOrigin: true,
          rewrite: path =>
            path.replace(/^\/api\/providerQA\/public/, "/api/public")
        },
        /** 工具 */
        "/api/utils": {
          // target: "http://211.91.61.25:29007",
          target: "http://localhost:9007",
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, "")
        },
        "/api": {
          target: "http://localhost:9007",
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, "")
        }
      },
      // 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components}/*"]
      }
    },
    plugins: getPluginsList(VITE_CDN, VITE_COMPRESSION),
    // https://cn.vitejs.dev/config/dep-optimization-options.html#dep-optimization-options
    optimizeDeps: {
      include,
      exclude
    },
    build: {
      // https://cn.vitejs.dev/guide/build.html#browser-compatibility
      target: "es2015",
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: pathResolve("./index.html", import.meta.url)
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        }
      }
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
};
