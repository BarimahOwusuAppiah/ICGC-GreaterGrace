import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path for deployment - supports subdirectory deployments
  // Use VITE_BASE_URL env variable or default to "/"
  base: process.env.VITE_BASE_URL || "/",
  
  server: {
    host: "::",
    port: 8080,
    open: true,
  },
  
  // Preview server for testing production builds
  preview: {
    host: "::",
    port: 4173,
    open: true,
  },
  
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // Build configuration for production deployment
  build: {
    // Output directory for built files
    outDir: "dist",
    
    // Subdirectory for assets within dist
    assetsDir: "assets",
    
    // Generate source maps for debugging (set to false for production)
    sourcemap: mode === "development",
    
    // Minify the output using esbuild (default, no additional install needed)
    minify: "esbuild",
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1500,
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Rollup options for better chunking
    rollupOptions: {
      // Output configuration
      output: {
        // Manual chunking for vendor libraries
        manualChunks: {
          // React and related libraries
          "vendor-react": [
            "react",
            "react-dom",
            "react-router-dom",
          ],
          // Radix UI components
          "vendor-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-tabs",
            "@radix-ui/react-accordion",
            "@radix-ui/react-slider",
            "@radix-ui/react-switch",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-select",
            "@radix-ui/react-toast",
            "@radix-ui/react-progress",
            "@radix-ui/react-separator",
          ],
          // UI utility libraries
          "vendor-ui": [
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "cmdk",
            "embla-carousel-react",
          ],
          // Data and form libraries
          "vendor-data": [
            "@tanstack/react-query",
            "react-hook-form",
            "@hookform/resolvers",
            "zod",
            "date-fns",
          ],
          // Charts library
          "vendor-charts": [
            "recharts",
          ],
        },
        
        // Asset file names with content hashes for cache busting
        assetFileNames: "assets/[name]-[hash][extname]",
        
        // Chunk file names with content hashes
        chunkFileNames: "chunks/[name]-[hash].js",
        
        // Entry point file names with content hashes
        entryFileNames: "js/[name]-[hash].js",
      },
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
    ],
  },
  
  // CSS configuration
  css: {
    devSourcemap: mode === "development",
  },
}));
