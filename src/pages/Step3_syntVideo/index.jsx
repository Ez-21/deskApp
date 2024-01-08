import BackBar from "@/components/backBar";
import style from "./index.module.less";
import Next from "@/assets/next.png";
import ClearTye from "@/assets/clearEye.png";
import creatRight from "@/assets/createRight.png";
import createDown from "@/assets/createDown.png";
import createSet from "@/assets/createSet.png";
import ModelSet from "@/assets/modelSet.png";
import Ques from "@/assets/ques.png";
import theme from './componentTheme'
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
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import {getVideoProgress,generateVideo} from '@/api/api'
const  {Option} = Select
function getImageUrl(name) {
  return new URL(`../../assets/${name}.png`, import.meta.url).href;
}
export default () => {
  const go = useNavigate();
  const [showComp, setShowComp] = useState(1);
  const [show, setShow] = useState(false);
  const [frameVal, setFrameVal] = useState([
    { label: "由大到小", img: "001", checked: false },
    { label: "由小到大", img: "002", checked: false },
    { label: "由左到右", img: "003", checked: false },
    { label: "由右到左", img: "004", checked: false },
    { label: "由上到下", img: "005", checked: false },
    { label: "由下到上", img: "006", checked: false },
  ]);
  const [state, setState] = useState([
    { id: 1, name: "shrek" },
    { id: 2, name: "fiona" },
  ]);
  const doFrame = () => {
    setShow(!show);
  };
  const getProgress= ()=>{
    getVideoProgress().then(res=>{
      console.log(res,'视频进度');
    })
  }
  const columns = [
    {
      title: "编号",
      dataIndex: "id",
      width: 90,
      render: (val, record) => {
        return (
          <div className={style.codeNumer}>
            <div>{record.id}</div>
          </div>
        );
      },
    },
    {
      title: "原图",
      dataIndex: "age",
      width: 180,
      render: (val, record) => {
        return <img src={record.photo} alt='' className={style.tableImg} />;
      },
    },
    {
      title: "本镜配图",
      dataIndex: "address",
      width: 180,
      render: (data) => {
        return <div className={style.TableTextBox}>123</div>;
      },
    },
    {
      title: "原图",
      dataIndex: "age",
      width: 180,
      render: (val, record) => {
        return <img src={record.photo} alt='' className={style.tableImg} />;
      },
    },
    {
      title: "仿图",
      dataIndex: "address",
      width: 180,
      render: (val, record) => {
        return (
          <div className={style.TableBoxFang}>
            <video
              className='video-js vjs-default-skin vjs-big-play-centered'
              controls
              src={record.video}
              alt=''
            />
            <div className={style.handleBottom}>
              <div>重新生成</div>
              <div>重新反推</div>
            </div>
          </div>
        );
      },
    },
  ];
  const data = [
    {
      key: 1,
      id: 1,
      name: "Joe Black",
      address: "London No. 1 Lake Park",
      photo:'https://img0.baidu.com/it/u=3368678403,249914024&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1702918800&t=37bc5fe1b0bfef125a9d5eaeec3bbcaf',
      video: "https://mvwebfs.tx.kugou.com/202312161801/6e3f3a63e3360879c4ced2ef975d1bce/v2/20048f5c7247aa8f3afe0c43462cff41/KGTX/CLTX002/20048f5c7247aa8f3afe0c43462cff41.mp4",
    },
  ];
  const items = [
    {
      key: "1",
      label: (
        <div className={style.tableHead}>
          <div className={style.headOne}>
            <div>
              <div>
                <Checkbox></Checkbox>
              </div>
              <img src={true ? creatRight : createDown} alt='' />
              <div>庄周梦蝶</div>
            </div>
          </div>
          <div className={style.headTwo}>
            <Progress
              strokeColor={"#49AA19"}
              trailColor={"rgba(255, 255, 255, 0.08)"}
              percent={10}
              style={{
                width: "332px",
              }}></Progress>
            <div>
              <div className={style.statusCir}></div>
              未识别到音频路径
            </div>
          </div>
        </div>
      ),
      children: <Table dataSource={data} columns={columns}></Table>,
    },
  ];

  const onChange = (key) => {
    console.log(key);
  };
  const frameCheck = (index)=>{
    frameVal[index].checked=!frameVal[index].checked
    setFrameVal([...frameVal])
  }
  const [stepValue, setStepValue] = useState(20);
  const [likeValue, setLikeValue] = useState(0.75);
  const onChangeStep = (newValue) => {
    setStepValue(newValue);
  };
  const onChangeLike = (newValue) => {
    setLikeValue(newValue);
  };
  // 下一步
  const goNextStep = () => {
    generateVideo().then(res=>{
      console.log(res)
    })
    // go('/Step3SyncVideo', {state: {}})
  };
  // 上一步
  const goBeforeStep = () => {
    // go("/Step1FrameNumber", { state: {} });
    history.back(-1)
  };
  const frameStart = ()=>{
      
  }
  return (
    <ConfigProvider
      theme={{
          ...theme
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
                      <Select></Select>
                    </div>
                    <div className={style.setItem2}>
                      <div className={style.title}>
                        音速
                        <img src={Ques} alt='' />
                      </div>
                      <div className={style.slider}>
                        <Slider
                          onChange={onChangeStep}
                          value={stepValue}
                          min={20}
                          max={40}
                          defaultValue={stepValue}></Slider>
                        <InputNumber
                          min={20}
                          max={40}
                          defaultValue={20}
                          style={{
                            margin: "0 16px",
                          }}
                          step={0.01}
                          value={stepValue}
                          onChange={onChangeStep}></InputNumber>
                      </div>
                    </div>
                    <div className={style.setItem2}>
                      <div className={style.voice}>
                        音量
                        <Switch />
                      </div>
                      <div className={style.slider}>
                        <Slider
                          onChange={onChangeLike}
                          step={0.01}
                          value={likeValue}
                          min={0}
                          max={1}
                          defaultValue={likeValue}></Slider>
                        <InputNumber
                          min={0}
                          max={1}
                          style={{
                            margin: "0 16px",
                          }}
                          defaultValue={likeValue}
                          step={0.01}
                          value={likeValue}
                          onChange={onChangeLike}></InputNumber>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.right}>
                <div className={style.options}>
                  <div className={style.optionsL}>
                    <div>视频草稿</div>
                    <div className={style.circle}>15</div>
                  </div>
                  <div className={style.optionsR}>
                    {/* <div>
                      <img src={ClearTye} alt='' />
                      自动识别音频路径
                    </div> */}
                    <div onClick={doFrame}>一键关键帧</div>
                  </div>
                </div>
                {show&&
                  <div className={style.modalBox}>
                    <div className={style.modalTitle}>关键帧序列</div>
                    <div className={style.modalContent}>
                      <div className={style.contentLeft}>
                        <div>
                          <ReactSortable
                            list={state}
                            setList={setState}>
                           <div className={style.leftItem}>
                             <div className={style.drag}>
                                <img src={getImageUrl('drg')} alt="" />
                            </div>
                            <div>
                                <img src={getImageUrl('001')} alt="" /> 
                                由小到大
                            </div>
                            <InputNumber width={8}></InputNumber>
                           </div>
                           <div className={style.leftItem}>
                             <div className={style.drag}>
                                <img src={getImageUrl('drg')} alt="" />
                            </div>
                            <div>
                                <img src={getImageUrl('001')} alt="" /> 
                                由小到大
                            </div>
                            <InputNumber></InputNumber>
                           </div>
                          </ReactSortable>
                        </div>
                      </div>
                      <div className={style.contentRight}>
                        <div>
                          {frameVal.map((item,index) => (
                            <div className={style.rightItem} key={item.label}>
                              <div className={style.one}>
                                <Checkbox onChange={()=>frameCheck(index)} checked={item.checked}></Checkbox>
                              </div>
                              <div className={style.two}>
                                <img src={getImageUrl(item.img)} alt='' />
                                <span>{item.label}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className={style.btn} onClick={frameStart}>
                        <div>应用轮循</div>
                    </div>
                  </div>
                }
                <div
                  className={style.Collapse}
                  style={{
                    marginTop: "28px",
                  }}>
                  <Collapse
                    expandIcon={() => null}
                    showArrow={false}
                    style={{
                      color: "white",
                    }}
                    items={items}
                    defaultActiveKey={["1"]}
                    onChange={onChange}
                  />
                  ;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};
