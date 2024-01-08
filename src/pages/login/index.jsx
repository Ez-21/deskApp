import style from "./index.module.less";
import logo from "@/assets/logo.png";
import close from "@/assets/close.png";
import indexLogo from "@/assets/indexLogo.png";
import backGround from "@/assets/loginBack.png";
import password from "@/assets/password.png";
import phone from "@/assets/phone.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setWindowSize } from "@/func/index.js";
import { userWxLogin, userWxState } from "@/api/api.js";
import { QRCode } from "antd";
const Index = () => {
  const [qrcode, setQrcode] = useState({
    url: "123",
    status: "loading",
  });
  const GoPage = useNavigate();
  const requestWx = () => {
    setQrcode({
      url: "123",
      status: "loading",
    });
    userWxLogin()
      .then((res) => {
        if (res.data.url) {
          setQrcode({
            stauts: "active",
            url: res.data.url,
          });
          let stateQuery = setInterval(() => {
            userWxState({ uuid: res.data.uuid }).then((res) => {
              console.log(res.data.state);
              // 取消扫码
              if (res.data.state == 403) {
                 clearInterval(stateQuery);
                 return requestWx()
              }
              if (res.code == -1) {
                return clearInterval(stateQuery);
              }
              //登录成功
              if (res.data.state == 405) {
                console.log(res.data.userinfo);
                sessionStorage.setItem(
                  "userInfo",
                  JSON.stringify(res.data.userinfo)
                );
                clearInterval(stateQuery);
                return GoPage("/index/home");
              }
              // 二维码失效
              if (res.data.state == 666) {
                setQrcode({
                  status: "expired ",
                  url: "11111",
                });
                return clearInterval(stateQuery);
              }
            });
          }, 2000);
        }
      })
      .catch((err) => {});
  };

  const login = () => {
    GoPage("/index/home", {
      state: {},
    });
  };
  const refreshQrcode = () => {
    requestWx();
  };
  useEffect(() => {
    setWindowSize(987, 572);
    requestWx();
  }, []);
  return (
    <div className={style.Box}>
      <div
        className={style.left}
        style={{
          background: `url(${backGround}) no-repeat`,
          backgroundPosition: "center",
        }}>
        <div className={style.titleBox}>
          <img src={logo} alt='' />
          <img src={indexLogo} alt='' />
          {/*<div className={style.title}>*/}
          {/*    绘唐创作平台*/}
          {/*</div>*/}
        </div>
      </div>
      <div className={style.right}>
        {/*<img src={close} alt="" className={style.close}/>*/}
        <div className={style.formBox}>
          <div className={style.loginText}>登录</div>
          <div className={style.loginTypeChange}>
            <div className={style.loginStaus}>
              <div>微信扫码登录</div>
            </div>
            <div className={style.qrcodeBox}>
              <QRCode
                onRefresh={refreshQrcode}
                value={qrcode.url}
                status={qrcode.status}
                bgColor={"white"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Index;
