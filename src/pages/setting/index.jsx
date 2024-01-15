import { useEffect, useState } from "react";
import style from "./index.module.less";
import Book from "/public/assets/book.png";
import { setFileCatalog, getFileCatalog } from "@/api/api.js";
import { dialog } from "@tauri-apps/api";
import { message } from "antd";
const App = () => {
  const [fileSrc, setfileSrc] = useState("");
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
          message.success('草稿目录设置成功！')
          setfileSrc(fileUrl);
        })
        .catch((err) => {
          console.log(etr);
        });
    }
  };
  //  复现文件夹地址
  const showFileSrc = () => {
    getFileCatalog().then((res) => {
      console.log(res);
      if (res.code == 200) {
        setfileSrc(res.data.jianYingDraftFolder);
      }
    });
  };
  useEffect(()=>{
    showFileSrc
  },[])
  return (
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
              value={fileSrc}
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
        </div>
      </div>
    </div>
  );
};
export default App;
