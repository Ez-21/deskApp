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
  console.log(res.data.code, "code");
  const code = res.data.code;
  // if (res.config.url === "/pay/query" && res.data.code === 200) {
  //    message.success("支付成功！");
  // }
  if (code == 200) {
    return res.data || res;
  }
  if (code == 500) {
    message.error(res?.data.msg);
    return;
  }
  if (res.config.url == "/pay/query") {
    return res.data;
  }
});
export default request;
