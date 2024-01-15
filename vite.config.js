/*
 * @Author: Ez-21 2275862144@qq.com
 * @Date: 2023-12-02 02:53:32
 * @LastEditors: w-qianzz 2275862144@qq.com
 * @LastEditTime: 2024-01-12 09:43:23
 * @FilePath: \quick\vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig(async () => ({
  base: "/",
  plugins: [react()],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  resolve: {
    alias: {
      "@" :path.resolve(__dirname,"src"),
    },
  },
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
}));
