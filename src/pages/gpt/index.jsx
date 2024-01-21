import { useState,useEffect } from "react";
import style from "./index.module.less";
import dele from "/public/assets/delete.png";
import { getImageUrl } from "@/func";
import { message } from "antd";
import { getAllMsg, delgptMsg, updategptMsg, chatGpt } from "@/api/api";
const App = () => {
  const [index, setIndex] = useState(0);
  const [msgList, setMsgList] = useState([]);
  const [quesVal, setQuesVal] = useState();
  const ckMsgCard = (item) => {
    console.log(item);
    setIndex(item);
  };
  // 新建对话
  const addMsg = ()=>{
    msgList.unshift({title:'默认对话'})
    setMsgList([...msgList])
  }
  // 获取全部对话
  const allMsg = () => {
    getAllMsg().then((res) => {
      console.log(res, "所有对话");
      setMsgList(res.data);
    });
  };
  // 删除对话
  const delMsg = (item) => {
    delgptMsg(item.chatId).then((res) => {
      if (res.code == 200) {
        message.success("已删除");
        allMsg();
      }
    });
  };
  useEffect(() => {
    allMsg();
  },[]);
  return (
    <div className={style.box}>
      <div className={style.content}>
        <div className={style.left}>
          <div className={style.bar}>
            近期对话
            <img src={getImageUrl("more")} alt=''  onClick={addMsg}/>
          </div>
          {msgList.map((item) => (
            <div
              className={style.msgCard}
              style={
                index == item
                  ? {
                      background: "rgba(255, 255, 255, 0.12)",
                      color: "rgba(255, 255, 255, 0.85)",
                    }
                  : null
              }
              key={Math.random(1, 100)}
              onClick={() => ckMsgCard(item)}>
              {item.title}
              <img src={dele} alt='' onClick={() => delMsg(item)} />
            </div>
          ))}
        </div>
        <div className={style.right}>
          <div className={style.footer}>
            <div className={style.sendBox}>
              <input
                type='text'
                value={quesVal}
                onInput={(e) => setQuesVal(e.target.value)}
              />
              <img src={getImageUrl("send")} alt='' />
            </div>
          </div>
          <div className={style.flexL}>
            <div className={style.flexLcon}>
              <img src={getImageUrl("logo")} alt='' className={style.headPic} />
              <div className={style.msg}>1231313123123</div>
            </div>
          </div>
          <div className={style.flexR}>
            <div className={style.flexRcon}>
              <img src={getImageUrl("logo")} alt='' className={style.headPic} />
              <div className={style.msg}>1231313123123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
