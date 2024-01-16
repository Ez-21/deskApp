/*
 * @Author: Ez-21 2275862144@qq.com
 * @Date: 2023-12-02 02:53:32
 * @LastEditors: w-qianzz 2275862144@qq.com
 * @LastEditTime: 2024-01-12 23:00:12
 * @FilePath: \quick\src\main.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, useRoutes, HashRouter } from "react-router-dom";
import routes from "./router/router.jsx";
import WindowBar from "@/components/windowBar";
import FallBack from "@/components/fallback";
import { invoke } from "@tauri-apps/api/tauri";
import { checkLoginStatus } from "@/func";
import "./App.module.less";
import "tdesign-react/dist/tdesign.css";
import { appWindow } from "@tauri-apps/api/window";
import { app, process } from "@tauri-apps/api";
appWindow.listen("tauri://close-requested", ({ event, payload }) => {
  console.log({ event, payload }, "关闭窗口事件");
});
const App = () => {
  React.useEffect(() => {
    checkLoginStatus();
  }, []);
  const Route = () => useRoutes(routes);
  return (
    <HashRouter>
      <Route></Route>
    </HashRouter>
  );
};
ReactDOM.createRoot(document.getElementById("root")).render(<App></App>);
