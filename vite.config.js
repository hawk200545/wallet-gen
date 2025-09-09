import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import wasm from "vite-plugin-wasm";
import svgr from 'vite-plugin-svgr'


// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      crypto: "crypto-browserify",
    },
  },
  optimizeDeps: {
    include: [
      'crypto-browserify',
      'randombytes',
      'create-hash',
      'create-hmac',
      'browserify-sign',
      'diffie-hellman',
      'public-encrypt',
      'randomfill',
      'pbkdf2',
      'browserify-cipher',
    ],
  },
  define: {
    global: {},
  },
  plugins: [react(), tailwindcss(), nodePolyfills(), wasm(), svgr()],
});
