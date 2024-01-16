import style from "./index.module.less";
import ht from "/public/assets/ht.png";
import close from "/public/assets/close.png";
import indexLogo from "/public/assets/indexLogo.png";
import backGround from "/public/assets/loginBack.png";
import password from "/public/assets/password.png";
import phone from "/public/assets/phone.png";
import { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setWindowSize, getImageUrl } from "@/func/index.js";
import {
  userWxLogin,
  userWxState,
  getActivateState,
  judgeLogin,
} from "@/api/api.js";
import { QRCode, message } from "antd";
import { invoke } from "@tauri-apps/api/tauri";
const Index = () => {
  const [qrcode, setQrcode] = useState({
    url: "123",
    status: "loading",
  });
  const GoPage = useNavigate();
  // 验证是否需要登录
  const judgeLoginHandle = () => {
    judgeLogin().then((res) => {
      console.log(res, "验证登录的数据");
      if (res.data) {
        sessionStorage.setItem("userInfo", JSON.stringify(res.data));
        GoPage("/index/home", { replace: true });
      }
    });
  };
  // 查询激活状态
  const getActivate = () => {
    getActivateState().then((res) => {
      if (res.code==200) {
        sessionStorage.setItem("userActiveStatus", "1");
      } else {
        sessionStorage.setItem("userActiveStatus", "0");
        GoPage("/index/mine");
      }
    });
  };
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
                message.info("取消扫码！");
                clearInterval(stateQuery);
                return requestWx();
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
                // 保存用户登录时间
                localStorage.setItem("loginTime", Date.now());
                clearInterval(stateQuery);
                getActivate();
                GoPage("/index/home", { replace: true });
                return
              }
              // 二维码失效
              if (res.data.state == 666) {
                setQrcode({
                  status: "expired ",
                  url: encodeURIComponent("二维码已失效,请刷新"),
                });
                return clearInterval(stateQuery);
              }
            });
          }, 3000);
        }
      })
      .catch((err) => {});
  };

  const login = () => {
    //
    GoPage("/Step3SyncVideo", {
      state: {},
      replace: true,
    });
  };
  const refreshQrcode = () => {
    requestWx();
  };
  useLayoutEffect(() => {
    // judgeLoginHandle();
  }, []);
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
          <img src={getImageUrl("ht")} alt='' />
          <img src={login} alt='' />
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
