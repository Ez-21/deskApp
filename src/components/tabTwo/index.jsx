import style from "./index.module.less";
import ModalAdd from "/public/assets/modelAdd.png";
import ModelSet from "/public/assets/modelSet.png";
import Rubbish from "/public/assets/rubbish.png";
import Ques from "/public/assets/ques.png";
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Select, Tabs, Checkbox, InputNumber, Button } from "antd";
import { ConfigProvider } from "antd";
import theme from "./componentTheme";
import { getGlobalStyle } from "@/api/api.js";
const App = (props, ref) => {
  const [callShow, setCallShow] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [viewIndex, setViewIndex] = useState(0);
  const [checkEdArr, setCheckEdArr] = useState([]);
  const [sizeDisable, setSizeDisable] = useState(true);
  const size = [
    { value: "--ar 1:1", label: "1:1" },
    { value: "--ar 3:2", label: "3:2" },
    { value: "--ar 5:4", label: "5:4" },
    { value: "--ar 7:4 ", label: "7:4" },
    { value: "自定义", label: "" },
  ];
  const [styleList, setStyleList] = useState([]);
  const [sizeList, setSizeList] = useState(size);
  const [checkItem, setCheckItem] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [modelList, setmodelList] = useState([
    { label: "V1", value: "--v 1" },
    { label: "V2", value: "--v 2" },
    { label: "V3", value: "--v 3" },
    { label: "V4", value: "--v 4" },
    { label: "V5", value: "--v 5" },
  ]);
  // mj配置表单
  const [mjForm, setMjForm] = useState({
    draftIds: "",
    midjourneyGlobalStyle: [],
    midjourneyImageSize: "",
    height: "",
    width: "",
    midjourneyModel: "",
    currentImageIndex: "",
  });
  useImperativeHandle(ref, () => {
    return {
      mjForm,
    };
  });
  useEffect(() => {
    if (props.comData) {
      for (let key in props.comData) {
        mjForm[key] = props.comData[key];
      }
    }
  }, []);
  const changeTab = (index) => {
    setTabIndex(index);
  };
  const viewChange = (val) => {
    setViewIndex(val);
    mjForm.currentImageIndex = val;
    setMjForm({ ...mjForm });
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
      console.log(typeList, "类型");
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
          checkEdArr[tabIndex].splice(index, 1);
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
  // 选择模型
  const changeModel = (e) => {
    console.log(e);
    mjForm.midjourneyModel = e;
    setMjForm({ ...mjForm });
  };
  // 选择尺寸
  const changeSize = (e) => {
    console.log(e);
    if (e == "自定义") {
      setSizeDisable(false);
      mjForm.midjourneyImageSize = e;
    } else {
      setSizeDisable(true);
      mjForm.midjourneyImageSize = e;
      mjForm.width = "";
      mjForm.height = "";
    }
    setMjForm({ ...mjForm });
  };
  // 取消
  const cancelItem = () => {
    setTabIndex(0);
    setCheckEdArr([]);
    // styleList 是二维数组
    styleList.flat(2).forEach((item, index) => {
      item.checkEd = false;
    });
    setStyleList([...styleList]);
    setCallShow(false);
  };
  // 改变宽度
  const changeWidth = (e) => {
    console.log(e);
    mjForm.width = e;
    setMjForm({ ...mjForm });
  };
  // 改变高度
  const changeHeight = (e) => {
    console.log(e);
    mjForm.height = e;
    setMjForm({ ...mjForm });
  };
  //
  const setStyle = () => {
    // 设置风格 数据格式
    checkEdArr.forEach((item, index) => {
      if (item) {
        mjForm.midjourneyGlobalStyle.push({
          type: tabs[index].label,
          list: item,
        });
      }
    });
    // 判断是否设置了自定义宽高
    console.log(mjForm, "已选中的的");
    if (mjForm.width || mjForm.height) {
      mjForm.midjourneyImageSize = `--v ${mjForm.width}${
        mjForm.width && mjForm.height ? ":" : ""
      }${mjForm.height ?? ""}`;
    }
    console.log(mjForm, "提交表单");
    props.setMjStyleHandle();
  };
  useEffect(() => {
    getMjStyle();
  }, []);
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
                key={Math.random(0, 10)}
                onChange={changeStyleTab}
              />
            </div>
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
                // maxHeight: "232px",
                height: "160px",
                overflow: "scroll",
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
              <div className={style.selectLable}>
                {sizeList.find(
                  (item) => mjForm.midjourneyImageSize == item.value
                )?.label || ""}
              </div>
              <Select
                style={{
                  width: "90px",
                }}
                onChange={changeSize}
                value={mjForm.midjourneyImageSize}>
                {sizeList.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.value}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
          <div className={style.two}>
            <div
              style={{
                marginRight: "16px",
              }}>
              <span>宽度</span>
              <InputNumber
                disabled={sizeDisable}
                type='text'
                value={mjForm.width}
                onChange={changeWidth}
              />
            </div>
            <div>
              <span>高度</span>
              <InputNumber
                disabled={sizeDisable}
                type='text'
                value={mjForm.height}
                onChange={changeHeight}
              />
            </div>
          </div>
        </div>
        <div className={style.modalBox}>
          <div>
            选择模型
            <img src={Ques} alt='' />
          </div>
          <div className={style.select}>
            <Select
              options={modelList}
              onChange={changeModel}
              value={mjForm.midjourneyModel}></Select>
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
        <div className={style.setbBtnBox}>
          <Button type='primary' onClick={setStyle}>
            全局应用风格
          </Button>
        </div>
      </div>
    </ConfigProvider>
  );
};
export default forwardRef(App);
