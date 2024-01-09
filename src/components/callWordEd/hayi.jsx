// 海艺版本
import { useEffect, useState } from "react";
import style from "./index.module.less";
import { Tabs, Collapse, ConfigProvider, Button, message } from "antd";
import theme from "./componentTheme";
import { savePrompt } from "@/api/api";
const App = (props) => {
  const [item, setItem] = useState([]);
  const [content, setContent] = useState([]);
  const [panel, setPanel] = useState([]);
  //输出
  const [outPut, setOutPut] = useState([]);
  const [inPut, setInPut] = useState([]);
  const [inputText, setInputText] = useState("");
  const [option, setOption] = useState({
    normal: [],
    style: [],
    quality: [],
  });
  const tabsItem = [
    {
      label: "质量",
      key: "1",
    },
    {
      label: "绘画",
      key: "2",
    },
    {
      label: "效果",
      key: "3",
    },
    {
      label: "外貌",
      key: "4",
    },
    {
      label: "作品",
      key: "5",
    },
  ];
  const setConcat = ()=>{
     let newVal = inPut.concat(outPut)  
     setOutPut(newVal)
  }
  const getJson = async () => {
    return await fetch("/public/json/promot.json")
      .then((res) => res.json())
      .then((res) => {
        setContent((val) => {
          let content = Object.values(res);
          content.forEach((item) => (item.checked = true));
          let data = content.filter((item) => item.subType == "quality");
          setItem(data);
          // 提示词数据返显
          if (
            props.record.reverseInference &&
            props.record.reverseInference.length != 0
          ) {
            props.record.reverseInference.split(",").forEach((data) => {
              content.forEach((val) => {
                if (data == val.text) {
                  option[val.subType].push(val);
                  setOption((res) => {
                    let outVal = Object.values(option).flat(2);
                    setOutPut(outVal);
                    return { ...option };
                  });
                } else {
                  //json文件不存在的数据就push到input中检测产生的重复数据
                  let value = JSON.stringify({
                    text: data,
                    checked: true,
                    lang: data,
                  });
                  if (!inPut.includes(value)) {
                    inPut.push(value);
                  }
                  // 有奇怪报错  加个判断
                  let newInput = inPut.map((item) => {
                    if (typeof item == "string") {
                      return JSON.parse(item);
                    } else {
                      return item;
                    }
                  });
                  setInPut(newInput);
                  setOutPut((res) => {
                    return [...newInput, ...outPut];
                  });
                }
              });
            });
          }
          return content;
        });
      });
  };
  //点击itme
  const ckItem = (val, index) => {
    console.log(val, "val---");
    if (val.subType == "normal") {
      option.normal.push(val);
    }
    if (val.subType == "style") {
      option.style.push(val);
    }
    if (val.subType == "quality") {
      option.quality.push(val);
    }
    let arr1 = Object.values(option).flat(2);
    let arr2 = arr1.concat(inPut);
    // 判断是否详情进来outPut已经有数据
    // if (outPut.length > 0) {
    //   setOutPut(arr2);
    // } else {
      setOutPut(arr1);
    // }
    setOption({ ...option });
  };
  // Input 输入配置词汇
  const changeInput = (e) => {
    // console.log(e.nativeEvent.data);
  };
  const blurInput = () => {

  };
  // 开启或者禁用
  const enOrdis = (props, type) => {
    option[type][props.index].checked = !option[type][props.index].checked;
    for (let index in outPut) {
      if (!option[type][props.index].checked) {
        if (JSON.stringify(outPut[index]) == JSON.stringify(props.item)) {
          outPut[index].checked = false;
          break;
        }
      } else {
        outPut[index].checked = true;
        break;
      }
    }
    setOutPut([...outPut]);
    setOption({ ...option });
  };
  //切换tabs
  const changeTabs = (e) => {
    switch (e) {
      // 质量
      case "1":
        {
          let data = content.filter(
            (item) => item.subType && item.subType == "quality"
          );
          console.log(data);
          setItem(data);
        }
        break;
      // 绘画
      case "2":
        {
          let data = {};
          data.style = content.filter(
            (item) => item.t && item?.t.includes("style")
          );
          setItem(data);
          // 设置容貌下的 子分类
          setPanel(["style"]);
          setItem(data);
        }
        break;
      // 效果
      case "3":
        {
          let data = content.filter(
            (item) => item.subType && item.subType == "style"
          );
          setItem(data);
        }
        break;
      // 外貌
      case "4":
        {
          let data = {};
          data.hair = content.filter(
            (item) => item.t && item?.t.includes("hair")
          );
          data.headwear = content.filter(
            (item) => item.t && item?.t.includes("headwear")
          );
          data.eyes = content.filter(
            (item) => item.t && item?.t.includes("eyes")
          );
          data.ear = content.filter(
            (item) => item.t && item?.t.includes("ear")
          );
          data.expression = content.filter(
            (item) => item.t && item?.t.includes("expression")
          );
          // 设置容貌下的 子分类
          setPanel(["hair", "headwear", "eyes", "ear", "expression"]);
          setItem(data);
        }
        break;
      // 外貌
      case "5":
        {
          let data = {};
          data.form = content.filter(
            (item) => item.t && item?.t.includes("form")
          );
          data.perspective = content.filter(
            (item) => item.t && item?.t.includes("perspective")
          );
          data.camera = content.filter(
            (item) => item.t && item?.t.includes("camera")
          );
          // 设置容貌下的 子分类
          setPanel(["form", "perspective", "camera"]);
          setItem(data);
        }
        break;
      default:
        break;
    }
  };
  // 点击保存
  const save = () => {
    // 展平3种类型的数组并筛选出未禁用的数据块进行字符串化
    let arr1 = Object.values(option)
      .flat(2)
      .filter((item) => item.checked == true)
      .map((item) => item.text);
    let data = {
      storyboardId: props.record.id,
      prompt: arr1.toString(),
    };
    savePrompt(data).then((res) => {
      console.log(res, "保存提示词");
      message.success("保存成功！");
      props.getDetial();
      props.close();
    });
  };
  useEffect(() => {
    // 返显提示词数据
    console.log(props.record.reverseInference, "返显提示词");
    getJson();
    setConcat()
  }, []);
  return (
    <ConfigProvider theme={{ ...theme }}>
      <div className={style.box}>
        <div className={style.boxTop}>
          <div className={style.left}>
            <div className={style.item}>
              <div className={style.itemTitle}>Input</div>
              <div className={style.itemContent}>
                <textarea
                  cols='30'
                  rows='10'
                  disabled
                  value={
                    inPut
                      .map((item) => {
                        if (item.checked) {
                          return item.text;
                        }
                      })
                      .filter(Boolean)
                      .toString() ?? ""
                  }></textarea>
              </div>
            </div>
            <div className={style.item}>
              <div className={style.itemTitle}>Ouput</div>
              <div className={style.itemContent} style={{
                marginTop:'30px'
              }}>
                <textarea
                  cols='30'
                  rows='10'
                  // 筛选出 输出文本数组中 checked==true 的文字 再过滤逗号后字符串化
                  value={
                    outPut
                      .map((item) => {
                        if (item.checked) {
                          return item.text;
                        }
                      })
                      .filter(Boolean)
                      .toString() ?? ""
                  }
                  readOnly
                  disabled></textarea>
              </div>
            </div>
          </div>
          <div className={style.center}>
            <div className={style.one}>
              <div className={style.itemTitle}>普通</div>
              <div className={style.itemContent}>
                {option.normal.map((item, index) => (
                  <div
                    className={style.itemBox}
                    style={
                      !item.checked
                        ? {
                            background: "black",
                            color: "#eaecf4",
                          }
                        : null
                    }
                    key={index}
                    onClick={() => enOrdis({ item, index }, "normal")}>
                    <div className={style.boxLeft}>{item.text}</div>
                    <div className={style.boxRight}>
                      {item.lang ?? item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={style.two}>
              <div className={style.itemTitle}>风格</div>
              <div className={style.itemContent}>
                {option.style.map((item, index) => (
                  <div
                    className={style.itemBox}
                    key={index}
                    style={
                      !item.checked
                        ? {
                            background: "red !important",
                            color: "#eaecf4",
                          }
                        : null
                    }
                    onClick={() => enOrdis({ item, index }, "style")}>
                    <div className={style.boxLeft}>{item.text}</div>
                    <div className={style.boxRight}>
                      {item.lang ?? item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={style.three}>
              <div className={style.itemTitle}>质量</div>
              <div className={style.itemContent}>
                {option.quality.map((item, index) => (
                  <div
                    className={style.itemBox}
                    key={index}
                    style={
                      !item.checked
                        ? {
                            background: "black",
                            color: "#eaecf4",
                          }
                        : null
                    }
                    onClick={() => enOrdis({ item, index }, "quality")}>
                    <div className={style.boxLeft}>{item.text}</div>
                    <div className={style.boxRight}>
                      {item.lang ?? item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={style.right}>
            <Tabs items={tabsItem} onChange={changeTabs}></Tabs>
            <div className={style.rightItem}>
              {Array.isArray(item) &&
                item.map((val, index) => {
                  return (
                    <div
                      className={style.tab1}
                      key={index}
                      onClick={() => ckItem(val, index)}>
                      <div className={style.boxLeft}>{val.text}</div>
                      <div className={style.boxRight}>
                        {val.lang ?? val.text}
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className={style.Collapse}>
              {!Array.isArray(item) && (
                <Collapse>
                  {panel.map((val, index) => {
                    return (
                      <Collapse.Panel header={val}>
                        {item[val].map((value, indexs) => {
                          return (
                            <div
                              className={style.tab1}
                              key={indexs}
                              onClick={() => ckItem(value, indexs)}>
                              <div className={style.boxLeft}>{value.text}</div>
                              <div className={style.boxRight}>
                                {value.lang ?? value.text}
                              </div>
                            </div>
                          );
                        })}
                      </Collapse.Panel>
                    );
                  })}
                </Collapse>
              )}
            </div>
          </div>
        </div>
        <div className={style.btnBox}>
          <Button type='primary' onClick={props.close}>
            取消
          </Button>
          <Button type='primary' onClick={save}>
            保存
          </Button>
        </div>
      </div>
    </ConfigProvider>
  );
};
export default App;
