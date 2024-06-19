import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config/
export default defineConfig({
  // build: { commonjsOptions: { transformMixedEsModules: true, include: ['@mempool/mempool.js'] } },
  plugins: [
    wasm(),
    nodePolyfills(),
    react(),
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      external: [
        "node:util",
        "node:buffer",
        "node:stream",
        "node:net",
        "node:url",
        "node:fs",
        "node:path",
        "node:process",
        "perf_hooks",
      ],
      output: {
        globals: {
          "node:stream": "stream",
          "node:buffer": "buffer",
          "node:util": "util",
          "node:net": "net",
          "node:url": "url",
          "node:process": "process",
          perf_hooks: "perf_hooks",
        },
        inlineDynamicImports: true,
      },
      // plugins: [nodePolyfills()],
    },
  },
  optimizeDeps: {
    exclude: ['events'],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  // server: {
  //   https: {
  //     key: path.resolve(__dirname, 'keys/cert.key'),
  //     cert: path.resolve(__dirname, 'keys/cert.crt'),
  //   }
  // },
  define: {
    'process.env': process.env,
    'process.version': JSON.stringify(process.version),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
