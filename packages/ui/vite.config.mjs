import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        preserveModules: false, // Bundle everything together
        exports: 'named',
        inlineDynamicImports: true
      }
    },
    cssCodeSplit: false, // Single CSS file
    sourcemap: true,
    emptyOutDir: true
  }
})