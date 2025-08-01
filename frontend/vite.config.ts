// 1️⃣ Import a helper from Vite that makes configuration easier
import { defineConfig } from "vite";

// 2️⃣ Import the official Vite plugin that adds support for React (JSX, Fast Refresh, etc.)
import react from "@vitejs/plugin-react";

// 3️⃣ Export the configuration using defineConfig (gives IntelliSense + type safety)
export default defineConfig({
  
  // 4️⃣ Add the React plugin to the Vite config.
  // This plugin allows Vite to understand and compile React code.
  plugins: [react()],
});
