import {
  appWindow,
  LogicalSize,
  LogicalPosition,
} from "@tauri-apps/api/window";
import { readDir } from "@tauri-apps/api/fs";
import { useStore } from "@/store";
import { useNavigate } from "react-router-dom";
import Ht from "/public/assets/ht.png";
import styleDes from "/public/dubData/style.ts";
import roleDes from "/public/dubData/role.ts";
import voices from "../../public/dubData/voices";
import { message } from "antd";
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

// @des 设置tauri 窗口图标

async function setWindowIcon() {
  let url = new URL("/public/assets/ht.png", import.meta.url);
  let data = await appWindow.setIcon(url.pathname);
  console.log(data, "icon");
}

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
    // 当前分镜总数
    totalNum = draft.storyboardList.length + 1;
    // 判断中止状态
    let breakStatus = sessionStorage.getItem("breakStatus");
    if (Boolean(+breakStatus)) {
      return rej({
        status: "break",
      }); //判断单条草稿任务是否已经全部结束
    }
    if (targetNum == totalNum) {
      // 判断是否全部当前草稿下的分镜任务执行完毕
      // 如果是 则 设置数据后开启下一轮草稿任务的队列
      targetNum = 1;
      ++draftIndex;
      // 判断是否已经是最后一个草稿任务 如果是就直接结束
      if (draftIndex == checkVal.length) {
        console.log("最后");
        // 任务执行完毕
        return res({
          status: "done",
        });
      }
      draft = checkVal[draftIndex];
      totalNum = draft.storyboardList.length + 1;
      draft_board_uuid = draft.storyboardList.map((item) => item.id);
      // value = draft_board_uuid[targetNum - 1];
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
    } else if (targetNum < totalNum) {
      progress = ((targetNum / totalNum) * 100).toFixed(2);
      res({
        status: "ing",
        draftName: draft.draftName,
        totalNum,
        draftIndex,
        progress,
      });
      await fn(value)
        .then((res) => {
          console.log(res, "生图res");
          if (res.code == 200) {
            message.success("生图成功！");
            return;
          }
          if ((res.code = 201)) {
            message.info("任务排队中...");
            return;
          }
        })
        .finally(() => {
          ++targetNum;
          value = draft_board_uuid[targetNum - 1];
          // 进度
          progress = ((targetNum / totalNum) * 100).toFixed(2);
          console.log(progress, "任务进度");
          // 设置进度
          res({
            status: "ing",
            progress,
            draftName: draft?.draftName,
            totalNum,
            draftIndex,
          });
        });
      return gen(res, rej);
    }
  };
}

const getStyleDes = (key) => {
  return styleDes.find((item) => item.keyword === key);
};

const getRoleDes = (key) => {
  return roleDes.find((item) => item.keyword === key);
};

// 设置音色对应数据
function getVioceData(
  params = { word: "", topFlag: "", category: "", gender: "", tag: "" }
) {
  const data = voices
    .filter((v) => v.LocalName.includes(params.word))
    .filter((v) => v.gender.includes(params.gender))
    .map((v) => {
      return {
        id: v.name,
        displayName: v.LocalName,
        name: v.name,
        isFree: v.LocalName !== "云健",
        isStar: false,
        isSupper24K: true,
        avatar: "",
        roles: v.VoiceRoleNames.split(",").map((n) => {
          const des = getRoleDes(n);
          return { label: des?.word || n, value: n, emoji: des?.emoji };
        }),
        styles: v.VoiceStyleNames.split(",").map((n) => {
          const des = getStyleDes(n);
          return { label: des?.word || n, value: n, emoji: des?.emoji };
        }),
      };
    });

  return data;
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
  setWindowIcon,
  getVioceData,
};
