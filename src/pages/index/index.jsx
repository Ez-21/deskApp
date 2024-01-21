import { useEffect, useRef, useState } from "react";
import { setWindowSize, getImageUrl, setWindowCenter } from "@/func/index.js";
import { Outlet, useNavigate } from "react-router-dom";
import style from "./index.module.less";
import ht from "/public/assets/ht.png";
import logoText from "/public/assets/hot.png";
import codeImg from '/public/assets/ysCode.jpg'
import { message } from "tdesign-react";
import { useLocation } from "react-router-dom";
const App = () => {
  console.log(import.meta.url);
  const locationParasm = useLocation();
  const goPage = useNavigate();
  const [tabkey, setTabKey] = useState(1);
  const [route, setRoute] = useState([
    {
      id: 1,
      path: "/index/home",
      label: "首页",
      imgUrl: getImageUrl("home"),
    },
    // {
    //   id: 2,
    //   path: "/index/gpt",
    //   label: "助手",
    //   imgUrl: getImageUrl("gpt"),
    // },
    {
      id: 3,
      path: "/index/setting",
      label: "配置",
      imgUrl: getImageUrl("setting"),
    },
    {
      id: 4,
      path: "/index/mine",
      label: "我的",
      imgUrl: getImageUrl("mine"),
    },
  ]);
  const ck = (item) => {
    let userActiveStatus = JSON.parse(
      sessionStorage.getItem("userActiveStatus")
    );
    console.log("seesionStor", userActiveStatus);
    setTabKey(item.id);
    if (
      userActiveStatus == "0" &&
      ["/index/gpt", "/index/home"].includes(item.path)
    ) {
      message.info("激活此产品后开启此功能！");
      return;
    } else {
      goPage(item.path);
    }
  };
  useEffect(() => {
    setWindowSize(1440, 750);
    console.log(locationParasm);
    let { pathname } = locationParasm;
    switch (pathname) {
      case "/index/home":
        {
          setTabKey(1);
        }
        break;
      //   case "/index/gpt":
      //     {
      //       setTabKey(2);
      //     }
      //     break;
      case "/index/setting":
        {
          setTabKey(3);
        }
        break;
      case "/index/mine":
        {
          setTabKey(4);
        }
        break;
    }
    // setWindowCenter()
  }, []);
  return (
    <div className={style.box}>
      <div className={style.left}>
        <div className={style.leftOne}>
          <div className={style.logoBox}>
            <img src={ht} alt='' />
            <img src={logoText} alt='' />
          </div>
          <div className={style.changeRoute}>
            {route.map((item) => (
              <div
                style={
                  tabkey === item.id
                    ? {
                        background: "#2E2EFF",
                        borderRadius: "8px",
                      }
                    : null
                }
                className={style.ItemBox}
                key={item.id}
                onClick={() => ck(item)}>
                <img src={item.imgUrl} alt='' />
                <div>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={style.leftTwo}>
           <img src={codeImg} title="扫码进入绘唐小程序" alt="" />
        </div>
      </div>
      <div className={style.right}>
        <Outlet></Outlet>
      </div>
    </div>
  );
};
export default App;
