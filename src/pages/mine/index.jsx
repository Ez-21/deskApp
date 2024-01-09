import style from "./index.module.less";
import book from "@/assets/book.png";
import girl from "@/assets/girl.jpeg";
import Close from "@/assets/closeWindow.png";
import WX from "@/assets/wx.png";
import ZFB from "@/assets/zfb.png";
import Chong from "@/assets/chongzhi.png";
import Quit from "@/assets/quit.png";
import PushMoney from "@/assets/pushMoney.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../func";
import { getWxPayCode } from "@/api/api";
import { Modal } from "antd";
const App = () => {
  const goPage = useNavigate();
  const [payModalShow, SetPayModalShow] = useState(false);
  const [getModalShow, SetGetModalShow] = useState(false);
  const [payWay,setPayWay] = useState({
    wx:'',
    zfb:''
  })
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const payNum = [10.0, 20.0, 50.0, 100.0, 300.0, 500.0];
  const openPay = (data) => {
    SetPayModalShow(true);
    getWxPayCode({
      charge_amount:data
    }).then(res=>{
      console.log(res);
    })
  };
  const closePay = () => {
    SetPayModalShow(false);
  };
  const closeGet = (status) => {
    if (status) {
    }
    SetGetModalShow(false);
  };
  // 去登录
  const gologin = () => {
    goPage("/");
  };
  const openGet = () => {
    SetGetModalShow(true);
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
  return (
    <div className={style.box}>
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
                    <img src={getImageUrl("zfb")} alt='' />
                  </div>
                  <div className={style.payBtn1}>去支付宝支付</div>
                </div>
                <div>
                  <div>
                    <img src={payWay.wx} alt='' />
                  </div>
                  <div className={style.payBtn2}>生成微信二维码</div>
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
            <img
              src={getImageUrl("closeWindow")}
              alt=''
              onClick={() => closeGet()}
            />
          </div>
          <div className={style.getContent}>
            <input type='text' />
            <div className={style.getBtn} onClick={() => closeGet(true)}>
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
                <div className={style.userStatus} onClick={() => openGet(true)}>
                  未激活
                </div>
              </div>
              <div>userId：{userInfo?.userid}</div>
            </div>
          </div>
          <div className={style.get} onClick={openGet}>
            立即激活
          </div>
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
              <div className={style.itemBox} onClick={()=>openPay(item)} key={item}>
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
