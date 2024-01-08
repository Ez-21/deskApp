/* 
 * @Author: Ez-21 2275862144@qq.com
 * @Date: 2023-12-02 02:53:32
 * @LastEditors: w-qianzz 2275862144@qq.com
 * @LastEditTime: 2024-01-08 23:49:54
 * @FilePath: \quick\src\main.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from "react";
import ReactDOM from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import routes from './router/router.jsx'
import WindowBar from '@/components/windowBar'
document.addEventListener('contextmenu', (e) => {
    // return  e.preventDefault()
})
ReactDOM.createRoot(document.getElementById("root")).render(
    // <WindowBar>
            <React.Suspense fallback={<div>请稍后。。</div>}>
                <RouterProvider router={routes}></RouterProvider>
            </React.Suspense>

    // </WindowBar>
);
