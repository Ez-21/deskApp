import { useEffect, useState } from "react";
import style from "./index.module.less";
import Book from "/public/assets/book.png";
import {
  setFileCatalog,
  getFileCatalog,
  testLocalPing,
  switchCloud,
} from "@/api/api.js";
import { dialog } from "@tauri-apps/api";
import { message, Radio, ConfigProvider, Modal, Button, Input } from "antd";
const App = () => {
  const [config, setConfig] = useState("");
  const [checkVal, setCheckVal] = useState(undefined);
  const [linkShow, setLinkShow] = useState(false);
  const [sdState, setSdState] = useState(false);
  //   选择文件夹
  const openDir = async () => {
    // let filePicker = await window.showDirectoryPicker();
    let fileUrl = await dialog.open({
      directory: true,
    });
    if (fileUrl) {
      setFileCatalog({
        jianYingDraftFolder: fileUrl,
      })
        .then((res) => {
          console.log(res);
          message.success("草稿目录设置成功！");
          showConfig();
        })
        .catch((err) => {
          console.log(etr);
        });
    }
  };
  //  复现文件夹地址
  const showConfig = () => {
    return getFileCatalog().then((res) => {
      console.log(res);
      if (res.code == 200) {
        console.log(res.data, "用户配置");
        setConfig(res.data);
        // true 本地 false 云端
        let sdLocalState = res.data.local ? 2 : 1;
        setCheckVal(sdLocalState);
      }
    });
  };
  // 关闭sd链接弹窗
  const cancelLink = async () => {
    if (!sdState) {
      setCheckVal(1);
    }
    await showConfig();
    setLinkShow(false);
  };
  // 切换radio
  const changeLink = async (e) => {
    if (e.target.value == 2) {
      await showConfig();
      setCheckVal(e.target.value);
      setLinkShow(true);
      setSdState(false);
      return;
    } else {
      switchCloud();
      setCheckVal(e.target.value);
      return;
    }
  };
  // 输入测试链接地址
  const inputPing = (e) => {
    console.log(e);
    config.sdUrl = e.target.value;
    setConfig({ ...config });
  };
  // 更换sd地址
  const changeSdUrl = async () => {
    setSdState(true);
    await showConfig();
    setLinkShow(true);
  };
  // 点击测试链接
  const textPing = () => {
    testLocalPing({
      localSdUrl: config.sdUrl,
    })
      .then((res) => {
        console.log(res, "测试本地sd联机");
        if (res.code == 200) {
          message.success("链接成功！");
        } else {
          message.error("链接失败！");
        }
        setLinkShow(false);
      })
      .catch(() => {
        message.error("链接失败！");
      })
      .finally(() => {});
  };
  useEffect(() => {
    showConfig();
  }, []);
  return (
    <ConfigProvider
      theme={{
        components: {
          Radio: {
            buttonColor: "yellow",
          },
        },
      }}>
      <Modal open={linkShow} onCancel={cancelLink} footer={null}>
        <div className={style.linkBox}>
          <Input value={config.sdUrl} onChange={inputPing}></Input>
          <div>
            <Button type='primary' onClick={textPing}>
              测试链接
            </Button>
          </div>
        </div>
      </Modal>
      <div className={style.box}>
        <div className={style.content}>
          <img src={Book} alt='' />
          <div>教程</div>
        </div>
        <div className={style.listBox}>
          <div className={style.listTitle}>
            <div>基础配置</div>
          </div>
          <div className={style.listConent}>
            {/* <div className={style.listItem}>
                        <div>SD地址</div>
                        <input type="text"  placeholder={'请输入'}/>
                        <div className={style.itemBtn}>测试连接</div>
                    </div> */}
            <div className={style.listItem}>
              <div>剪辑草稿目录</div>
              <input
                type='text'
                readOnly
                disabled
                placeholder={"请选择"}
                value={config.jianYingDraftFolder}
              />
              <div className={style.itemBtn} onClick={openDir}>
                选择路径
              </div>
            </div>
            {/* <div className={style.listItem}>
                        <div>抽帧速度</div>
                        <input type="text" defaultValue={4} placeholder={'请输入'}/>
                        <div className={style.itemBtn}>恢复默认</div>
                    </div> */}
            {/* <div className={style.listItem}>
                        <div>Key</div>
                        <input type="text"  placeholder={'请输入'}/>
                        <div className={style.itemBtn}>保存</div>
                    </div> */}
            <div className={style.listItemSet}>
              <div>SD服务配置</div>
              <div>
                <Radio.Group onChange={changeLink} value={checkVal}>
                  <Radio value={1}>绘唐云端SD</Radio>
                  <Radio value={2}>配置本地或云端 SD</Radio>
                </Radio.Group>
              </div>
              <div>
                <div className={style.listItemSetTip}>
                  你可以前往我的页面购买SD算力。 <span>了解详情</span>
                </div>
                <div className={style.listItemSetTip}>
                  自定义 Stable Diffusion 直连
                  <span
                    style={{
                      color: "#aeaeae",
                      margin: "0 10px",
                    }}>
                    请唤起sd-webui页面后，复制地址到此测试
                  </span>
                  <span>点击学习安装本地 SD</span>
                </div>
              </div>
              {checkVal == 2 && (
                <div className={style.likeListItem}>
                  <input
                    disabled
                    type='text'
                    defaultValue={config.sdUrl}
                    value={config.sdUrl}
                    placeholder={"例如：http://127.0.0.1:7860"}
                  />
                  <div className={style.itemBtn} onClick={changeSdUrl}>
                    更换地址
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};
export default App;
