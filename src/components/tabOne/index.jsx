import style from "./index.module.less";
import ModelSet from "/public/assets/modelSet.png";
import Ques from "/public/assets/ques.png";
import { Select, Slider, InputNumber, Button, message } from "antd";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { ConfigProvider } from "antd";
import theme from "./componentTheme";
// 接口
import { getSdModel, setSdModel } from "@/api/api.js";
const App = (props, ref) => {
  const { Option } = Select;
  const [options, setOptions] = useState([]);
  const [photoNum,setPhotoNum] = useState([1,2,3,4])
  const [sdForm, setSdForm] = useState({
    modelId: undefined, //sd模型值
    iterationSteps: 20, //迭代步数
    similarity: 0.75, //相似度
    plotAmount:1          //出图数量
  });
  useImperativeHandle(ref, () => {
    return {
      sdForm,
    };
  });
  // 设置滑动
  const onChangeStep = (newValue) => {
    sdForm.iterationSteps = newValue;
    setSdForm({ ...sdForm });
  };
  // 设置模型下拉
  const changeSelect = (newValue) => {
    sdForm.modelId = newValue;
    setSdForm({ ...sdForm });
  };
  // 设置图生图相似度
  const onChangeLike = (newValue) => {
    sdForm.similarity = newValue;
    setSdForm({ ...sdForm });
  };
  const changePlotAmount = (newValue)=>{
    sdForm.plotAmount = newValue;
    setSdForm({ ...sdForm });
  }
  // 获取saModel
  const getModel = () => {
    getSdModel("sd-models").then((res) => {
      console.log(res, "sd模型配置");
      sdForm.modelId = res.data.list[0].value;
      setSdForm(sdForm);
      setOptions(res.data.list);
    });
  };
  useEffect(() => {
    getModel();
  }, []);
  return (
    <ConfigProvider
      theme={{
        ...theme,
      }}>
      <div className={style.box}>
        <div>
          <div className={style.title}>
            <img src={ModelSet} alt='' />
            模型配置
          </div>
          <div className={style.setItem1}>
            <span>模型</span>
            <div>
              <Select
                size={"middle"}
                value={sdForm.modelId}
                placeholder={"请选择"}
                onChange={changeSelect}
                style={{
                  width: "100%",
                }}>
                {options.map((item) => (
                  <Option value={item.value} key={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div className={style.setItem2}>
            <div className={style.title}>
              迭代步数
              <img src={Ques} alt='' />
            </div>
            <div className={style.slider}>
              <Slider
                onChange={onChangeStep}
                value={sdForm.iterationSteps}
                min={20}
                max={40}
                defaultValue={sdForm.iterationSteps}></Slider>
              <InputNumber
                min={20}
                max={40}
                defaultValue={sdForm.iterationSteps}
                style={{
                  margin: "0 16px",
                }}
                step={0.1}
                value={sdForm.iterationSteps}
                onChange={onChangeStep}></InputNumber>
            </div>
          </div>
          <div className={style.setItem2}>
            <div className={style.title}>
              图生图相似度
              <img src={Ques} alt='' />
            </div>
            <div className={style.slider}>
              <Slider
                onChange={onChangeLike}
                step={0.01}
                value={sdForm.similarity}
                min={0}
                max={1}
                defaultValue={sdForm.similarity}></Slider>
              <InputNumber
                min={0}
                max={1}
                style={{
                  margin: "0 16px",
                }}
                defaultValue={sdForm.similarity}
                step={0.01}
                value={sdForm.similarity}
                onChange={onChangeLike}></InputNumber>
            </div>
          </div>
          <div className={style.photoNum}>
            <span>出图数量</span>
              <Select
                size={"middle"}
                value={sdForm.plotAmount}
                placeholder={"请选择"}
                onChange={changePlotAmount}
                style={{
                  width: "60%",
                }}>
                {photoNum.map((item) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
          </div>
        </div>
        <div className={style.btnBox}>
          <Button type='primary' onClick={() => props.setPartOrAllModel()}>
            全局应用
          </Button>
        </div>
      </div>
    </ConfigProvider>
  );
};
export default forwardRef(App);
