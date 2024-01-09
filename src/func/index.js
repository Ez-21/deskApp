import {
  appWindow,
  LogicalSize,
  LogicalPosition,
} from "@tauri-apps/api/window";
import { readDir } from "@tauri-apps/api/fs";
import { useStore } from "@/store";
// import { playSound } from '@tauri-apps/api/tauri';
/*
 * @ des 播放提示音
 * */
// async function playNotificationSound() {
//   try {
//     await playSound({
//       path: '/path/to/sound.wav', // 提示音文件的路径
//       volume: 0.5, // 音量值介于 0.0 到 1.0 之间
//     });
//     console.log('提示音已播放');
//   } catch (error) {
//     console.error('播放提示音时出错:', error);
//   }
// }

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
  return new URL(`/src/assets/${name}.png`, import.meta.url).href;
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
@des 图片本地目录地址
* */
function appImagePath(type) {
  if (type == "origin") {
    return "/pyExe/userDeatils/images";
  }
  if (type == "workfolder") {
    return "/pyExe/workfolder";
  }
}

/*
@des 一键生图任务队列
@params  data:Array 数据  
         fn:Promise 接口请求方法  
         breakStatus:打断任务标识
* */
function queeTask(data, fn) {
  sessionStorage.setItem("breakStatus", "0");
  sessionStorage.setItem("stateData", JSON.stringify({}));
  // 当前任务
  let targetNum = 1;
  // 任务总数
  let totalNum = data.length;
  // 数据id
  let value = data[targetNum - 1];
  // 进度值
  let progress = undefined;

  return async function gen(res, rej) {
    // 判断中止状态
    let breakStatus = sessionStorage.getItem("breakStatus");
    if (Boolean(+breakStatus)) {
      return rej({
        status: "break",
      });
    } else if (targetNum == totalNum) {
      // 任务执行完毕
      return res({
        status: "done",
      });
    } else if (targetNum < totalNum) {
      await fn(value);
      ++targetNum;

      value = data[targetNum - 1];
      // 进度
      progress = ((targetNum / totalNum) * 100).toFixed(2);
      console.log(progress, "任务进度");
      // 设置进度
      gen(res, rej);
      return res({
        status: "ing",
        targetId: value,
        progress,
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
  appImagePath,
  queeTask,
};
