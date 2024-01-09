import { Progress, Modal, Upload, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import BackBar from "@/components/backBar";
import { useEffect, useState } from "react";
import style from "./index.module.less";
import Add from "@/assets/add.png";
import Delete from "@/assets/delete.png";
import Close from "@/assets/closeWindow.png";
import Book from "@/assets/book.png";
import { ConfigProvider, message, Spin } from "antd";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { dialog } from "@tauri-apps/api";
// 接口
import {
  createTask,
  getTaskList,
  delteTask,
  getTaskDetial,
} from "@/api/api.js";
const App = () => {
  // 文件限制
  const allowedVideoTypes = "video/mp4,video/mpeg,video/quicktime";
  const [show, setShow] = useState(false);
  const [fileShow, setFileShow] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [targetTask, setTargetTask] = useState();
  // 任务列表
  const [taskList, setTaskList] = useState([]);
  //表单
  const [formData, setFormData] = useState({
    taskName: "剪辑任务",
    videoPathList: [],
  });
  const go = useNavigate();
  // 文件handler
  const fileHander = () => {
    dialog.open({ multiple: true, accept: allowedVideoTypes }).then((res) => {
      if (res) {
        setFileShow(true);
        res.forEach((item, index) => {
          res[index] = {
            src: item,
            checked: true,
          };
        });
        setFormData({
          ...formData,
          videoPathList: res,
        });
      }
    });
  };
  // 获取列表
  const getDataList = () => {
    getTaskList().then((res) => {
      console.log(res, "任务列表");
      if (res.code == 200) {
        setTaskList(res.data.taskList);
      }
    });
  };
  // 删除任务
  const deleteTask = (val, e) => {
    setTargetTask(val);
    setShow(true);
    e.stopPropagation();
  };
  // 任务详情
  const getDetial = (val) => {
    go("/Step1FrameNumber", {
      state: {
        taskId: val.taskUuid,
      },
    });
  };
  // 点击modal确认
  const modalDel = () => {
    delteTask(targetTask.taskUuid)
      .then((res) => {
        console.log(res, "删除完成");
        if (res.code == 200) {
          message.success(`草稿任务：${targetTask.taskName}已删除！`);
          getDataList();
        }
      })
      .catch(() => {
        message.error("删除失败！");
      });
    setShow(false);
  };
  const modalCel = () => {
    setShow(false);
  };
  // fileModal 操作
  const fileHandle = (val) => {
    if (val) {
    } else {
      setFileShow(false);
    }
  };
  // 点击check
  const checkedHander = (item) => {
    formData.videoPathList.forEach((val) => {
      if (JSON.stringify(item) == JSON.stringify(val)) {
        item.checked = !item.checked;
      }
    });
    setFormData({
      ...formData,
    });
  };
  // 点击创建
  const createTaskHandle = () => {
    // 筛选出已勾选的
    formData.videoPathList.map((item, index) => {
      if (!item.checked) {
        formData.videoPathList.splice(index, 1);
      }
    });
    // 提取src
    let newVideoSrc = formData.videoPathList.map((item) => item.src);
    // let testSrc = ["D:/Desktop/e58ac96600b58ce9cef62906aec61892.mp4"]
    createTask({
      taskName: formData.taskName,
      videoPathList: newVideoSrc,
    })
      .then((res) => {
        console.log(res);
        let {
          data: { taskId },
        } = res;
        go("/Step1FrameNumber", {
          state: {
            taskId,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getDataList();
  }, []);
  return (
    <ConfigProvider
      theme={{
        components: {
          Progress: {
            remainingColor: "#282828",
          },
        },
      }}>
        <div className={style.box}>
          <div className={style.readContent}>
            <img src={Book} alt='' />
            <div>教程</div>
          </div>
          <Modal
            title={"提示"}
            okText={"删除"}
            onOk={modalDel}
            onCancel={modalCel}
            cancelText={"取消"}
            open={show}>
            <p>是否要删除该任务？</p>
          </Modal>
          {fileShow && (
            <div className={style.creatModalBox}>
              <div className={style.createTaskBox}>
                <div className={style.taskBoxTitle}>
                  <div>创建反推任务</div>
                  <img src={Close} onClick={() => fileHandle(false)} alt='' />
                </div>
                <div className={style.changeName}>
                  任务名称：
                  <input
                    type='text'
                    value={formData?.taskName}
                    onChange={(e) =>
                      setFormData({ ...formData, taskName: e.target.value })
                    }
                  />
                </div>
                <div className={style.fileListTitle}>
                  <div>创建反推视频</div>
                  <div>
                    <div>没有视频？</div>
                    <div className={style.setPath}>配置草稿路径</div>
                  </div>
                </div>

                <div className={style.fileList}>
                  <div className={style.fileItem}>
                    {formData?.videoPathList.map((item) => {
                      return (
                        <div className={style.fileBox} key={item.src}>
                          <Checkbox
                            checked={item.checked}
                            onChange={(e) => checkedHander(item)}></Checkbox>
                          <div>{item.src.split("\\").at(-1)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={style.footer}>
                  <div>
                    <div
                      className={style.cancel}
                      onClick={() => fileHandle(false)}>
                      取消
                    </div>
                    <div className={style.create} onClick={createTaskHandle}>
                      创建
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className={style.content}>
            <div className={style.title}>
              我的草稿
              <div className={style.circle}>{taskList.length}</div>
            </div>
            <div className={style.listBox}>
              <div className={style.createBox} onClick={fileHander}>
                <img src={Add} alt='' />
                <div>创建任务</div>
              </div>
              {[
                taskList.map((item, index) => (
                  <div
                    className={style.taskBox}
                    key={index}
                    onClick={(e) => getDetial(item)}>
                    <div className={style.titleBox}>
                      <div>{item.taskName}</div>
                      <img
                        src={Delete}
                        alt=''
                        onClick={(e) => deleteTask(item, e)}
                      />
                    </div>
                    <div className={style.createTime}>
                      创建时间：{item.createTime}
                    </div>
                    <div>
                      <Progress
                        strokeLinecap={"round"}
                        percent={item.progress ?? 0}
                        size={"small"}
                        strokeColor={"#49AA19"}></Progress>
                    </div>
                  </div>
                )),
              ]}
            </div>
          </div>
        </div>
    </ConfigProvider>
  );
};
export default App;
