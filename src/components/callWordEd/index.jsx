// 提示词编辑器
import style from "./index.module.less";
import close from "/public/assets/closeWindow.png";
import drag from "/public/assets/drg.png";
import { Tabs, ConfigProvider, Checkbox, Collapse } from "antd";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const App = ({ closeCallWorded }) => {
  //选项数据
  const [item, setItem] = useState([]);
  const [content, setContent] = useState([]);
  const [childTab, setChildTab] = useState([]);
  const [leftContent, setLeftContent] = useState({
    normal: [],
    style: [],
    quality: [],
  });
  const [tabs, setTabs] = useState([
    {
      label: "质量",
      key: "1",
    },
    {
      label: "绘画",
      key: "2",
    },
    {
      label: "画面效果",
      key: "3",
    },
    {
      label: "容貌",
      key: "4",
    },
    {
      label: "构图",
      key: "5",
    },
  ]);
  //点击chekBox
  const checkHand = (value, index) => {
    item[index].checked = !item[index].checked;

    if (value.subType == "style") {
      if (item[index].checked) {
        leftContent.style.push(value);
      } else {
        leftContent.style.splice(index, 1);
      }
      setLeftContent({ ...leftContent });
      setItem([...item]);
      return;
    }

    if (value.subType == "normal") {
      setLeftContent((res) => {
        if (item[index].checked) {
          leftContent.normal.push(value);
        } else {
          leftContent.normal.splice(index, 1);
        }
        return { ...leftContent };
      });
      setItem([...item]);
      return;
    }

    if (value.subType == "quality") {
      setLeftContent((res) => {
        if (item[index].checked) {
          res.quality.push(value);
        } else {
          res.quality.splice(index, 1);
        }
        return { ...res };
      });
      setItem([...item]);
      return;
    }
  };
  const getJson = () => {
    fetch("/public/json/promot.json")
      .then((res) => res.json())
      .then((res) => {
        console.log(res, "json文件");
        setContent((val) => {
          let content = Object.values(res);
          content.forEach((item) => (item.checked = false));
          let data = content.filter((item) => item.subType == "quality");
          setItem(data);
          return content;
        });
        setChildTab([]);
      });
  };
  //点击保存
  const save = () => {
    let checkedItem = item.filter((item) => item.checked);
    console.log(checkedItem);
  };
  //切换tabs
  const changeTabs = (e) => {
    switch (e) {
      case "1":
        {
          let data = content.filter((item) => item.subType == "quality");
          setItem(data);
          setChildTab([]);
        }
        break;
      case "2":
        {
          let data = content.filter((item) => item.t == "OPS_style");
          setItem(data);
          setChildTab([]);
        }
        break;
      case "3":
        {
          let data = content.filter(
            (item) => item.subType && item.subType == "style"
          );
          setChildTab([]);
          setItem(data);
        }
        break;
      case "4":
        {
          let data = content.filter(
            (item) => item.dir && item?.dir.includes("容貌")
          );
          // 获取容貌下的 子分类
          let childTab = [];
          data.forEach((item) => {
            if (item.dir && item?.dir.includes("容貌")) {
              childTab.push(item.dir.split("/")[1]);
            }
          });
          setChildTab(Array.from(new Set(childTab.flat(2))));
          setItem(data);
        }
        break;
      case "5":
        {
          let data = content.filter(
            (item) => item.dir && item?.dir.includes("构图")
          );
          setChildTab([]);
          setItem(data);
        }
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    getJson();
    changeTabs(1);
  }, []);
  return (
    <div className={style.box}>
      <div className={style.title}>
        提示词编辑器 <img src={close} alt='' onClick={closeCallWorded} />
      </div>
      <div className={style.content}>
        <div className={style.left}>
          <div className={style.typeBox}>
            <div className={style.typeTitle}>普通</div>
            <div className={style.typeContent}>
              {leftContent.normal.map((item, index) => (
                <div className={style.typeItem} key={item.text}>
                  <img src={drag} alt='' />
                  <div>{item.lang ?? item.text}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={style.typeBox}>
            <div className={style.typeTitle}>风格</div>
            <div className={style.typeContent}>
              {leftContent.style.map((item, index) => (
                <div className={style.typeItem} key={item.text}>
                  <img src={drag} alt='' />
                  <div>{item.lang ?? item.text}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={style.typeBox}>
            <div className={style.typeTitle}>质量</div>
            <div className={style.typeContent}>
              {leftContent.quality.map((item, index) => (
                <div className={style.typeItem} key={index}>
                  <img src={drag} alt='' />
                  <div>{item.lang ?? item.text}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={style.typeBox}>
            <div className={style.typeTitle}>输出</div>
            <div className={style.typeContent}></div>
          </div>
        </div>
        <div className={style.right}>
          <div>
            <Tabs items={tabs} onChange={changeTabs}></Tabs>
          </div>
          <div className={style.tabsModalContent}>
            {item.map((item, index) => {
              // 没有子类
              if (childTab.length == 0) {
                return (
                  <div className={style.modalItem} key={index}>
                    <div className={style.left}>
                      <Checkbox
                        checked={item.checked}
                        onChange={() => checkHand(item, index)}></Checkbox>
                    </div>
                    <div className={style.right}>{item?.lang ?? item.text}</div>
                  </div>
                );
              } else {
                <Collapse>
                  {childTab.map((label) => (
                    <Collapse.Panel header={label} key={label}>
                      {item.dir.includes(label) ? (
                        <div className={style.modalItem} key={index}>
                          <div className={style.left}>
                            <Checkbox
                              checked={item.checked}
                              onChange={() => checkHand(index)}></Checkbox>
                          </div>
                          <div className={style.right}>
                            {item?.lang ?? item.text}
                          </div>
                        </div>
                      ) : (
                        false
                      )}
                    </Collapse.Panel>
                  ))}
                </Collapse>;
              }
            })}
          </div>
        </div>
      </div>
      <div className={style.footer}>
        <div>取消</div>
        <div onClick={save}>保存</div>
      </div>
    </div>
  );
};
export default App;
