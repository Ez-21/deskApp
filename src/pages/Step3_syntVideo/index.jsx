/*
 * @Author: w-qianzz 2275862144@qq.com
 * @Date: 2023-12-14 21:19:01
 * @LastEditors: w-qianzz 2275862144@qq.com
 * @LastEditTime: 2024-01-10 01:44:09
 * @FilePath: \quick\src\pages\Step3_syntVideo\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import BackBar from "@/components/backBar";
import style from "./index.module.less";
import Next from "@/assets/next.png";
import ClearTye from "@/assets/clearEye.png";
import creatRight from "@/assets/createRight.png";
import createDown from "@/assets/createDown.png";
import createSet from "@/assets/createSet.png";
import ModelSet from "@/assets/modelSet.png";
import Ques from "@/assets/ques.png";
import theme from "./componentTheme";
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
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import {
  getVideoProgress,
  generateVideo,
  getVoice,
  getVideoDetail,
  generateAudio,
  generateAllFrame,
  pushAloneVideoFrame,
} from "@/api/api";
const { Option } = Select;
function getImageUrl(name) {
  return new URL(`../../assets/${name}.png`, import.meta.url).href;
}
export default () => {
  const { Panel } = Collapse;
  const go = useNavigate();
  const params = useLocation();
  const [showComp, setShowComp] = useState(1);
  const [detial, setDetial] = useState();
  const [show, setShow] = useState(false);
  const [paramsData, setParamsData] = useState(params.state);
  var { draftIds, modelType } = params;
  const [voiceSetting, setVoiceSetting] = useState({
    soundModel: "",
    soundSpeed: "",
    volume: "",
  });
  const [voice, setVoice] = useState([
    {
      label: "中文普通话-云溪(男) ",
      value: "zh-CN-YunxiNeural",
    },
  ]);
  const changeVoice = (e) => {
    console.log(e);
    voiceSetting.soundModel = e;
    setVoiceSetting({ ...voiceSetting });
  };
  // 创建可排序的子项组件
const SortableItem = SortableElement(({ value,index }) => (
    <div className={style.leftItem} key={index}>
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
    {checkFrame&&checkFrame.map((value, index) => (
      <SortableItem key={`item-${index}`} index={index} value={value} />
    ))}
  </div>
));
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
  const [checkFrame, setCheckFrame] = useState([]);
  const [state, setState] = useState([
    { id: 1, name: "shrek" },
    { id: 2, name: "fiona" },
  ]);
  const doFrame = () => {
    setShow(!show);
  };
  const getVoiceHand = () => {
    getVoice().then((res) => {
      console.log(res, "音色数据");
      setVoice(res.data.list);
    });
  };

  const getDetial = () => {
    getVideoDetail(paramsData).then(({ data }) => {
      data.draftList.forEach((element) => {
        // 关键帧数据
        element.keyFrameList = JSON.parse(JSON.stringify(keyFramesList));
        element.checked = false;
        element.storyboardList.forEach((item) => {
          item.spinning = false;
          // 设置原图地址
          item.orignImagePath = item.orignImagePath
            .split("quick")[1]
            .replaceAll("\\", "/");
          // 设置仿图图片地址 sd为单张图  mj多张 所以进行数组判断
          if (item.currentImageList && item.currentImageList.length != 0) {
            if (Array.isArray(item.currentImageList)) {
              item.currentImageList.forEach((val, index) => {
                item.currentImageList[index] = item.currentImageList[index]
                  .split("quick")[1]
                  .replaceAll("\\", "/");
              });
            } else {
              item.currentImageList = item.currentImageList
                .split("quick")[1]
                .replaceAll("\\", "/");
            }
          }
          // 设置历史记录图片地址
          if (item.historyImageList && item.historyImageList.length != 0) {
            item.historyImageList.forEach((val, index) => {
              item.historyImageList[index] = item.historyImageList[index]
                .split("quick")[1]
                .replaceAll("\\", "/");
            });
          }
        });
      });
      console.log(data.draftList, "数据-----");
      setDetial(data.draftList);
    });
  };
  const getProgress = async (draftId) => {
    return await getVideoProgress({ draftId });
  };
  // 生成音频接口
  const createAio = (draftId) => {
    generateAudio({
      draftId,
      ...voiceSetting,
      modelType: paramsData.modelType,
    }).then((res) => {
      console.log(res, "生成音频接口数据");
    });
  };
  // 生成音频
  const createAudio = () => {
    let checkEdList = detial.filter((item) => item.checked);
    console.log(checkEdList, "????");
    let ids = checkEdList.map((item) => item.draftId);
    console.log(ids, "ids");
    if (checkEdList.length == 0) {
      return message.error("至少选择一条草稿！");
    }
    queeTask(
      ids,
      createAio
    )((res) => {
      console.log(res);
    });
  };
  const columns = [
    {
      title: "编号",
      dataIndex: "index",
      width: 80,
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
      dataIndex: "orignImagePath",
      width: 180,
      render: (val) => {
        return <img src={val} alt='' className={style.tableImg} />;
      },
    },
    {
      title: "本镜文案",
      dataIndex: "orignText",
      width: 180,
      render: (val) => {
        return <div className={style.TableTextBox}>{val}</div>;
      },
    },
    {
      title: "配音",
      dataIndex: "soundPath",
      width: 180,
      render: (val, record) => {
        return (
          <div>
            <audio
              controls
              src={val}
              style={{
                width: "120px",
              }}></audio>
          </div>
        );
      },
    },
    {
      title: "关键帧",
      dataIndex: "address",
      width: 180,
      render: (val, record) => {
        return (
          <div className={style.selectFrame}>
            <Select
              style={{ width: "90%" }}
              placeholder='请选择'
              onChange={() => changeAloneFrame(val, record)}>
              {keyFramesList.map((item, index) => (
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
            {data.storyboardList[0].soundPath ? "已识别到音频路径" : "未识别到音频路径"}
          </div>
        </div>
      </div>
    );
  };
  const onChange = (key) => {
    console.log(key);
  };
  const frameCheck = (index) => {
    keyFramesList[index].checked = !keyFramesList[index].checked;
    if (keyFramesList[index].checked) {
      checkFrame.push(keyFramesList[index]);
      console.log(checkFrame, " checkFrame数据");
    } else {
      checkFrame.splice(index, 1);
    }
    setkeyFramesList([...keyFramesList]);
    setCheckFrame([...checkFrame]);
  };
  const changeNumber = (val) => {
    console.log(val);
  };

  const onChangeSoundSpeed = (newValue) => {
    voiceSetting.soundSpeed = newValue;
    setVoiceSetting({ ...voiceSetting });
  };
  const onChangeVolume = (newValue) => {
    voiceSetting.volume = newValue;
    setVoiceSetting({ ...voiceSetting });
  };
  const queeTask = (data, func) => {
    let idData = [];
    let index = 0;
    async function quee(res, rej) {
      let postData = await func(data[index]);
      ++index;
      console.log(data, "接口数据");
      if (index == data.length) {
        return res({
          status: "done",
          postData,
        });
      } else {
        return quee();
      }
      // rej({
      //   status: "error",
      // });
    }
    return quee;
  };
  // 调用合成视频接口
  const createVio = (draftId) => {
    generateVideo({
      draftId,
      modeltype: paramsData.modelType,
    }).then(({ data }) => {
      console.log(data, "合成视频接口");
      if (data.id) {
        // draftId
        let progressData = getProgress(data.id);
        console.log(progressData, "合成视频进度");
      }
    });
  };
  // 点击合成视频
  const goNextStep = () => {
    let checkEdList = detial.filter((item) => item.checked);
    if (checkEdList.length == 0) {
      return message.error("至少选择一条草稿！");
    }
    let draftId = checkEdList.map((item) => item.draftId);
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
    // go("/Step1FrameNumber", { state: {} });
    history.back(-1);
  };
  // 关闭
  const closeFrame = () => {
    setShow(!show);
  };
  // 一键轮询关键帧
  const oneKeyFrame = () => {
    let checkEdList = detial.filter((item) => item.checked);
    console.log(checkEdList);
    let keyFrameList = checkFrame
      .map((item) => item.value)
      .map((item) => item.split(","));
    if (checkEdList.length == 0) {
      return message.error("至少选择一条草稿！");
    } else {
      let ids = checkEdList.map((item) => item.draftId);
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
  const changeAloneFrame = (val, data) => {
    console.log(123456);
    pushAloneVideoFrame({
      storyboardId: data.id,
      keyframeStyle: undefined,
    }).then((res) => {
      console.log(res);
    });
  };
  useEffect(() => {
    getVoiceHand();
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
            <div>反应生图</div>
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
                <div>
                  <div>
                    <div className={style.title}>
                      <img src={ModelSet} alt='' />
                      配音配置
                    </div>
                    <div className={style.setItem1}>
                      <div className={style.title}>
                        音色设置
                        <img src={Ques} alt='' />
                      </div>
                      <Select
                        placeholder='请选择'
                        value={voiceSetting.soundModel}
                        style={{
                          width: "60%",
                        }}
                        onChange={changeVoice}>
                        {voice.map((item) => {
                          return (
                            <Select.Option key={item.value} value={item.value}>
                              {item.label}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </div>
                    <div className={style.setItem2}>
                      <div className={style.title}>
                        音速
                        <img src={Ques} alt='' />
                      </div>
                      <div className={style.slider}>
                        <Slider
                          onChange={onChangeSoundSpeed}
                          value={voiceSetting.soundSpeed}
                          min={20}
                          max={40}
                          defaultValue={voiceSetting.soundSpeed}></Slider>
                        <InputNumber
                          min={20}
                          max={40}
                          defaultValue={voiceSetting.soundSpeed}
                          style={{
                            margin: "0 16px",
                          }}
                          step={0.01}
                          placeholder='请选择'
                          value={voiceSetting.soundSpeed}
                          onChange={onChangeSoundSpeed}></InputNumber>
                      </div>
                    </div>
                    <div className={style.setItem2}>
                      <div className={style.voice}>
                        音量
                        <Switch />
                      </div>
                      <div className={style.slider}>
                        <Slider
                          onChange={onChangeVolume}
                          step={0.01}
                          value={voiceSetting.volume}
                          min={0}
                          max={1}
                          defaultValue={voiceSetting.volume}></Slider>
                        <InputNumber
                          min={0}
                          max={1}
                          placeholder='请选择'
                          style={{
                            margin: "0 16px",
                          }}
                          defaultValue={voiceSetting.volume}
                          step={0.01}
                          value={voiceSetting.volume}
                          onChange={onChangeVolume}></InputNumber>
                      </div>
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
                        <SortableList></SortableList>
                              {/* {checkFrame &&
                              checkFrame.map((item, index) => (
                                <div className={style.leftItem} key={index}>
                                  <div className={style.drag}>
                                    <img src={getImageUrl("drg")} alt='' />
                                  </div>
                                  <div className={style.icon}>
                                    <img src={getImageUrl("001")} alt='' />
                                    {item.name}
                                  </div>
                                </div>
                              ))} */}

                        </div>
                      </div>
                      <div className={style.contentRight}>
                        <div>
                          {keyFramesList.map((item, index) => (
                            <div className={style.rightItem} key={item.label}>
                              <div className={style.one}>
                                <Checkbox
                                  onChange={() => frameCheck(index)}
                                  checked={item.checked}></Checkbox>
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
                  {/* onChange={onChange} */}
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
                          header={<Header data={item} index={index}></Header>}>
                          <Table
                            rowKey='id'
                            dataSource={item.storyboardList}
                            columns={columns}></Table>
                        </Panel>
                      ))}
                  </Collapse>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};
