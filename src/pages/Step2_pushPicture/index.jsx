import style from "./index.module.less";
import Next from "@/assets/next.png";
import ClearTye from "@/assets/clearEye.png";
import creatRight from "@/assets/createRight.png";
import createDown from "@/assets/createDown.png";
import createSet from "@/assets/createSet.png";
import Wipe from "@/assets/wipe.png";
import theme from "./componentTheme";
import {
  Tabs,
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
  Image,
} from "antd";
// 返回组件
import BackBar from "@/components/backBar";
// one组件
import TabOne from "@/components/tabOne";
// two组件
import TabTwo from "@/components/tabTwo";
// 提示词编辑器组件
import CallWord from "@/components/callWordEd/hayi.jsx";
// 擦除组件
import WipeCom from "@/components/wipe";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { getImageUrl, appImagePath, queeTask } from "../../func";
import { useStore } from "@/store";
// 接口
import {
  getSdModel,
  setModalOrPricture,
  getSdDetial,
  createPicHandle,
  setSdModel,
  reverseWord,
  // getGlobalStyle,
  // getMjDetial,
  reverseAloneWord,
} from "@/api/api.js";
export default () => {
  const go = useNavigate();
  const { Option } = Select;
  const { Panel } = Collapse;
  const params = useLocation();
  // 状态库
  // laoding效果
  const [loading, setLoading] = useState(false);
  // 表格详情
  const [detial, setDetial] = useState([]);
  const [showComp, setShowComp] = useState(1);
  const [picModal, setPicModal] = useState(false);
  // 擦除组件显示
  const [wipeStatus, setWipeStatus] = useState(false);
  // 提示词显示
  const [CallWorded, setCallWorded] = useState(false);
  // 切换出图配置词汇的tab
  const [wordTabs, setWordTabs] = useState(1);
  const [targetData, setTargetData] = useState();
  // 全选
  const [checkAll, setCheckAll] = useState(false);
  // MJ设置表单
  const [mjSetting, setMjSetting] = useState({
    currentIndex: 0,
  });
  //开始执行任务状态
  const [state, setState] = useState({
    value: false,
    progress: "",
    target: undefined,
    total: "",
    //中断状态
    status: false,
  });
  // 出图配置表单
  const [dataModel, setDataModel] = useState({
    // lorald
    loraId: undefined,
    // 模型数组数据
    loraArr: [],
    // 反向提示词
    reverseHintWords: [],
    // 迭代步数
    loraIterationSteps: 20,
    // 敏感词
    sensitiveWords: [],
    // 草稿id
    draftId: undefined,
    // 配置词汇输入
    textVal: "",
  });
  // 一键生图表单
  const [createPic, setCreatePic] = useState({
    draft_board_uuid: "",
    // 原图路径
    path: "",
    // 生图方式   1: sd, 2: mj, 3: dalle3
    model_type: "",
    promot: "",
    // sd模型值
    model_value: "",
    // 分镜id
    uuid: "",
  });
  // 组件实例
  const tableOneRef = useRef(null);
  const tableTwoRef = useRef(null);

  // 获取SD详情
  const getDetial = () => {
    // let POSTURL;
    // if (showComp == 1) {
    //   POSTURL = getSdDetial;
    // } else if (showComp == 2) {
    //   POSTURL = getMjDetial;
    // }
    getSdDetial({ draftIds: params.state.draftIds, modelType: showComp }).then(
      (res) => {
        console.log(res.data, "详情数据");
        res.data.draftList.forEach((element) => {
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
        console.log(res.data.draftList, "数据表格");
        setDetial(res.data);
      }
    );
  };
  // 获取模型
  const getModalArr = async () => {
    await getSdModel("loras").then((res) => {
      console.log(res.data.list, "模型");
      dataModel.loraArr = res.data.list;
      setDataModel({ ...dataModel });
    });
  };

  // 切换折叠卡片
  const changeCollapse = (data) => {
    console.log(data, "切换折叠卡片");
  };

  // 点击出图配置开启弹窗
  const picSets = async (e, record) => {
    e.stopPropagation();
    setPicModal(true);
    console.log(record, "单例数据");
    // 这需要判断是否存在  plotConfiguration 进行数据返显
    dataModel.draftId = record.draftId;
    // 判断该草稿是否保存过出图配置  如果保存过 该plotConfiguration会存在值
    if (Object.values(record.plotConfiguration).length !== 0) {
      for (let key in dataModel) {
        dataModel[key] = record.plotConfiguration[key];
      }
    }
    // 判断有无配置词
    if (dataModel.reverseHintWords.length != 0) {
      dataModel.reverseHintWords = dataModel.reverseHintWords.split(",");
    }
    if (dataModel.reverseHintWords.length) {
      dataModel.sensitiveWords = dataModel.sensitiveWords.split(",");
    }
    setDataModel({ ...dataModel });
    getModalArr();
  };
  // 点击一键生图
  const createPicture = () => {
    // 先获取被勾选的数据
    let checkVal = detial.draftList.filter((item) => item.checked);
    if (checkVal.length == 0) {
      return message.error("至少选择一条草稿！");
    }
    // 提取分镜id // 展平二维数组
    let draft_board_uuid = checkVal
      .map((item) => item.storyboardList.map((item) => item.id))
      .flat(2);
    console.log(draft_board_uuid, "分镜id");
    // 获取左侧组件数据
    createPic.model_value = tableOneRef.current.form.modelId;
    createPic.model_type = showComp;
    // 开启队列遮罩
    state.value = true;
    state.total = draft_board_uuid.length;
    // 初始化进度
    state.progress = ((1 / draft_board_uuid.length) * 100).toFixed(2);
    setState({ ...state });
    // 开始执行任务队列
    queeTask(draft_board_uuid, useCreatePicturePost)(
      (res) => {
        console.log(res, "数据流向");
        if (res.status == "done") {
          state.value = false;
          state.progress = 100;
          setState({ ...state });
         return message.success("生图任务执行完毕");
        } else if (res.status == "ing") {
         return setState((data) => {
            data.progress = res.progress;
            data.target = detial.draftList.find((item) => {
              return item.storyboardList.map((val) => val.id == res.targetId);
            }).draftName;
            return { ...data };
          });
        }
      },
      (rej) => {
        console.log(rej,'rej')
        if (rej.status == "break") {
           state.value = false;
          setState({ ...state });
        }
      }
    );
    setCreatePic({ ...createPic });
  };
  // 重新生图
  const regenPicture = async (record) => {
    record.spinning = true;
    setDetial({ ...detial });
    await useCreatePicturePost(record.id);
    getDetial();
  };
  // 重新反推
  const regenText = async (record) => {
    reverseAloneWord({ paragraphId: record.id }).then((res) => {
      console.log(res);
      record.reverseInference = res.data.reverseInferenceWord;
      setDetial({ ...detial });
    });
  };
  // 调用一键生图接口
  const useCreatePicturePost = async (value) => {
    await createPicHandle({
      modelType: showComp,
      storyboardId: value,
    });
  };
  // 点击一键反推提示词
  const reverseWordHandle = async () => {
    let checkEdList = detial.draftList.filter((item) => item.checked);
    if (checkEdList.length == 0) {
      message.error("至少选择一条草稿！");
      return;
    }
    let draftIds = checkEdList.map((item) => item.draftId);
    setLoading(true);
    reverseWord({
      draftIds,
    })
      .then((res) => {
        if (res.code == 200) {
          console.log(res.data.draftList);
          let resData = res.data.draftList;
          for (let item of detial.draftList) {
            // 获取选中的数据
            if (item.checked) {
              resData.forEach((val) => {
                // 比对草稿Id
                if (item.draftId == val.draftId) {
                  for (let listItem of item.storyboardList) {
                    // 比对分镜id
                    for (let resItem of val.storyboardList) {
                      if (listItem.id == resItem.id) {
                        listItem.reverseInference =
                          resItem.reverseInferencePromptWords;
                      }
                    }
                  }
                }
              });
            }
          }
          setDetial({ ...detial });
          message.success("反推提示词执行成功！");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // 打开提示词编辑器
  const push = (record) => {
    console.log(record);
    setTargetData(record);
    setCallWorded(!CallWorded);
  };

  // table表头
  const columns = [
    {
      key: "index",
      title: "编号",
      dataIndex: "index",
      // align: "center",
      fixed: "left",
      render: (text, record, index) => (
        <div className={style.codeNumer}>
          <div>{index + 1}</div>
        </div>
      ),
    },
    {
      key: "orignImagePath",
      title: "原图",
      dataIndex: "orignImagePath",
      // align: "center",
      width: 180,
      fixed: "left",
      render: (val) => {
        return <img src={val} alt='' className={style.tableImg} />;
      },
    },
    {
      key: "orignText",
      title: "原文",
      dataIndex: "orignText",
      // align: "center",
      width: 180,
      fixed: "left",
      render: (val) => {
        return <div className={style.TableBox}>{val || ""}</div>;
      },
    },
    {
      key: "rewriteText",
      title: "重写",
      dataIndex: "rewriteText",
      // align: "center",
      width: 180,
      render: (val) => {
        return <div className={style.TableBox}>{val || ""}</div>;
      },
    },
    {
      key: "reverseInference",
      title: "反推词",
      dataIndex: "reverseInference",
      // align: "center",
      width: 180,
      render: (val, record) => {
        return (
          <a title='点击打开反推词编辑器'>
            <div
              className={style.TableBox}
              style={{
                overflowY: "scroll",
              }}
              onClick={() => push(record)}>
              {val ?? ""}
            </div>
          </a>
        );
      },
    },
    {
      key: "currentImageList",
      title: "仿图",
      dataIndex: "currentImageList",
      // align: "center",
      width: 180,
      render: (val, record) => {
        if (val.length != 0) {
          return (
            <div className={style.TableBoxFang}>
              <Spin spinning={record.spinning}>
                <div className={style.indexBox}>
                  {showComp == 2 && (
                    <div className={style.topBox}>
                      {[1, 2, 3, 4].map((item, index) => {
                        return (
                          <div
                            className={style.indexBoxItem}
                            style={
                              item === 1
                                ? {
                                    background: "rgba(255, 255, 255, 0.2)",
                                    color: "white",
                                  }
                                : undefined
                            }
                            key={index}>
                            {item}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className={style.bottomBox}></div>
                </div>
                <div className={style.black}></div>
                <img
                  src={record.currentImageList[mjSetting.currentIndex]}
                  alt=''
                />
                <div
                  className={style.wipe}
                  onClick={() => setWipeStatus(!wipeStatus)}
                  style={showComp != 2 ? { top: 0 } : {}}>
                  <img src={Wipe} alt='' />
                  擦除
                </div>
                {wipeStatus && (
                  <WipeCom setWipeStatus={setWipeStatus}></WipeCom>
                )}
                <div className={style.handleBottom}>
                  <div onClick={() => regenPicture(record)}>重新生成</div>
                  <div onClick={() => regenText(record)}>重新反推</div>
                </div>
              </Spin>
            </div>
          );
        } else {
          return <div className={style.TableBox}></div>;
        }
      },
    },
    {
      key: "historyImageList",
      // title: "历史记录",
      dataIndex: "historyImageList",
      // align: "center",
      width: 180,
      render: (data, record, key) => {
        return (
          <div className={style.TableBoxHistory}>
            {data &&
              data.map((item, index) => (
                <div
                  className={style.histItem}
                  key={index}
                  onClick={(e) => ckHistoryImg(item, record, key, e)}>
                  <Image.PreviewGroup>
                    <Image
                      width={160}
                      src={item}
                      preview={{ maskClassName: style.imgMask }}
                    />
                  </Image.PreviewGroup>
                </div>
              ))}
          </div>
        );
      },
    },
  ];
  const Header = ({ data, index }) => {
    const changeCheckBox = (e) => {
      e.stopPropagation();
      detial.draftList[index].checked = !detial.draftList[index].checked;
      setDetial({ ...detial });
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
          <div onClick={(e) => picSets(e, data)}>
            <img src={createSet} alt='' />
            出图配置
          </div>
        </div>
      </div>
    );
  };
  const onChange = (key) => {};
  // 点击历史记录中的图片
  const ckHistoryImg = (value, record, key, e) => {
    e.stopPropagation();
    console.log(key, "索引");
    console.log(value, "值");
    console.log(record, "数据");
    detial.draftList.forEach((item, index) => {
      item.storyboardList.forEach((val, key) => {
        if (val.id == record.id) {
          console.log(val.currentImageList);
          if (Array.isArray(val.currentImageList)) {
            val.currentImageList[mjSetting.currentIndex] = value;
          } else {
            val.currentImageList = value;
          }
        }
      });
    });
    setDetial({ ...detial });
  };
  // 下一步
  const goNextStep = () => {
    // 抽取草稿任务ids
    let draftIds = detial.draftList .filter((item) => item.checked).map((item) => item.draftId);
    if (draftIds.length == 0) {
      return message.error("至少选择一条草稿任务！");
    }
    go("/Step3SyncVideo", {
      state: {
        draftIds,
        modelType: showComp,
      },
    });
  };
  // 上一步
  const goBeforeStep = () => {
    go("/Step1FrameNumber", { state: params });
  };
  // 切换头部tabs
  const editTabs = (data) => {
    setDetial({});
    setShowComp((res) => data);
    getDetial();
  };
  //切换出图配置词 tabs
  const changeWordTabs = (item) => {
    setWordTabs(item);
  };
  // 切换模型
  const changeLora = (e) => {
    dataModel.loraId = e;
    setDataModel({ ...dataModel });
  };
  // 删除出图配置词
  const delWord = (flag, index) => {
    if (flag) {
      dataModel.reverseHintWords.splice(index, 1);
    } else {
      dataModel.sensitiveWords.splice(index, 1);
    }
    setDataModel({ ...dataModel });
  };
  // 输入配置词汇
  const inputWord = (val) => {
    dataModel.textVal = val;
    setDataModel({ ...dataModel });
  };
  // 滑动步进器
  const changeSteps = (val) => {
    dataModel.loraIterationSteps = val;
    setDataModel({ ...dataModel });
  };
  // 保存关键词
  const saveWord = () => {
    if (!dataModel.textVal) {
      return;
    }
    console.log(dataModel, "打印");
    if (wordTabs == 1) {
      dataModel?.reverseHintWords.push(dataModel.textVal);
    } else {
      dataModel?.sensitiveWords.push(dataModel.textVal);
    }
    dataModel.textVal = "";
    setDataModel({ ...dataModel });
  };
  // 取消保存
  const cancelSaveSetting = () => {
    setPicModal(false);
    (dataModel.loraId = undefined),
      // 模型数组数据
      (dataModel.loraArr = []),
      // 反向提示词
      (dataModel.reverseHintWords = []),
      // 迭代步数
      (dataModel.loraIterationSteps = 20),
      // 敏感词
      (dataModel.sensitiveWords = []),
      // 草稿id
      (dataModel.draftId = undefined),
      // 配置词汇输入
      (dataModel.textVal = ""),
      setDataModel({ ...dataModel });
  };
  // 保存出图配置
  const saveSetting = () => {
    // 字符串化
    let params = {
      loraId: dataModel.loraId,
      sensitiveWords: dataModel.sensitiveWords.toString(),
      reverseHintWords: dataModel.reverseHintWords.toString(),
      draftId: dataModel.draftId,
      loraIterationSteps: dataModel.loraIterationSteps,
    };
    setModalOrPricture(params)
      .then((res) => {
        console.log(res);
        message.success("保存出图配置成功！");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // 全局应用
  const setPartOrAllModel = (draftIdsVal) => {
    var allDraftIds = detial.draftList.map((item) => item.draftId);
    setSdModel({
      modelSetting: { ...tableOneRef.current.form },
      // 如果有参数传递进来 代表单独设置   没有参数就调用 代表全局应用
      draftIds: draftIdsVal ?? allDraftIds,
    }).then((res) => {
      console.log(res, "保存sdModel");
      if (res.code == 200) {
        message.success("应用成功!");
      }
    });
  };
  // 全选
  const checkAllHand = () => {
    setCheckAll((res) => {
      let data = !checkAll;
      if (data) {
        detial.draftList.map((item) => (item.checked = data));
      } else {
        detial.draftList.map((item) => (item.checked = data));
      }
      return data;
    });
  };
  // 中断任务
  const stopCreate = () => {
    sessionStorage.setItem("breakStatus", "1");
    state.value = false;
    setState((res) => {
      getDetial();
      message.info("任务已中断!2");
      return { ...res };
    });
  };
  // 头部tabs
  const [tabsItem, setTabsItem] = useState([
    {
      label: "Stable Diffusion",
      key: "1",
    },
    // {
    //   label: "Midjourney",
    //   key: "2",
    // },
    // {
    //   label: "Dalle3",
    //   key: "3",
    // },
  ]);
  useEffect(() => {
    //设置此页面任务中中断状态
    sessionStorage.setItem("breakStatus", "0");
    sessionStorage.setItem("stateData", JSON.stringify({}));
    if (params.state) {
      getDetial();
    }
  }, []);
  return (
    <ConfigProvider
      theme={{
        ...theme,
      }}>
      {/* 任务进度遮罩层 */}
      {state.value && (
        <div className={style.mask}>
          <div className={style.maskContent}>
            <div className={style.progress}>
              <Progress size={90} type='circle' percent={state.progress} />
            </div>
            <div className={style.createIng}>
              {state.progress == 100 ? "任务执行完毕" : "任务执行中"}
            </div>
            <div className={style.progressText}>
              共有{state.total}个任务正在执行，当前执行的任务是
              <u>{state.target}</u>，任务进度是{state.progress}%
            </div>
            <div className={style.maskBtn} onClick={stopCreate}>
              中断任务
            </div>
            <div className={style.tips}>挂起任务后可以回到首页</div>
          </div>
        </div>
      )}
      <div className={style.box}>
        <BackBar></BackBar>
        <div className={style.titleBox}>
          <div className={style.step}>
            <div>视频抽帧</div>
            <img src={Next} alt='' />
            <div className={style.stepKey}>反应生图</div>
            <img src={Next} alt='' />
            <div>合成视频</div>
          </div>
          <div className={style.stepHandle}>
            <div className={style.frame} onClick={goBeforeStep}>
              上一步
            </div>
            <div className={style.frame} onClick={goNextStep}>
              下一步
            </div>
          </div>
        </div>
        {/* 提示词编辑器 */}
        {CallWorded && (
          <CallWord
            close={() => setCallWorded(false)}
            record={targetData}
            getDetial={getDetial}></CallWord>
        )}
        <div className={style.tabBox}>
          <div className={style.tabContent}>
            <Tabs
              style={{
                background: "#1A1A1A",
                color: "white !important",
              }}
              centered
              items={tabsItem}
              onChange={editTabs}
              defaultkey={"1"}></Tabs>
            <div className={style.bottomContent}>
              {showComp !== 3 && (
                <div
                  className={style.left}
                  style={showComp == 3 ? { display: "none" } : {}}>
                  {showComp == 1 && (
                    <TabOne
                      ref={tableOneRef}
                      setPartOrAllModel={setPartOrAllModel}
                    />
                  )}
                  {showComp == 2 && <TabTwo ref={tableTwoRef} />}
                </div>
              )}

              <div className={style.right}>
                <div className={style.options}>
                  <div className={style.optionsL}>
                    <div>反推队列</div>
                    <div className={style.circle}>
                      {detial.draftList && detial.draftList.length}
                    </div>
                  </div>
                  <div className={style.optionsR}>
                    {/* <div>
                      <img src={ClearTye} alt='' />
                      一键高清
                    </div> */}
                    {/* 应用执行操作时候不能让用户重复进行点击 */}
                    <div onClick={loading ? null : checkAllHand}>
                      {checkAll ? "取消全选" : "全选"}
                    </div>
                    <div onClick={loading ? null : reverseWordHandle}>
                      一键反推提示词
                    </div>
                    <div onClick={loading ? null : createPicture}>一键生图</div>
                  </div>
                </div>

                <div
                  className={style.Collapse}
                  style={{
                    marginTop: "28px",
                  }}>
                  {picModal && (
                    <div className={style.picModal}>
                      <div className={style.title}>出图配置</div>
                      <div className={style.solon}>配置</div>
                      <div className={style.content}>
                        <div className={style.contentTop}>
                          <div>风格LORA</div>
                          <img src={getImageUrl("pirAdd")} alt='' />
                        </div>
                        <div className={style.contentBottom}>
                          <Select
                            placeholder='请选择Lora模型'
                            onChange={changeLora}
                            style={{ width: "100%" }}
                            value={dataModel.loraId}>
                            {dataModel.loraArr &&
                              dataModel.loraArr.map((item, index) => (
                                <Option value={item.value} key={index}>
                                  {item.label}
                                </Option>
                              ))}
                          </Select>
                        </div>
                      </div>
                      <div className={style.content}>
                        <div className={style.contentTop}>
                          <div>迭代步数</div>
                        </div>
                        <div className={style.contentBottom}>
                          <div className={style.contentSlider}>
                            <Slider
                              defaultValue={20}
                              min={20}
                              max={40}
                              onChange={changeSteps}
                              value={dataModel.loraIterationSteps}></Slider>
                            <InputNumber
                              value={dataModel.loraIterationSteps}
                              min={20}
                              max={40}
                              defaultValue={20}
                              style={{
                                margin: "0 16px",
                              }}
                              step={0.1}></InputNumber>
                          </div>
                        </div>
                      </div>
                      <div className={style.content}>
                        <div className={style.wordContent}>
                          <Tabs
                            centered
                            onChange={changeWordTabs}
                            items={[
                              { label: "反向提示词", key: 1 },
                              { label: "敏感词", key: 2 },
                            ]}></Tabs>

                          <div className={style.wordBox}>
                            {wordTabs == 1
                              ? dataModel.reverseHintWords &&
                                dataModel.reverseHintWords.map(
                                  (item, index) => (
                                    <div className={style.word} key={index}>
                                      {item}
                                      <img
                                        src={getImageUrl("closeWindow")}
                                        alt=''
                                        onClick={() => delWord(true, index)}
                                      />
                                    </div>
                                  )
                                )
                              : dataModel.sensitiveWords &&
                                dataModel.sensitiveWords.map((item, index) => (
                                  <div className={style.word} key={index}>
                                    {item}
                                    <img
                                      src={getImageUrl("closeWindow")}
                                      alt=''
                                    />
                                  </div>
                                ))}
                          </div>
                          <div className={style.inpVal}>
                            <input
                              type='text'
                              placeholder='请输入'
                              value={dataModel.textVal}
                              onChange={(e) => inputWord(e.target.value)}
                            />
                            <div onClick={saveWord}>保存</div>
                          </div>
                        </div>
                      </div>
                      <div className={style.footer}>
                        <div onClick={cancelSaveSetting}>取消</div>
                        <div onClick={saveSetting}>保存</div>
                      </div>
                    </div>
                  )}
                  <Spin spinning={loading}>
                    <Collapse
                      expandIcon={() => null}
                      showArrow={false}
                      style={{
                        color: "white",
                      }}
                      onChange={changeCollapse}>
                      {detial.draftList &&
                        detial?.draftList.map((item, index) => (
                          <Panel
                            key={item.draftId}
                            header={
                              <Header data={item} index={index}></Header>
                            }>
                            <Table
                              rowKey='id'
                              scroll={{ x: 800 }}
                              dataSource={item.storyboardList}
                              columns={columns}></Table>
                          </Panel>
                        ))}
                    </Collapse>
                  </Spin>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};
