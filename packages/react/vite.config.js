const { resolve } = require('path');
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

module.exports = {
  build: {
    lib: {
      entry: resolve(__dirname, 'index.tsx'),
      name: '@iamjs/react',
      fileName: 'index',
      formats: ['cjs', 'es', 'umd']
    }
  },
  plugins: [
    dts({
      outputDir: 'dist'
    }),
    react()
  ],
  rollupOptions: {
    external: ['react'],
    output: {
      globals: {
        react: 'React'
      }
    }
  }
};
