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
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
