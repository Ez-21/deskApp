// vite.config.js
import { defineConfig } from "file:///F:/quick/node_modules/.pnpm/vite@4.4.4_less@4.2.0/node_modules/vite/dist/node/index.js";
import react from "file:///F:/quick/node_modules/.pnpm/@vitejs+plugin-react@4.0.3_vite@4.4.4/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig(async () => ({
  plugins: [react()],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    proxy: {
      "/proxyUrl": {
        target: "http://127.0.0.1:81",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxyUrl/, "")
      },
      "/proxyUrlApi": {
        target: "http://127.0.0.1:4523/m1/3810705-0-default",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxyUrlApi/, "")
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxxdWlja1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxccXVpY2tcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6L3F1aWNrL3ZpdGUuY29uZmlnLmpzXCI7LypcclxuICogQEF1dGhvcjogRXotMjEgMjI3NTg2MjE0NEBxcS5jb21cclxuICogQERhdGU6IDIwMjMtMTItMDIgMDI6NTM6MzJcclxuICogQExhc3RFZGl0b3JzOiBFei0yMSAyMjc1ODYyMTQ0QHFxLmNvbVxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDI0LTAxLTAxIDAxOjI2OjAyXHJcbiAqIEBGaWxlUGF0aDogXFxxdWlja1xcdml0ZS5jb25maWcuanNcclxuICogQERlc2NyaXB0aW9uOiBcdThGRDlcdTY2MkZcdTlFRDhcdThCQTRcdThCQkVcdTdGNkUsXHU4QkY3XHU4QkJFXHU3RjZFYGN1c3RvbU1hZGVgLCBcdTYyNTNcdTVGMDBrb3JvRmlsZUhlYWRlclx1NjdFNVx1NzcwQlx1OTE0RFx1N0Y2RSBcdThGREJcdTg4NENcdThCQkVcdTdGNkU6IGh0dHBzOi8vZ2l0aHViLmNvbS9PQktvcm8xL2tvcm8xRmlsZUhlYWRlci93aWtpLyVFOSU4NSU4RCVFNyVCRCVBRVxyXG4gKi9cclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKGFzeW5jICgpID0+ICh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gIC8vIFZpdGUgb3B0aW9ucyB0YWlsb3JlZCBmb3IgVGF1cmkgZGV2ZWxvcG1lbnQgYW5kIG9ubHkgYXBwbGllZCBpbiBgdGF1cmkgZGV2YCBvciBgdGF1cmkgYnVpbGRgXHJcbiAgLy9cclxuICAvLyAxLiBwcmV2ZW50IHZpdGUgZnJvbSBvYnNjdXJpbmcgcnVzdCBlcnJvcnNcclxuICBjbGVhclNjcmVlbjogZmFsc2UsXHJcbiAgcmVzb2x2ZTp7XHJcbiAgICBhbGlhczp7XHJcbiAgICAgICdAJzonL3NyYydcclxuICAgIH1cclxuICB9LFxyXG4gIC8vIDIuIHRhdXJpIGV4cGVjdHMgYSBmaXhlZCBwb3J0LCBmYWlsIGlmIHRoYXQgcG9ydCBpcyBub3QgYXZhaWxhYmxlXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiAxNDIwLFxyXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcclxuICAgIHByb3h5OntcclxuICAgICAgJy9wcm94eVVybCc6e1xyXG4gICAgICAgIHRhcmdldDonaHR0cDovLzEyNy4wLjAuMTo4MScsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9wcm94eVVybC8sICcnKSxcclxuICAgICAgfSxcclxuICAgICAgJy9wcm94eVVybEFwaSc6e1xyXG4gICAgICAgIHRhcmdldDonaHR0cDovLzEyNy4wLjAuMTo0NTIzL20xLzM4MTA3MDUtMC1kZWZhdWx0JyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3Byb3h5VXJsQXBpLywgJycpLFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59KSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFRQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhLGFBQWE7QUFBQSxFQUN2QyxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFJakIsYUFBYTtBQUFBLEVBQ2IsU0FBUTtBQUFBLElBQ04sT0FBTTtBQUFBLE1BQ0osS0FBSTtBQUFBLElBQ047QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLE9BQU07QUFBQSxNQUNKLGFBQVk7QUFBQSxRQUNWLFFBQU87QUFBQSxRQUNQLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxlQUFlLEVBQUU7QUFBQSxNQUNuRDtBQUFBLE1BQ0EsZ0JBQWU7QUFBQSxRQUNiLFFBQU87QUFBQSxRQUNQLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxrQkFBa0IsRUFBRTtBQUFBLE1BQ3REO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
