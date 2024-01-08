import style from "./index.module.less";
import ModelSet from "@/assets/modelSet.png";
import Ques from "@/assets/ques.png";
import { Select, Slider, InputNumber, Button, message } from "antd";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { ConfigProvider } from "antd";
import theme from "./componentTheme";
// 接口
import { getSdModel, setSdModel } from "@/api/api.js";
const App = (props, ref) => {
  const { Option } = Select;
  const [options, setOptions] = useState([]);
  const [form, setForm] = useState({
    modelId: undefined, //sd模型值
    iterationSteps: 20, //迭代步数
    similarity: 0.75, //相似度
  });
  useImperativeHandle(ref, () => {
    return {
      form,
    };
  });
  // 设置滑动
  const onChangeStep = (newValue) => {
    form.iterationSteps = newValue;
    setForm({ ...form });
  };
  // 设置模型下拉
  const changeSelect = (newValue) => {
    form.modelId = newValue;
    setForm({ ...form });
  };
  // 设置图生图相似度
  const onChangeLike = (newValue) => {
    form.similarity = newValue;
    setForm({ ...form });
  };
  // 获取saModel
  const getModel = () => {
    getSdModel("sd-models").then((res) => {
      console.log(res, "sd模型配置");
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
                value={form.modelId}
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
                value={form.iterationSteps}
                min={20}
                max={40}
                defaultValue={form.iterationSteps}></Slider>
              <InputNumber
                min={20}
                max={40}
                defaultValue={form.iterationSteps}
                style={{  
                  margin: "0 16px",
                }}
                step={0.1}
                value={form.iterationSteps}
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
                value={form.similarity}
                min={0}
                max={1}
                defaultValue={form.similarity}></Slider>
              <InputNumber
                min={0}
                max={1}
                style={{
                  margin: "0 16px",
                }}
                defaultValue={form.similarity}
                step={0.01}
                value={form.similarity}
                onChange={onChangeLike}></InputNumber>
            </div>
          </div>
        </div>
        <div className={style.btnBox}>
          <Button type='primary' onClick={()=>props.setPartOrAllModel()}>
            全局应用
          </Button>
        </div>
      </div>
    </ConfigProvider>
  );
};
export default forwardRef(App);
