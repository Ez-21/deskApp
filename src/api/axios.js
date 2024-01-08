/*
 * @Author: Ez-21 2275862144@qq.com
 * @Date: 2023-12-26 22:52:22
 * @LastEditors: w-qianzz 2275862144@qq.com
 * @LastEditTime: 2024-01-07 14:27:51
 * @FilePath: \quick\src\api\axios.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Axios from "axios";
import { message } from "antd";
const request = Axios.create({
  baseURL: "http://127.0.0.1:81",
  // baseURL:'/proxyUrlApi',
  headers: {
    "Content-Type": "application/json",
  },
});
request.interceptors.response.use((res) => {
  if (res.data.code != 200) {
    message.error(res?.data.msg);
    return;
  }
  return res.data;
});
export default request;
