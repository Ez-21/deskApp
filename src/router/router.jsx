import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/index";
import Login from "@/pages/login";
import Home from "@/pages/home";
import Gpt from "@/pages/gpt";
import Setting from "@/pages/setting";
import Mine from "@/pages/Mine";
import Step1FrameNumber from "@/pages/Step1_frameNumber";
import Step2PushPicture from "@/pages/Step2_pushPicture";
import Step3SyncVideo from "@/pages/Step3_syntVideo";
export default [
  {
    path: "/",
    element: <Login index></Login>,
  },
  {
    path: "/index",
    element: <Index></Index>,
    children: [
      {
        path: "/index/home",
        element: <Home index></Home>,
      },
      {
        path: "/index/gpt",
        element: <Gpt></Gpt>,
      },
      {
        path: "/index/setting",
        element: <Setting></Setting>,
      },
      {
        path: "/index/mine",
        element: <Mine></Mine>,
      },
    ],
  },
  // 视频抽帧
  {
    path: "/Step1FrameNumber",
    element: <Step1FrameNumber></Step1FrameNumber>,
  },
  //反推生图
  {
    path: "/Step2PushPicture",
    element: <Step2PushPicture></Step2PushPicture>,
  },
  // 合成视频
  {
    path: "/Step3SyncVideo",
    element: <Step3SyncVideo></Step3SyncVideo>,
  },
];
