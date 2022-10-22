import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
  },
  build: {
    target: "es2022",
    sourcemap: true,
  },
})
