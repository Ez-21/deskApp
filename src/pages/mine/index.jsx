import style from "./index.module.less";
import book from "/public/assets/book.png";
import girl from "/public/assets/girl.jpeg";
import Close from "/public/assets/closeWindow.png";
import WX from "/public/assets/wx.png";
import ZFB from "/public/assets/zfb.png";
import Chong from "/public/assets/chongzhi.png";
import Quit from "/public/assets/quit.png";
import PushMoney from "/public/assets/pushMoney.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../func";
import {
  getWxPayCode,
  getWxPayState,
  getActivate,
  getActivateState,
  getSecretKey,
} from "@/api/api";
import { Modal, QRCode, message } from "antd";
import Sort from "../../components/callWordEd/2";
const App = () => {
  const goPage = useNavigate();
  const [payModalShow, SetPayModalShow] = useState(false);
  const [getModalShow, SetGetModalShow] = useState(false);
  let [queryTime, setQueryTime] = useState(undefined);
  const [secretKey, setSecretKey] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [activeState, setActiveState] = useState(undefined);
  const [userStatus, setUserStatus] = useState("");
  const [payWay, setPayWay] = useState({
    wx: "",
    zfb: "",
    wxStatus: "loading",
    zfbStatus: "loading",
    chargeAmount: "",
  });
  const interval = 1000; // 1秒的毫秒数
  const duration = 3 * 60 * 1000; // 三分钟的毫秒数
  let elapsedTime = 0;
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const payNum = [10.0, 20.0, 50.0, 100.0, 300.0, 500.0];
  const openPay = (data) => {
    payWay.wx = "";
    payWay.zfb = "";
    SetPayModalShow(true);
    payWay.chargeAmount = data;
    setPayWay({ ...payWay });
  };
  // 生成微信二维码
  const wxPay = () => {
    getWxPayCode({
      chargeAmount: payWay.chargeAmount,
    }).then((res) => {
      console.log(res);
      let { url, order_no } = res.data;
      payWay.wx = url;
      setPayWay({ ...payWay });
      queryTime = setInterval(() => {
        queryStatus(order_no).then((res) => {
          console.log(res, "时间res");
          payWay.wxStatus = "active";
          setPayWay({ ...payWay });
          if (res.code == 200) {
            clearInterval(queryTime);
            setQueryTime(undefined);
            return message.success("支付成功！");
          }
          // 未支付
          if (res.code == 2401) {
            if (elapsedTime >= duration) {
              clearInterval(queryTime);
              setQueryTime(undefined);
              return;
            } else {
              queryStatus(order_no);
              elapsedTime += interval;
              return;
            }
          }
          if (res.code == 2402) {
            message.error(res.msg);
            payWay.wxStatus = "expired";
            setPayWay({ ...payWay });
            clearInterval(queryTime);
            setQueryTime(undefined);
            return;
          }
        });
      }, 1800);
      setQueryTime(queryTime);
    });
  };
  const queryStatus = async (order_no) => {
    // 查询订单状态
    return await getWxPayState({ orderNo: order_no });
  };
  const closePay = () => {
    SetPayModalShow(false);
    if (queryTime) {
      clearInterval(queryTime);
    }
    setQueryTime(undefined);
  };
  const closeGet = (status) => {
    setActivationCode("");
    SetGetModalShow(false);
  };
  // 去登录
  const gologin = () => {
    goPage("/");
  };
  const openGet = () => {
    SetGetModalShow(true);
  };
  // 点击刷新二维码
  const refreshCode = (type) => {
    if (type == "wx") {
      wxPay();
    } else {
    }
  };
  // 退出
  const quit = () => {
    Modal.confirm({
      title: "提示",
      content: "确认退出吗？",
      cancelText: "取消",
      okText: "退出",
      onOk() {
        sessionStorage.clear();
        goPage("/");
      },
    });
  };
  //获取用户机器码
  const getKey = () => {
    getSecretKey().then((res) => {
      let secretKey = res.data.secretKey;
      setSecretKey(secretKey);
    });
  };

  // 激活
  const activate = () => {
    getActivate({
      activationCode,
    })
      .then((res) => {
        console.log(res);
        if (res.data == "已激活") {
          message.success("激活成功！");
        } else {
          message.error("激活失败！");
        }
      })
      .finally(() => {
        getActivateHandle();
        SetGetModalShow(false);
      });
  };
  // 查询激活状态
  const getActivateHandle = () => {
    getActivateState().then((res) => {
      console.log(res, "查询状态res");
      if (res.code==200) {
        sessionStorage.setItem("userActiveStatus", "1");
        setActiveState(true);
      } else {
        setActiveState(false);
        sessionStorage.setItem("userActiveStatus", "0");
      }
    });
  };
  useEffect(() => {
    getActivateHandle();
    getKey();
  }, []);
  return (
    <div className={style.box}>
      {/* <Sort></Sort> */}
      {/*支付订单弹窗*/}
      {payModalShow && (
        <div className={style.payModal}>
          <div className={style.titleTop}>
            <div>支付订单</div>
            <img src={getImageUrl("closeWindow")} onClick={closePay} alt='' />
          </div>
          <div className={style.payConent}>
            <div className={style.one}>
              <div>购买详情：</div>
              <div>算球12</div>
            </div>
            <div className={style.two}>
              <div>实付金额：</div>
              <div>
                <span>￥</span>2000
              </div>
            </div>
            <div className={style.three}>
              <div
                style={{
                  whiteSpace: "nowrap",
                }}>
                支付方式：
              </div>
              <div className={style.payWay}>
                <div
                  style={{
                    marginRight: "16px",
                  }}>
                  <div>
                    {payWay.zfb ? (
                      <img
                        src={payWay.zfb}
                        alt=''
                        className={style.payQrcode}
                      />
                    ) : (
                      <img
                        src={getImageUrl("zfb")}
                        alt=''
                        className={style.payIcon}
                      />
                    )}
                  </div>
                  <div className={style.payBtn1}>去支付宝支付</div>
                </div>
                <div>
                  <div>
                    {payWay.wx ? (
                      <QRCode
                        value={payWay.wx}
                        bgColor={"white"}
                        bordered={false}
                        size={138}
                        status={payWay.wxStatus}
                        onRefresh={() => refreshCode("wx")}
                      />
                    ) : (
                      <img
                        src={getImageUrl("wx")}
                        alt=''
                        className={style.payIcon}
                      />
                    )}
                  </div>
                  <div className={style.payBtn2} onClick={wxPay}>
                    生成微信二维码
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/*立即激活弹窗*/}
      {getModalShow && (
        <div className={style.getModal}>
          <div className={style.titleTop}>
            <div>输入激活码激活产品</div>
            <img src={getImageUrl("closeWindow")} alt='' onClick={closeGet} />
          </div>
          <div className={style.getContent}>
            <input
              type='text'
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
            />
            <div className={style.getBtn} onClick={activate}>
              立即激活
            </div>
          </div>
        </div>
      )}
      <div className={style.titleBar}>
        <img src={getImageUrl("book")} alt='' />
        <div>教程</div>
      </div>
      <div className={style.content}>
        <div className={style.userInfo}>
          <div className={style.user}>
            <img
              src={userInfo?.headimgurl}
              alt=''
              className={style.headimgurl}
            />
            <div className={style.userMsg}>
              <div>
                {userInfo?.nickname ?? "--"}
                <div
                  className={style.userStatus}
                  onClick={() => (activeState ? null : openGet(true))}>
                  {activeState ? "已激活" : "未激活"}
                </div>
              </div>
              {/* <div>userId：{userInfo?.userid}</div> */}
              <div className={style.keyCode}>本机机器码：{secretKey}</div>
            </div>
          </div>
          {!activeState ? (
            <div className={style.get} onClick={openGet}>
              立即激活
            </div>
          ) : null}
          {userInfo ? (
            <div className={style.quit} onClick={quit}>
              <img src={Quit} alt='' />
            </div>
          ) : (
            <div className={style.goLogin} onClick={gologin}>
              立即登录
            </div>
          )}
        </div>
        <div className={style.balance}>
          <img src={PushMoney} alt='' />
          <div className={style.lostMone}>
            <div>积分余额</div>
            <div>0.00</div>
          </div>
        </div>
        <div className={style.recharge}>
          <div className={style.recharTitle}>
            <img src={Chong} alt='' />
            充值
          </div>
          <div className={style.moneyItem}>
            {payNum.map((item) => (
              <div
                className={style.itemBox}
                onClick={() => openPay(item)}
                key={item}>
                <div className={style.itemNumber}>200积分</div>
                <div>
                  ￥ <span>{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
