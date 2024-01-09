import style from "./index.module.less";
import ImgUrl from "@/assets/twelve.jpeg";
import Next from "@/assets/next.png";
import { Checkbox, Progress } from "antd";
import BackBar from "@/components/backBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTaskDetial, setVideoFraming, getProgress } from "@/api/api.js";
import { message } from "antd";
import { appImagePath } from "@/func/index.js";
export default function () {
  const [checkAllStatus, setCheckAllStatus] = useState(true);
  const params = useLocation();
  const goPage = useNavigate();
  const [content, setContent] = useState([]);

  const queeTask = (data) => {
    let index = 0;
    let val = data[index];
    function quee () {
        setVideoFraming({ draftIds: [val] }).then((res) => {
          if (res.code == 200) {
            console.log(res.data);
            let timeTravel = setInterval(async() => {
              let status = await getTaskProgress(val);
              if(status){
                clearInterval(timeTravel)
                ++index
                val = data[index]
                if(index==data.length){
                  return
                }else{
                  return quee()
                } 
              }
              console.log(status,'状态');
            }, 1000);
          }
        });
    };
    return quee()
  };
  // 点击抽帧
  const pushPicture = () => {
    // 筛选出 已勾选的草稿
    let draftIds = content
      .filter((item) => item.checked)
      .map((item) => item.draftId);
    if (draftIds.length == 0) {
      return message.error("请至少勾选一条草稿！");
    }else{
      queeTask(draftIds)
    }
  };
  // 获取任务进度
  const getTaskProgress = async (val) => {
    let status = undefined;
    await getProgress({ frameExtractionTaskId: val }).then((res) => {
      console.log(res.data.progress);
      if (res.data.progress) {
        content.forEach((item) => {
          if (item.draftId == val) {
            item.draftProgress = res.data.progress;
          }
        });
        if (res.data.progress == 100) {
          status = true;
        }
        setContent([...content]);
      }
    });
    return status;
  };
  // 点击生图
  const createPicture = () => {
    // 筛选出进度不是100% 提示
    let checkedData = content.filter((item) => item.checked);
    let noFinish = checkedData.filter(
      (item) => Number(item.draftProgress) !== 100
    );
    if (checkedData.length == 0) {
      return message.error("请至少勾选一条草稿！");
    }
    if (noFinish.length != 0) {
      return noFinish.forEach((item) => {
        console.log(item, "nofinsh");
        message.error(`${item.draftName}未完成抽帧！无法打开！`);
      });
    } else {
    let draftIds = checkedData.map((item) => item.draftId);
    goPage("/Step2PushPicture", {
      state: { draftIds, taskId: params.state?.taskId },
    });
    }
  };
  // 获取列表数据
  const getlist = (task_id) => {
    getTaskDetial({ task_id })
      .then((res) => {
        console.log(res);
        let {
          data: { draftList },
        } = res;
        draftList.forEach((item) => {
          item.checked = true;
          // 转换成相对路径
          item.draftImage = item.draftImage
            .split("\\quick")[1]
            .replaceAll("\\", "/");
        });
        setContent(draftList);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    console.log(params, "路径参数地址========================================");
    getlist(params.state?.taskId);
  }, []);
  const checkAll = () => {
    setCheckAllStatus(!checkAllStatus);
    content.forEach((item) => {
      item.checked = !checkAllStatus;
    });
    setContent([...content]);
  };
  const changeCheck = (index) => {
    content[index].checked = !content[index].checked;
    setContent([...content]);
  };
  return (
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
        <div style={{ display: "flex", gap: "15px" }}>
          <div className={style.frame} onClick={createPicture}>
            一键生图
          </div>
          <div className={style.frame} onClick={pushPicture}>
            一键抽帧
          </div>
        </div>
      </div>
      <div className={style.checkAll}>
        <Checkbox onChange={checkAll} checked={checkAllStatus}></Checkbox>
        <span>选择视频</span>
        <div className={style.codeNumer}>
          <div>{content.length}</div>
        </div>
      </div>
      <div className={style.contentBox}>
        {content.map((item, index) => (
          <div className={style.contentItem} key={item.draftId}>
            {/* item.draftImage  */}
            <img src={item.draftImage} alt='' />
            <div className={style.mask}>
              <Progress percent={item.draftProgress} type='circle'></Progress>
            </div>
            <div className={style.itemBottom}>
              <div>{item.draftName}</div>
              <Checkbox
                onChange={(e) => changeCheck(index)}
                checked={item.checked}></Checkbox>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
