import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],

    // Base path for assets (set to '/' for production, './' for relative paths)
    base: mode === 'production' ? '/' : '/',

    // Improve build performance and output
    build: {
      // Output to dist folder instead of backend/public
      outDir: 'dist',

      // Ignore TypeScript errors during build
      typescript: {
        ignoreBuildErrors: true,
      },

      // Reduce chunk size
      chunkSizeWarningLimit: 1000,

      // Optimize the build
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },

      // Generate sourcemaps only in development
      sourcemap: mode !== 'production',

      // Configure assets handling
      assetsDir: 'assets',

      // Rollup options
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              'react',
              'react-dom',
              'react-router-dom',
              'react-redux',
              '@reduxjs/toolkit',
              'react-toastify',
              '@tanstack/react-query',
            ],
          },
        },
      },
    },

    // Configure server
    server: {
      port: 5173,
      host: true,
      strictPort: true,
    },

    // Configure preview server
    preview: {
      port: 4173,
      host: true,
      strictPort: true,
    },

    // Resolve aliases
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  };
});
