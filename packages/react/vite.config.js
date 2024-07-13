import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      outputDir: 'dist'
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: '@iamjs/react',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'umd') {
          return 'index.umd.js';
        }
        return 'index.js';
      }
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
