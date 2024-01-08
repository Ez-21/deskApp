import  {lazy,Suspense} from "react";
import {createBrowserRouter} from "react-router-dom";
const Index  = lazy(()=>import('@/pages/index'))
const Login = lazy(()=>import('@/pages/login'))
const Home = lazy(()=>import('@/pages/home'))
const Gpt = lazy(()=>import('@/pages/gpt'))
const Setting = lazy(()=>import('@/pages/setting'))
const Step1FrameNumber = lazy(()=>import('@/pages/Step1_frameNumber'))
const Step2PushPicture = lazy(()=>import('@/pages/Step2_pushPicture'))
const Mine = lazy(()=>import('@/pages/Mine'))
const Step3SyncVideo = lazy(()=>import('@/pages/Step3_syntVideo'))
export  default  createBrowserRouter([
    {
        path:'/',
        element:<Login index></Login>
    },
    {
        path:'/index',
        element:<Index></Index>,
        children:[
            {
                path:'/index/home',
                element:<Home index></Home>
            },
            {
                path:'/index/gpt',
                element:<Gpt></Gpt>
            },
            {
                path:'/index/setting',
                element:<Setting></Setting>
            },
            {
                path:'/index/mine',
                element:<Mine></Mine>
            }
        ]
    },
    // 视频抽帧
    {
        path:'/Step1FrameNumber',
        element:<Step1FrameNumber></Step1FrameNumber>
    },
    //反推生图
    {
        path:'/Step2PushPicture',
        element:<Step2PushPicture></Step2PushPicture>
    },
    // 合成视频
    {
        path:'/Step3SyncVideo',
        element:<Step3SyncVideo></Step3SyncVideo>
    }
])