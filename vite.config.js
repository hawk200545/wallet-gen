import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import wasm from "vite-plugin-wasm";


// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['crypto-browserify'], 
  },
  define: {
    global: {}, 
  },
  plugins: [react(), tailwindcss(), nodePolyfills(), wasm()],
});
