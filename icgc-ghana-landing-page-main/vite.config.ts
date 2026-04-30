import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path for deployment
  // Use VITE_BASE_URL env variable for subdirectory deployments
  // Default to "/" for Vercel/Netlify (absolute paths work best on these platforms)
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
    
    // Empty assetsDir to put assets at root of dist
    assetsDir: "",
    
    // Generate source maps for debugging (set to false for production)
    sourcemap: false,
    
    // Minify the output using esbuild
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
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // React core
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router")
            ) {
              return "vendor-react";
            }
            // Radix UI components
            if (id.includes("@radix-ui")) {
              return "vendor-radix";
            }
            // UI utilities
            if (
              id.includes("class-variance-authority") ||
              id.includes("clsx") ||
              id.includes("tailwind-merge") ||
              id.includes("cmdk") ||
              id.includes("embla-carousel") ||
              id.includes("lucide-react")
            ) {
              return "vendor-ui";
            }
            // Data/form libraries
            if (
              id.includes("@tanstack") ||
              id.includes("react-hook-form") ||
              id.includes("@hookform") ||
              id.includes("zod") ||
              id.includes("date-fns")
            ) {
              return "vendor-data";
            }
            // Charts
            if (id.includes("recharts") || id.includes("d3")) {
              return "vendor-charts";
            }
          }
        },
        
        // Asset file names with content hashes
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
