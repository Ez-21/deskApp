import {
  appWindow,
  LogicalSize,
  LogicalPosition,
} from "@tauri-apps/api/window";
import { readDir } from "@tauri-apps/api/fs";
import { useStore } from "@/store";
import { useNavigate } from "react-router-dom";
/*
 * @ des 检测用户登录天数
 * */
function checkLoginStatus() {
  const loginTime = localStorage.getItem("loginTime");
  if (loginTime) {
    const currentTime = Date.now();
    const threeDays = 3 * 24 * 60 * 60 * 1000; // 三天的毫秒数
    if (currentTime - loginTime > threeDays) {
      const goPage = useNavigate();
      localStorage.clear("loginTime");
      goPage("/", { replace: true });
    }
  }
}

/*
 * @ des 读取文件目录
 * */
async function readDirectory(path) {
  try {
    const directoryContents = await readDir(path);
    console.log("目录内容:", directoryContents);
  } catch (error) {
    console.error("读取目录时出错:", error);
  }
}

/*
 * @ des 设置应用窗口尺寸
 * */
async function setWindowSize(width, height) {
  console.log("已修改窗口尺寸");
  await appWindow?.setSize(new LogicalSize(width, height));
}
/*
 * @desc vite 引用图片
 * */
function getImageUrl(name) {
  return new URL(`/public/assets/${name}.png`, import.meta.url).href;
}
/*
 * desc关闭窗口
 * */

function closeWindow() {
  appWindow.close();
}
/*
@des 最小化窗口
* */

function minWindow() {
  appWindow.minimize();
}

/*
@des 最大化窗口
* */

function maxWindow() {
  appWindow.maximize();
}

/*
@des 最大化窗口
* */

function setPosition(x, y) {
  //     appWindow.setPosition(new LogicalPosition(x,y))
}
/*
@des 中心化窗口
* */
function setWindowCenter() {
  appWindow.center();
}
/*

/*
@des 一键生图任务队列
@params  checkVal:Array 被选中的数据List  
         fn:Promise 接口请求方法  
         breakStatus:打断任务标识
* */
function queeTask(checkVal, fn) {
  sessionStorage.setItem("breakStatus", "0");
  sessionStorage.setItem("stateData", JSON.stringify({}));
  // 当前任务
  let targetNum = 1;
  // 单个草稿任务的总分镜数量
  let totalNum = undefined;
  // 进度值
  let progress = undefined;
  let draftIndex = 0;
  // 当前执行的草稿任务
  let draft = checkVal[draftIndex];
  // 默认值是选中的第一个草稿任务下的第一个分镜id
  let value = checkVal.find((item) => checkVal[0].storyboardList[0]).id;
  // 获取当前任务下的所有分镜id
  let draft_board_uuid = draft.storyboardList.map((item) => item.id);
  return async function gen(res, rej) {
    value = draft_board_uuid[targetNum - 1];
    // 当前执行的草稿任务index
    draftIndex = checkVal.findIndex(
      (val) => JSON.stringify(val) == JSON.stringify(draft)
    );
    totalNum = draft.storyboardList.length;
    // 判断中止状态
    let breakStatus = sessionStorage.getItem("breakStatus");
    if (Boolean(+breakStatus)) {
      return rej({
        status: "break",
      });     //判断单条草稿任务是否已经全部结束
    } else if (targetNum > totalNum) {
      // 判断是否全部草稿任务执行完毕
      if (draftIndex != checkVal.length) {
        // 如果不是 则 设置数据后开启下一轮草稿任务的队列
        targetNum = 1;
        ++draftIndex;
        if (draftIndex == checkVal.length) {
          console.log("最后");
          // 任务执行完毕
          return res({
            status: "done",
          });
        }
        draft = checkVal[draftIndex];
        totalNum = draft.storyboardList.length;
        console.log(draft, "draft==================");
        draft_board_uuid = draft.storyboardList.map((item) => item.id);
        value = draft_board_uuid[targetNum - 1];
        // 第二轮开始时的默认进度
        progress = 3;
        gen(res, rej);
        return res({
          status: "ing",
          progress,
          draftName: draft.draftName,
          totalNum,
          draftIndex,
        });
      }
    } else if (targetNum <= totalNum) {
      res({
        status: "ing",
        targetId: value,
        draftName: draft.draftName,
        totalNum,
        draftIndex,
      });
      await fn(value);
      ++targetNum;
      value = draft_board_uuid[targetNum - 1];
      // 进度
      progress = ((targetNum / totalNum) * 100).toFixed(2);
      console.log(progress, "任务进度");
      // 设置进度
      gen(res, rej);
      return res({
        status: "ing",
        progress,
        draftName: draft?.draftName,
        totalNum,
        draftIndex,
      });
    }
  };
}

export {
  setWindowSize,
  minWindow,
  maxWindow,
  closeWindow,
  setPosition,
  setWindowCenter,
  getImageUrl,
  readDirectory,
  queeTask,
  checkLoginStatus,
};
