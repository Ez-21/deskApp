import style from "./index.module.less";
import ModalAdd from "/public/assets/modelAdd.png";
import ModelSet from "/public/assets/modelSet.png";
import Rubbish from "/public/assets/rubbish.png";
import Ques from "/public/assets/ques.png";
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Select, Tabs, Checkbox, InputNumber } from "antd";
import { ConfigProvider } from "antd";
import theme from "./componentTheme";
import { getGlobalStyle } from "@/api/api.js";
const App = (props, ref) => {
  useImperativeHandle(ref, () => {
    return {};
  });
  const [callShow, setCallShow] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [viewIndex, setViewIndex] = useState(0);
  const [checkEdArr, setCheckEdArr] = useState([]);
  const modal = [
    { value: "1", label: "1:1" },
    { value: "2", label: "3:2" },
    { value: "3", label: "5:4" },
    { value: "4", label: "7:4" },
    { value: "custom", label: "自定义" },
  ];
  const [styleList, setStyleList] = useState([]);
  const [modalVal, setModalVal] = useState(modal);
  const [checkItem, setCheckItem] = useState([]);
  const [tabs, setTabs] = useState([]);
  const changeTab = (index) => {
    setTabIndex(index);
  };
  const viewChange = (val) => {
    setViewIndex(val);
  };
  // 获取全局风格
  const getMjStyle = () => {
    getGlobalStyle().then((res) => {
      res.data.dictList.forEach((item) => {
        item.list.forEach((val) => {
          val.checkEd = false;
        });
      });
      let dataList = res.data.dictList;
      let newArr = dataList.map((item) => item.list);
      setStyleList(newArr);
      //  提取style类型
      let typeList = dataList.map((item, index) => ({
        label: item.type,
        key: index,
      }));
      setTabs(typeList);
    });
  };
  const changeStyleTab = (index) => {
    console.log(index);
    setTabIndex(index);
  };
  // 选择提示词
  const changeCheck = (index) => {
    let valItem = styleList[tabIndex][index];
    valItem.checkEd = !valItem.checkEd;
    if (valItem.checkEd) {
      if (typeof checkEdArr[tabIndex] == "undefined") {
        checkEdArr[tabIndex] = [];
      }
      checkEdArr[tabIndex].push(valItem);
    } else {
      console.log(valItem, "勾选的");
      checkEdArr[tabIndex].forEach((item, index) => {
        if (valItem.value == item.value) {
          checkEdArr[tabIndex].splice(index,1)
        }
      });
    }
    setCheckEdArr([...checkEdArr]);
    setStyleList([...styleList]);
  };
  // 删除左侧
  const delItem = (val, index) => {
    checkEdArr[tabIndex].splice(index, 1);
    styleList[tabIndex].forEach((item) => {
      if (item.value == val.value) {
        item.checkEd = false;
      }
    });
    setCheckEdArr([...checkEdArr]);
    setStyleList([...styleList]);
  };
  // 取消
  const cancelItem  = ()=>{
    setTabIndex(0)
    setCheckEdArr([])
    // styleList 是二维数组
    styleList.flat(2).forEach((item,index)=>{
      item.checkEd = false
    })
    setStyleList([...styleList])
    setCallShow(false)
  }
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
              <Tabs
                defaultActiveKey={tabIndex}
                items={tabs}
                onChange={changeStyleTab}
              />
              <div className={style.tabsModalContent}>
                {styleList[tabIndex].map((item, index) => (
                  <div className={style.modalItem}>
                    <div className={style.left}>
                      <Checkbox
                        onChange={() => changeCheck(index)}
                        value={item.label}
                        checked={item.checkEd}></Checkbox>
                    </div>
                    <div className={style.right}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>  
            <div className={style.btnBoxBottom}>
              <div className={style.cancle} onClick={cancelItem}>
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
                {checkEdArr[tabIndex] &&
                  checkEdArr[tabIndex].map((item, index) => (
                    <div className={style.btnContItem} key={index}>
                      <div onClick={() => delItem(item, index)}>
                        <img src={Rubbish} alt='' />
                      </div>
                      <div className={style.name}>{item.label}</div>
                    </div>
                  ))}
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
export default forwardRef(App);
