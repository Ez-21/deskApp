import style from "./index.module.less";
import ModalAdd from "@/assets/modelAdd.png";
import ModelSet from "@/assets/modelSet.png";
import Rubbish from "@/assets/rubbish.png";
import Ques from "@/assets/ques.png";
import { useEffect, useState } from "react";
import { Select, Tabs, Checkbox, InputNumber } from "antd";
import { ConfigProvider } from "antd";
import theme from "./componentTheme";
import { getGlobalStyle } from "@/api/api.js";
const App = () => {
  const [callShow, setCallShow] = useState(false);
  const [tabIndex, setTabIndex] = useState(1);
  const [viewIndex, setViewIndex] = useState(1);
  const modal = [
    { value: "1", label: "1:1" },
    { value: "2", label: "3:2" },
    { value: "3", label: "5:4" },
    { value: "4", label: "7:4" },
    { value: "custom", label: "自定义" },
  ];
  const [modalVal, setModalVal] = useState(modal);
  const [checkItem, setCheckItem] = useState([]);
  const [tabs, setTabs] = useState([
    {
      key: 1,
      label: "风格&媒介",
    },
    {
      key: 2,
      label: "视角",
    },
    {
      key: 3,
      label: "场景",
    },
    {
      key: 4,
      label: "光照",
    },
    {
      key: 5,
      label: "渲染",
    },
    {
      key: 6,
      label: "精度",
    },
  ]);
  const changeTab = (id) => {
    setTabIndex(id);
  };
  const viewChange = (val) => {
    setViewIndex(val);
  };
  // 获取全局风格
  const getMjStyle = () => {
    getGlobalStyle().then((res) => {
      console.log(res, "全局风格");
    });
  };
  useEffect(() => {
    getMjStyle();
    return;
    if (callShow) {
      getMjStyle();
    }
  }, [callShow]);
  return (
    <ConfigProvider
      theme={{
        ...theme,
      }}>
      <div>
        {/* 提示词弹窗 */}
        {callShow && (
          <div className={style.callWord}>
            <div className={style.callWordTitle}>选择提示词</div>
            <div className={style.changebox}>
              <Tabs defaultActiveKey='1' items={tabs} />
              <div className={style.tabsModalContent}>
                <div className={style.modalItem}>
                  <div className={style.left}>
                    <Checkbox></Checkbox>
                  </div>
                  <div className={style.right}>水彩画</div>
                </div>
              </div>
            </div>
            <div className={style.btnBoxBottom}>
              <div className={style.cancle} onClick={() => setCallShow(false)}>
                取消
              </div>
              <div className={style.save} onClick={() => setCallShow(false)}>
                保存
              </div>
            </div>
          </div>
        )}
        <div className={style.title}>
          <div>
            <img src={ModelSet} alt='' />
            全局风格
          </div>
          <img
            src={ModalAdd}
            alt=''
            onClick={() => setCallShow(() => !callShow)}
          />
        </div>
        <div>
          <div className={style.changebox}>
            <div className={style.btnBox}>
              {tabs.map((item) => {
                return (
                  <div
                    key={item.key}
                    style={
                      tabIndex === item.key
                        ? {
                            background: "rgba(255, 255, 255, 0.2)",
                            color: "white",
                          }
                        : undefined
                    }
                    className={style.btnItem}
                    onClick={() => changeTab(item.key)}>
                    {item.label}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                minHeight: "232px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}>
              <div className={style.btnContent}>
                <div className={style.btnContItem}>
                  <div>
                    <img src={Rubbish} alt='' />
                  </div>
                  <div className={style.name}>精密插画</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.sizeBox}>
          <div className={style.one}>
            <div>
              图片尺寸
              <img src={Ques} alt='' />
            </div>
            <div className={style.select}>
              <Select options={modal} value={modalVal}></Select>
            </div>
          </div>
          <div className={style.two}>
            <div
              style={{
                marginRight: "16px",
              }}>
              <span>宽度</span>
              <input type='text' />
            </div>
            <div>
              <span>高度</span>
              <input type='text' />
            </div>
          </div>
        </div>
        <div className={style.modalBox}>
          <div>
            选择模型
            <img src={Ques} alt='' />
          </div>
          <div className={style.select}>
            <Select options={modal} value={modalVal}></Select>
          </div>
        </div>
        <div className={style.viewDefault}>
          <div>全局默认采纳视图</div>
          <div className={style.viewChange}>
            {[1, 2, 3, 4].map((item) => {
              return (
                <div
                  onClick={() => viewChange(item)}
                  key={item}
                  style={
                    item === viewIndex
                      ? {
                          color: "white",
                          background: "rgba(255, 255, 255, 0.2)",
                        }
                      : {}
                  }>
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};
export default App;
