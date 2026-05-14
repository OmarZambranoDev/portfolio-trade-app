import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'trade',
      filename: 'remoteEntry.js',
      exposes: {
        './TradeApp': './src/App',
      },
      shared: {
        react: { singleton: true, requiredVersion: '18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '18.2.0' },
        'react/jsx-runtime': { singleton: true },
        '@OmarZambranoDev/portfolio-ui': { singleton: true },
        zustand: { singleton: true, version: '4.5.2' },
      },
    }),
  ],
  build: {
    target: 'esnext',
    cssCodeSplit: false,
  },
  server: {
    port: 3003,
    cors: true,
  },
  preview: {
    port: 3003,
    cors: true,
  },
});
