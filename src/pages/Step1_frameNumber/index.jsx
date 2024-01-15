import style from "./index.module.less";
import ImgUrl from "/public/assets/twelve.jpeg";
import Next from "/public/assets/next.png";
import { Checkbox, Spin } from "antd";
import BackBar from "@/components/backBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTaskDetial, setVideoFraming, getProgress } from "@/api/api.js";
import { message } from "antd";
import { Progress } from "tdesign-react";
import { convertFileSrc } from "@tauri-apps/api/tauri";
export default function () {
  const [checkAllStatus, setCheckAllStatus] = useState(true);
  const params = useLocation();
  const goPage = useNavigate();
  const [content, setContent] = useState([]);
  let [timeTravel, setTimeTravel] = useState(undefined);

  const queeTask = (draftList) => {
    let index = 0;
    let draftIdsArr = draftList.map((item) => item.draftId);
    let val = draftIdsArr[index];
    function quee() {
      if(index < draftIdsArr.length){
        message.info(`${draftList[index].draftName}开始进行抽帧！`);
      }
      setVideoFraming({ draftIds: [val] }).then((res) => {
        if (res.code == 200) {
          console.log(res.data);
         let timeInter = setInterval(async () => {
            let status = await getTaskProgress(val);
            if (status) {
              clearInterval(timeInter);
              setTimeTravel(undefined);
              ++index;
              val = draftIdsArr[index];
              if (index == draftIdsArr.length) {
                message.success('抽帧任务已全部执行完成！')
                clearInterval(timeInter);
                setTimeTravel(undefined);
                return;
              } else {
                return quee();
              }
            }
            console.log(status, "状态");
          }, 3000);
          setTimeTravel(timeInter);
        }
      });
    }
    return quee();
  };
  // 点击抽帧
  const pushPicture = () => {
    // 筛选出 已勾选的草稿
    let draftList = content.filter((item) => item.checked);
    if (draftList.length == 0) {
      return message.error("请至少勾选一条草稿！");
    } else {
      queeTask(draftList);
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
        console.log("数据", draftList);
        draftList.forEach((item) => {
          item.checked = true;
          // 转换成相对路径
          // item.draftImage = item.draftImage
          //   .split("\\quick")[1]
          //   .replaceAll("\\", "/");
          item.draftImage = convertFileSrc(item.draftImage);
        });
        setContent([...draftList], "god");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getlist(params.state?.taskId);
    return () => {
      console.log(timeTravel,'定时器？？');
        clearInterval(timeTravel)
        setTimeTravel(undefined);
    };
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
          <div className={style.stepKey}>反推生图</div>
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
              {/* <Progress percent={item.draftProgress} type='circle'></Progress> */}
              <Progress
                label
                status={item.draftProgress == 100 ? "success" : "active"}
                style={{
                  width: "80%",
                }}
                size='large'
                percentage={item.draftProgress}></Progress>
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
