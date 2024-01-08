import request from "./axios";
// 微信登录
export const userWxLogin = () => {
  return request({
    url: "/login",
    method: "get",
  });
};
// 检测用户微信扫码登录状态
export const userWxState = (data) => {
  return request({
    url: "/login/state_query",
    method: "post",
    data,
  });
};
// 创建任务
export const createTask = (data) => {
  return request({
    url: "/api/createReverseInferenceTask",
    method: "post",
    data,
  });
};
//获取任务列表
export const getTaskList = (data) => {
  return request({
    url: "/api/getTaskList",
    method: "get",
    data,
  });
};
// 删除任务
export const delteTask = (params) => {
  return request({
    url: `/editing_task/delete/${params}`,
    method: "get",
  });
};
// 获取任务详情 task_id
export const getTaskDetial = (params) => {
  return request({
    url: "/api/getDetails",
    method: "get",
    params,
  });
};
//获取抽帧进度 draftUuid
export const getProgress = (params) => {
  return request({
    url: "/api/getFrameExtractionProgress",
    method: "get",
    params,
  });
};
// 开始抽帧
export const setVideoFraming = (data) => {
  return request({
    url: "/api/videoFraming",
    method: "post",
    data,
  });
};
// sd------------------------------------
// 保存sd中的模型
export const setSdModel = (data) => {
  return request({
    url: `/sd/saveSdSetting`,
    method: "post",
    data
  });
};

// 获取sd页面中的模型 sdlora  模型配置
export const getSdModel = (params) => {
  return request({
    url: `/sd/getSettings/${params}`,
    method: "get",
  });
};

// 保存出图配置
export const setModalOrPricture = (data) => {
  return request({
    url: "/draft/updates",
    method: "post",
    data,
  });
};
// 获取sd 详情数据
export const getSdDetial = (data) => {
  return request({
    // url: "/api/getSdDetails",
    url:'/api/v2/getSdDetails',
    // baseURL:'/proxyUrl',
    method: "post",
    data,
  });
};
// 一键生图
export const createPicHandle = (data,singal) => {
  return request({
    url: "/sd/generateImage",
    singal,
    method: "post",
    data,
  });
};
// 一键反推提示词
export const reverseWord = (data)=>{
  return request({
    url:'/sd/reverseInferencePromptWords',
    method:'post',
    data
  })
}
// 单条数据反推提示词
export const reverseAloneWord = (params)=>{
  return request({
    url:'/api/reverseInferenceOneWord',
    method:'get',
    params
  })
}
// 保存提示词
export const savePrompt =(data)=>{
  return request({
    url:'/draftBoard/savePrompt',
    method:'post',
    data
  })
}
// MJ
// 获取全局风格
export const getGlobalStyle = ()=>{
  return request({
    url:'/api/getStyle',
    method:'get',
  })
}
// 获取MJ详情
export const getMjDetial = (data)=>{
  return request({
    url:'/api/getMjDetails',
    method:'post',
    data
  })
}

// 合成视频--------------------------------
// 查询视频合成进度
export const getVideoProgress = (data) => {
  return request({
    url: "/api/getVideoProgress",
    method: "post",
    data,
  });
};
//合成视频
export const generateVideo = (params) => {
  return request({
    url: "/api/generateVideo",
    method: "get",
    params,
  });
};
// 插入关键帧
export const pushVideoFrame = (data)=>{
  return request({
    url:'/api/generateFrame',
    method:'post',
    data
  })
} 
