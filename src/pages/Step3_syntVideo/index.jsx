import BackBar from "@/components/backBar";
import style from "./index.module.less";
import Next from "/public/assets/next.png";
import ClearTye from "/public/assets/clearEye.png";
import creatRight from "/public/assets/createRight.png";
import createDown from "/public/assets/createDown.png";
import createSet from "/public/assets/createSet.png";
import ModelSet from "/public/assets/modelSet.png";
import Ques from "/public/assets/ques.png";
import theme from "./componentTheme";
import delOften from "/public/assets/delOften.png";
import addFrame from "/public/assets/addFrame.png";
import lessFrame from "/public/assets/lessFrame.png";

import {
  Tabs,
  Switch,
  Collapse,
  Checkbox,
  Progress,
  Table,
  ConfigProvider,
  Select,
  Slider,
  InputNumber,
  message,
  Spin,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { convertFileSrc } from "@tauri-apps/api/tauri";

// 导入配音文件
import styleDub from "../../../public/dubData/style"; //风格
import voicesDub from "../../../public/dubData/voices"; //音色
import roleDub from "../../../public/dubData/role"; //角色
import rateDub from "../../../public/dubData/rate"; //语速
import pitchDub from "../../../public/dubData/pitch"; //语调

import {
  getVideoProgress,
  generateVideo,
  getVoice,
  getVideoDetail,
  generateAudio,
  generateAllFrame,
  pushAloneVideoFrame,
  generateAudioOne,
  manualRewrite,
} from "@/api/api";
const { Option } = Select;
function getImageUrl(name) {
  return new URL(`../../assets/${name}.png`, import.meta.url).href;
}
import { getVioceData } from "@/func";
export default () => {
  const { Panel } = Collapse;
  // 用来存放复现check选中的任务
  let reCheckIds = [];
  const go = useNavigate();
  const params = useLocation();
  const [voiceData, setVoiceData] = useState({});

  const [spinging, setSpinging] = useState(false);
  const [showComp, setShowComp] = useState(1);
  const [offtenArr, setOfftenArr] = useState([]);
  // 用户手动重写
  const [userWriteText, setUserWriteText] = useState("");
  const [detial, setDetial] = useState();
  const [show, setShow] = useState(false);
  const [paramsData, setParamsData] = useState(params.state);
  var { draftIds, modelType } = params;
  // 关键帧数据
  const [keyFramesList, setkeyFramesList] = useState([
    {
      name: "由大到小",
      value: [1, 0].join(","),
      checked: false,
    },
    {
      name: "由小到大",
      value: [0, 1].join(","),
      checked: false,
    },
    {
      name: "由左到右",
      value: [4, 5].join(","),
      checked: false,
    },
    {
      name: "由右到左",
      value: [5, 4].join(","),
      checked: false,
    },
    {
      name: "由上到下",
      value: [6, 7].join(","),
      checked: false,
    },
    {
      name: "由下到上",
      value: [7, 6].join(","),
      checked: false,
    },
  ]);
  const DomStyle = {
    color: "white",
    background: "#1755FF",
  };
  const [checkFrame, setCheckFrame] = useState([]);
  const [state, setState] = useState([
    { id: 1, name: "shrek" },
    { id: 2, name: "fiona" },
  ]);
  const [voiceSetting, setVoiceSetting] = useState({
    name: "", //配音师，
    nameData: [], //配音师数组
    pitch: 1, //语调
    rate: 1, //语速
    role: "", //角色
    roleData: [], //角色数组
    style: "", //风格
    styleData: [], //风格数组
  });
  // 点击音色后获取该音色下的角色与风格
  const setVoice = (item, index) => {
    console.log(item);
    voiceSetting.name = item.name;
    voiceSetting.roleData = item.roles ?? [];
    voiceSetting.styleData =
      voiceSetting.nameData.find((item) => item.name == voiceSetting.name)
        .styles ?? [];
    setVoiceSetting({ ...voiceSetting });
  };
  // 点击角色
  const setRole = (item, index) => {
    voiceSetting.role = item.value;
    setVoiceSetting({ ...voiceSetting });
  };
  // 点击风格
  const setStyle = (item, index) => {
    voiceSetting.style = item.value;
    setVoiceSetting({ ...voiceSetting });
  };
  // 点击语速
  const setRate = (item, index) => {
    voiceSetting.rate = item.value;
    setVoiceSetting({ ...voiceSetting });
  };
  // 点击语调
  const setPitch = (item, index) => {
    voiceSetting.pitch = item.value;
    setVoiceSetting({ ...voiceSetting });
  };
  // 处理子元素排序后的回调函数
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setCheckFrame((prevItems) => {
      const newItems = [...prevItems];
      const [removed] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, removed);
      return newItems;
    });
  };
  // 创建可排序的子项组件
  const SortableItem = SortableElement(({ value, index }) => (
    <div className={style.leftItem}>
      <div className={style.drag}>
        <img src={getImageUrl("drg")} alt='' />
      </div>
      <div className={style.icon}>
        <img src={getImageUrl("001")} alt='' />
        {value.name}
      </div>
    </div>
  ));
  // 创建可排序的父容器组件
  const SortableList = SortableContainer(({ items }) => (
    <div>
      {items &&
        items.map((value, index) => (
          <SortableItem key={`item-${index}`} index={index} value={value} />
        ))}
    </div>
  ));

  const doFrame = () => {
    setCheckFrame([])
    setShow(!show);
  };

  function getVoices() {
    voiceSetting.nameData = getVioceData();
    console.log('只洗过了',voiceSetting.nameData);
    setVoiceSetting({ ...voiceSetting });
  }
  const getDetial = () => {
    getVideoDetail(paramsData)
      .then(({ data }) => {
        data.draftList.forEach((element) => {
          // 关键帧数据
          // element.keyFrameList = JSON.parse(JSON.stringify(keyFramesList));
          element.checked = true;
          element.storyboardList.forEach((item) => {
            item.keyFrameStyle = item.keyFrameStyle.toString();
            item.spinning = false;
            // item.keyFrameStyleList = [...keyFramesList] //断开引用地址
            if (item.soundPath) {
              item.soundPath = convertFileSrc(item.soundPath);
            }
            // 设置原图地址
            item.orignImagePath = convertFileSrc(item.orignImagePath);
            // 设置仿图图片地址
            if (item.currentImageList && item.currentImageList.length != 0) {
              item.currentImage = convertFileSrc(
                item.currentImageList[item.currentImageIndex ?? 0]
              );
            }
            // // 设置历史记录图片地址
            // if (item.historyImageList && item.historyImageList.length != 0) {
            //   item.historyImageList.forEach((val, index) => {
            //     item.historyImageList[index] = convertFileSrc(
            //       item.historyImageList[index]
            //     );
            //   });
            // }
          });
        });
        console.log(data.draftList, "数据-----");
        // 用来存放复现check选中的任务
        if (reCheckIds.length !== 0) {
          data.draftList.forEach((item) => {
            if (reCheckIds.includes(item.draftId)) {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
        }
        setDetial(data.draftList);
      })
  };
  const getProgress = async (draftId) => {
    return await getVideoProgress({ draftId });
  };
  // 用户手动重写
  const changeTextArea = (val, record) => {
    // setUserWriteText(record.rewriteText)
    record.rewriteText = val;
    setDetial([...detial]);
  };
  // 失去焦点
  const blurTextArea = (record) => {
    // 判断用户是否改动过分镜的重写数据
    if (userWriteText == record.rewriteText) {
      return;
    }
    manualRewrite({
      paragraphId: record.id,
      rewriteText: record.rewriteText,
    })
      .then((res) => {
        console.log(res, "用户失去焦点");
        message.success("已更新重写数据！");
        setUserWriteText("");
      })
      .finally(() => {
        getDetial();
      });
  };
  // 生成音频接口
  const createAio = (draftIds) => {
    console.log(voiceSetting, "生成音频===");
    setSpinging(true);
    // 用户不带的不选择参数
    let dataObj = {};
    for (let key in voiceSetting) {
      // 去除数据中的数据数组
      if (voiceSetting[key] && !Array.isArray(voiceSetting[key])) {
        dataObj[key] = voiceSetting[key];
      }
    }

    generateAudio({
      draftIds,
      ...dataObj,
      // modelType: paramsData.modelType,
    })
      .then((res) => {
        console.log(res, "音频数据");
        if (res.code == 200) {
          message.success("音频生成成功！");
          // 重新设置常用音频
          let strageData = localStorage.getItem("offtenVoice");
          if (strageData) {
            let offtenVoice = JSON.parse(strageData);
            if (offtenVoice) {
              // 常用音色保留3个
              if (offtenVoice.length == 3) {
                offtenVoice.shift();
              }
              offtenVoice.push(voiceSetting);
              localStorage.setItem("offtenVoice", JSON.stringify(offtenVoice));
            }
          } else {
            localStorage.setItem("offtenVoice", JSON.stringify([voiceSetting]));
          }
          for (let key in voiceSetting) {
            if(key!=='nameData'){
              voiceSetting[key] = undefined;
            } 
          }
          console.log(voiceSetting,'遍历后的');
          setVoiceSetting({ ...voiceSetting });
          getOfftenVoice();
        }
        console.log(res, "生成音频接口数据");
      })
      .finally(() => {
        getDetial();
        setSpinging(false);
      });
  };
  // 生成音频接口
  const createAudio = () => {
    let checkEdList = detial.filter((item) => item.checked);
    console.log(checkEdList, "????");
    let draftIds = checkEdList.map((item) => item.draftId);
    if (checkEdList.length == 0) {
      return message.info("至少选择一条草稿！");
    }
    if (!voiceSetting.name) {
      return message.info("请选择一条音色！");
    }
    message.info("开始生成音频！");
    reCheckIds = draftIds;
    createAio(draftIds);
  };
  // 单独重新生成音频
  const resetVoice = (record) => {
    message.info("开始重新配音！");
    let dataObj = {};
    for (let key in voiceSetting) {
      console.log(voiceSetting[key], "???");
      if (voiceSetting[key]) {
        dataObj[key] = voiceSetting[key];
      }
    }
    generateAudioOne({
      paragraphId: record.id,
      ...dataObj,
    })
      .then((res) => {
        console.log(res, "重新生成");
        if (res.code == 200) {
          message.success("重新配音成功");
        }
        for (let key in voiceSetting) {
          voiceSetting[key] = "";
        }
        setVoiceSetting({ ...voiceSetting });
      })
      .finally(() => {
        getDetial();
      });
  };
  const columns = [
    {
      title: "编号",
      dataIndex: "index",
      width: 40,
      // align: "center",
      fixed: "left",
      render: (text, record, index) => (
        <div className={style.codeNumer}>
          <div>{index + 1}</div>
        </div>
      ),
    },
    {
      title: "原图",
      align: "center",
      dataIndex: "orignImagePath",
      fixed: "left",
      width: 180,
      render: (val) => {
        return <img src={val} alt='' className={style.tableImg} />;
      },
    },
    {
      title: "本镜文案",
      dataIndex: "rewriteText",
      width: 190,
      render: (val, record) => {
        return (
          <div className={style.TableTextBox}>
            <Tooltip title='可以手动输入进行自定义文案'>
              <textarea
                resize='none'
                value={val}
                onChange={(e) => changeTextArea(e.target.value, record)}
                onFocus={() => setUserWriteText(val)}
                onBlur={() => blurTextArea(record)}
                style={{
                  maxHeightheight: "95%",
                  overflowY: "scroll",
                }}></textarea>
            </Tooltip>
          </div>
        );
      },
    },

    {
      title: "配音",
      dataIndex: "soundPath",
      width: 180,
      align: "center",
      render: (val, record) => {
        return (
          <div>
            {val ? (
              <div className={style.audioBox}>
                <audio
                  controls
                  src={val}
                  style={
                    {
                      width: "140px",
                    }
                  }></audio>
                <div onClick={() => resetVoice(record)}>重新配音</div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        );
      },
    },
    // currentImageIndex
    {
      title: "仿图",
      dataIndex: "currentImage",
      fixed: "left",
      align: "center",
      width: 180,
      render: (val) => {
        return <img src={val} alt='' className={style.tableImg} />;
      },
    },
    {
      title: "关键帧",
      dataIndex: "keyFrameStyle",
      width: 180,
      align: "center",
      render: (val, record) => {
        return (
          <div className={style.selectFrame}>
            <Select
              style={{ width: "90%" }}
              value={val}
              onChange={(e) => changeAloneFrame(record, e)}>
              {keyFramesList.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        );
      },
    },
  ];
  const Header = ({ data, index }) => {
    const changeCheckBox = (e) => {
      e.stopPropagation();
      detial[index].checked = !detial[index].checked;
      setDetial([...detial]);
    };
    return (
      <div className={style.tableHead}>
        <div className={style.headOne}>
          <div>
            <div>
              <Checkbox
                checked={data.checked}
                onChange={(e) => changeCheckBox(e)}></Checkbox>
            </div>
            <img src={true ? creatRight : createDown} alt='' />
            <div>{data.draftName}</div>
          </div>
        </div>
        <div className={style.headTwo}>
          <Progress
            strokeColor={"#49AA19"}
            trailColor={"rgba(255, 255, 255, 0.08)"}
            percent={data.progress ?? 10}
            style={{
              width: "332px",
            }}></Progress>
          <div>
            <div
              className={style.statusCir}
              style={
                data.storyboardList[0].soundPath
                  ? {
                      background: "#49AA19",
                    }
                  : null
              }></div>
            {data.storyboardList[0].soundPath
              ? "已识别到音频路径"
              : "未识别到音频路径"}
          </div>
        </div>
      </div>
    );
  };
  const frameCheck = (item, index) => {
    keyFramesList[index].checked = !keyFramesList[index].checked;
    if (keyFramesList[index].checked) {
      checkFrame.push(item);
    } else {
      let index = checkFrame.findIndex(
        (val) => JSON.stringify(val) == JSON.stringify(item)
      );
      checkFrame.splice(index, 1);
    }
    setkeyFramesList([...keyFramesList]);
    setCheckFrame([...checkFrame]);
  };
  const changeNumber = (val) => {
    console.log(val);
  };

  const queeTask = (data, func) => {
    let idData = [];
    let index = 0;
    async function quee(res, rej) {
      let postData = await func(data[index]);
      ++index;
      console.log(data, "接口数据");
      if (index == data.length) {
        console.log(res, "ressssssssssssssssssssssssssss");
        return res({
          status: "done",
          postData,
        });
      } else {
        return quee(res, rej);
      }
    }
    return quee;
  };
  // 调用合成视频接口
  const createVio = (draftId) => {
    setSpinging(true);
    generateVideo({
      draftId,
      modelType: paramsData.modelType,
    })
      .then((res) => {
        if (res.code==200) {
          message.success("合成视频成功！");
        }
        getDetial();
      })
      .finally(() => {
        setSpinging(false);
      });
  };
  // 点击合成视频
  const goNextStep = () => {
    let checkEdList = detial.filter((item) => item.checked);
    if (checkEdList.length == 0) {
      return message.info("至少选择一条草稿！");
    }
    let result = checkEdList
      .map((item) => item.storyboardList)
      .flat(2)
      .every((item) => item.rewriteText && item.currentImage && item.soundPath);
    if (!result) {
      return message.error(
        "数据不可空，请完善仿图、配音、本镜文案后再进行合成视频！"
      );
    }
    message.info("开始进行视频合成！");
    let draftId = checkEdList.map((item) => item.draftId);
    reCheckIds = draftId;
    queeTask(draftId, createVio)(
      (res) => {
        console.log(res);
      },
      (rej) => {
        console.log(rej);
      }
    );
  };
  // 上一步
  const goBeforeStep = () => {
    // go("/Step2PushPicture", { state: params.state });
    history.back(-1);
  };
  // 关闭
  const closeFrame = () => {
    setShow(!show);
    setCheckFrame([]);
    keyFramesList.forEach((item) => (item.checked = false));
    setkeyFramesList([...keyFramesList]);
  };
  // 一键轮询关键帧
  const oneKeyFrame = () => {
    let checkEdList = detial.filter((item) => item.checked);
    let keyFrameList = checkFrame
      .map((item) => item.value)
      .map((item) => item.split(","));
    if (checkEdList.length == 0) {
      return message.info("至少选择一条草稿！");
    } else {
      message.info("开始进行关键帧轮询");
      let ids = checkEdList.map((item) => item.draftId);
      reCheckIds = ids;
      let fn = async (draftId) => {
        return await generateAllFrame({
          draftId,
          keyFrameList,
        });
      };
      console.log(ids);
      queeTask(
        ids,
        fn
      )((res) => {
        if (res.postData.code == 200) {
          message.success("应用关键帧成功！");
          setShow(false);
          getDetial();
        }
      });
    }
  };
  // 单独关键帧
  const changeAloneFrame = (data, val) => {
    console.log({ data, val });
    data.keyFrameStyle = val;
    setDetial([...detial]);
    pushAloneVideoFrame({
      storyboardId: data.id,
      keyframeStyle: val.split(","),
    }).then((res) => {
      console.log(res);
      getDetial();
      message.success("设置分镜关键帧成功");
    });
  };
  // 获取常用音色数据
  const getOfftenVoice = () => {
    let strageData = localStorage.getItem("offtenVoice");
    if (strageData) {
      let offtenVoice = JSON.parse(strageData);
      console.log(styleDub, "?");
      if (offtenVoice) {
        offtenVoice.forEach((item, index) => {
          console.log(item, "item");
          item.styleText =
            styleDub.find((val) => val.keyword == item.style)?.word ?? "--";
          item.nameText =
            voicesDub.find((val) => val.name == item.name)?.LocalName ?? "--";
          item.roleText =
            roleDub.find((val) => val.keyword == item.role)?.word ?? "--";
          item.rateText =
            rateDub.find((val) => val.value == item.rate)?.name ?? "--";
          item.pitchText =
            pitchDub.find((val) => val.value == item.pitch)?.name ?? "--";
        });
        console.log(offtenVoice, "常用数据");
        setOfftenArr(offtenVoice);
      }
    }
  };
  // 点击常用音色配置
  const offtenItemCk = (item) => {
    for (let key in voiceSetting) {
      voiceSetting[key] = item[key];
    }
    setVoiceSetting({ ...voiceSetting });
    getVoices()
  };
  // 删除常用音色
  const delOftenHandle = (index, event) => {
    event.stopPropagation();
    offtenArr.splice(index, 1);
    localStorage.setItem("offtenVoice", JSON.stringify(offtenArr));
    setOfftenArr([...offtenArr]);
    getVoices()
  };

  function defaultSpeaker() {
    return {
      id: "",
      category: "",
      avatar: "",
      isFree: false,
      isStar: false,
      isSupper24K: false,
      roles: [],
      styles: [],
      name: "",
      displayName: "",
    };
  }
  useEffect(() => {
    // voiceSetting.nameData = getVioceData();
    // console.log(voiceSetting.nameData, "123456789");
    // setVoiceSetting({ ...voiceSetting });
    getVoices();
    getOfftenVoice();
    getDetial();
  }, []);
  return (
    <ConfigProvider
      theme={{
        ...theme,
      }}>
      <div className={style.box}>
        <BackBar></BackBar>

        <div className={style.titleBox}>
          <div className={style.step}>
            <div>视频抽帧</div>
            <img src={Next} alt='' />
            <div>反推生图</div>
            <img src={Next} alt='' />
            <div className={style.stepKey}>合成视频</div>
          </div>
          <div className={style.stepHandle}>
            <div className={style.frame} onClick={goBeforeStep}>
              上一步
            </div>
            <div className={style.frame} onClick={goNextStep}>
              合成视频
            </div>
          </div>
        </div>
        <div className={style.tabBox}>
          <div className={style.tabContent}>
            <div className={style.bottomContent}>
              <div className={style.left}>
                <div className={style.leftContent}>
                  <div className={style.title}>
                    <img src={ModelSet} alt='' />
                    配音配置
                  </div>
                  <div className={style.offten}>
                    {offtenArr.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={style.offtenItem}
                          onClick={() => offtenItemCk(item)}>
                          <a className={style.itemWord} title={item.nameText}>
                            {item.nameText}
                          </a>
                          <a className={style.itemWord} title={item.roleText}>
                            {item.roleText}
                          </a>
                          <a className={style.itemWord} title={item.styleText}>
                            {item.styleText}
                          </a>
                          <a className={style.itemWord} title={item.rateText}>
                            {item.rateText}
                          </a>
                          <a className={style.itemWord} title={item.pitchText}>
                            {item.pitchText}
                          </a>
                          <img
                            src={delOften}
                            alt=''
                            onClick={(e) => delOftenHandle(index, e)}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className={style.setItem2}>
                    <div className={style.title}>音色</div>
                    <div className={style.voiceItemContent}>
                      {voiceSetting.nameData&&voiceSetting.nameData.map((item, index) => {
                        return (
                          <div
                            onClick={() => setVoice(item, index)}
                            key={index}
                            style={
                              voiceSetting.name === item.name ? DomStyle : null
                            }
                            className={style.voiceItem}>
                            {item.displayName}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className={style.setItem2}>
                    <div className={style.title}>角色</div>
                    {voiceSetting.roleData&&voiceSetting.roleData.length !== 0 &&
                      voiceSetting.roleData[0].value && (
                        <div className={style.voiceItemContent}>
                          {voiceSetting.roleData.map((item, index) => {
                            return (
                              <a
                                title={item.word}
                                onClick={() => setRole(item, index)}
                                style={
                                  voiceSetting.role === item.value
                                    ? DomStyle
                                    : null
                                }
                                key={index}
                                className={style.voiceItem}>
                                {item.label}
                              </a>
                            );
                          })}
                        </div>
                      )}
                  </div>
                  <div className={style.setItem2}>
                    <div className={style.title}>风格</div>
                    {voiceSetting.styleData&&voiceSetting.styleData.length != 0 &&
                      voiceSetting.styleData[0].value && (
                        <div className={style.voiceItemContent}>
                          {voiceSetting.styleData.map((item, index) => {
                            return (
                              <a
                                key={index}
                                title={item.word}
                                onClick={() => setStyle(item, index)}
                                style={
                                  voiceSetting.style === item.value
                                    ? DomStyle
                                    : null
                                }
                                className={style.voiceItem}>
                                {item.label}
                              </a>
                            );
                          })}
                        </div>
                      )}
                  </div>
                  <div className={style.setItem2}>
                    <div className={style.title}>语速</div>
                    <div className={style.voiceItemContent}>
                      {rateDub.map((item, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => setRate(item, index)}
                            style={
                              voiceSetting.rate === item.value ? DomStyle : null
                            }
                            className={style.voiceItem}>
                            {item.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={style.setItem2}>
                    <div className={style.title}>语调</div>
                    <div className={style.voiceItemContent}>
                      {pitchDub.map((item, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => setPitch(item, index)}
                            style={
                              voiceSetting.pitch === item.value
                                ? DomStyle
                                : null
                            }
                            className={style.voiceItem}>
                            {item.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.right}>
                <div className={style.options}>
                  <div className={style.optionsL}>
                    <div>视频草稿</div>
                    <div className={style.circle}>{detial?.length}</div>
                  </div>
                  <div className={style.optionsR}>
                    {/* <div>
                      <img src={ClearTye} alt='' />
                      自动识别音频路径
                    </div> */}
                    <div onClick={createAudio}>生成音频</div>
                    <div onClick={doFrame}>一键关键帧</div>
                  </div>
                </div>
                {show && (
                  <div className={style.modalBox}>
                    <div className={style.modalTitle}>关键帧序列</div>
                    <div className={style.modalContent}>
                      <div className={style.contentLeft}>
                        <div>
                          <SortableList
                            items={checkFrame}
                            onSortEnd={onSortEnd}
                            axis='y'></SortableList>
                        </div>
                      </div>
                      <div className={style.contentRight}>
                        <div>
                          {keyFramesList.map((item, index) => (
                            <div className={style.rightItem} key={item.name}>
                              <div className={style.one}>
                                {/* <Checkbox
                                  onChange={() => frameCheck(index)}
                                  checked={item.checked}></Checkbox> */}
                                {
                                  <img
                                    src={item.checked ? lessFrame : addFrame}
                                    onClick={() => frameCheck(item, index)}
                                  />
                                }
                              </div>
                              <div className={style.two}>
                                <img src={getImageUrl(item.img)} alt='' />
                                <span>{item.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className={style.btnBox}>
                      <div className={style.btn1} onClick={closeFrame}>
                        <div>关闭</div>
                      </div>
                      <div className={style.btn2}>
                        <div onClick={oneKeyFrame}>应用轮循</div>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className={style.Collapse}
                  style={{
                    marginTop: "28px",
                  }}>
                  {/* <Spin spinning={spinging}> */}
                    <Collapse
                      expandIcon={() => null}
                      showArrow={false}
                      style={{
                        color: "white",
                      }}>
                      {detial &&
                        detial?.map((item, index) => (
                          <Panel
                            key={item.draftId}
                            header={
                              <Header data={item} index={index}></Header>
                            }>
                            <Table
                              pagination={false}
                              rowKey='id'
                              dataSource={item.storyboardList}
                              columns={columns}></Table>
                          </Panel>
                        ))}
                    </Collapse>
                  {/* </Spin> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};
