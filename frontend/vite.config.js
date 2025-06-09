import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
     
      '/api': {
        target: 'https://ful2winreact.onrender.com', 
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '') 
      }
    }
  },
  assetsInclude: ['**/*.mp4'],
  publicDir: 'public'
});
