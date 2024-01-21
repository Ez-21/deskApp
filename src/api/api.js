import request from "./axios";
//验证是否需要登录
export const judgeLogin = () => {
  return request({
    url: "/verifyLogin",
    method: "post",
  });
};

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
// 获取用户积分
export const getUserScore = () => {
  return request({
    url: "/getScore",
    method: "get",
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
    data,
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
    url: "/api/v2/getSdDetails",
    // baseURL:'/proxyUrl',
    method: "post",
    data,
  });
};
// 一键生图
export const createPicHandle = (data) => {
  return request({
    url: "/sd/generateImage",
    method: "post",
    data,
  });
};
// 一键反推提示词
export const reverseWord = (data) => {
  return request({
    url: "/sd/reverseInferencePromptWords",
    method: "post",
    data,
  });
};
// 一键重写
export const rewritesPost = (data) => {
  return request({
    url: "/sd/rewrites",
    method: "post",
    data,
  });
};
//单条重写
export const rewriteAlonePost = (data) => {
  return request({
    url: "/sd/rewrite",
    method: "post",
    data,
  });
};

// 切换仿图索引 SD&&MJ
export const changeImgIndex = (data) => {
  return request({
    url: "/generatedImages/saveImageIndex",
    method: "post",
    data,
  });
};


// 用户手动编辑重写
export const manualRewrite = (data) => {
  return request({
    url: "/draftBoard/saveRewriteText",
    method: "post",
    data,
  });
};
//单条数据反推提示词
export const reverseAloneWord = (data) => {
  return request({
    url: "/sd/reverseInferenceOneWord",
    method: "post",
    data,
  });
};
// 保存提示词
export const savePrompt = (data) => {
  return request({
    url: "/draftBoard/savePrompt",
    method: "post",
    data,
  });
};
// MJ
// 获取全局风格
export const getGlobalStyle = () => {
  return request({
    url: "/sd/getStyle",
    method: "get",
  });
};
// 获取MJ详情
export const getMjDetial = (data) => {
  return request({
    url: "/mj/getMjDetails",
    method: "post",
    data,
  });
};

// 保存MJ风格配置
export const setMjStyle = (data) => {
  return request({
    url: "/mj/saveMjSettings",
    method: "post",
    data,
  });
};

// 合成视频--------------------------------
// 一键轮询关键帧
export const generateAllFrame = (data) => {
  return request({
    url: "/api/generateAllFrame",
    method: "post",
    data,
  });
};
// 获取视频草稿
export const getVideoDetail = (data) => {
  return request({
    url: "/api/getVideoDetails",
    method: "post",
    data,
  });
};
// 查询音色
export const getVoice = () => {
  return request({
    url: "/sd/getSoundColor",
    method: "get",
  });
};
// 查询视频合成进度
export const getVideoProgress = (data) => {
  return request({
    url: "/api/getVideoProgress",
    method: "post",
    data,
  });
};
//合成视频
export const generateVideo = (data) => {
  return request({
    url: "/api/videoSynthesizer",
    method: "post",
    data,
  });
};
// 生成音频
export const generateAudio = (data) => {
  return request({
    url: "/sd/generateSound",
    method: "post",
    data,
  });
};
// 单个分镜生成音频
export const generateAudioOne = (data) => {
  return request({
    url: "/sd/generateSoundOne",
    method: "post",
    data,
  });
};
// 插入关键帧
export const pushVideoFrame = (data) => {
  return request({
    url: "/api/generateFrame",
    method: "post",
    data,
  });
};
// 插入单个关键帧
export const pushAloneVideoFrame = (data) => {
  return request({
    url: "/api/generateSingleFrame",
    method: "post",
    data,
  });
};
// MIne
// 微信支付(获取二维码)
export const getWxPayCode = (data) => {
  return request({
    url: "/pay",
    method: "post",
    data,
  });
};
// 查询微信订单状态
export const getWxPayState = (data) => {
  return request({
    url: "/pay/query",
    method: "post",
    data,
  });
};
// 获取折扣信息
export const getDiscount = () => {
  return request({
    url: "/getDiscount",
  });
};
// 获取用户机器码
export const getSecretKey = (data) => {
  return request({
    url: "/getSecretKey",
    method: "get",
  });
};
// 激活
export const getActivate = (data) => {
  return request({
    url: "/activate",
    method: "post",
    data,
  });
};
// 激活状态查询
export const getActivateState = (data) => {
  return request({
    url: "/verify",
    method: "get",
  });
};
// 退出登录
export const exitLogin = (data) => {
  return request({
    url: "/logout",
    method: "post",
  });
};
// 退出App终端
export const exitApp = (data) => {
  return request({
    url: "/exit",
    method: "post",
  });
};

// 配置
// 保存剪辑草稿目录
export const setFileCatalog = (data) => {
  return request({
    url: "/config/saveConfig",
    method: "post",
    data,
  });
};

// 获取剪辑配置
export const getFileCatalog = (data) => {
  return request({
    url: "/config/getConfig",
    method: "get",
  });
};
// 获取本地大模型
export const getLocalModel = () => {
  return request({
    url: "/sd/loadCKPTModelList",
    method: "get",
  });
};
// 获取本地VAE
export const getLocalVae = () => {
  return request({
    url: "/sd/loadCKPTModelList",
    method: "get",
  });
};
// 获取本地采样器
export const getLocalSampling = () => {
  return request({
    url: "/sd/loadSamplers",
    method: "get",
  });
};

// 获取本地lora
export const getLocalLora = () => {
  return request({
    url: "/sd/loadLora",
    method: "get",
  });
};

// 切换本地大模型
export const changeLocalModal = (data) => {
  return request({
    url: "/sd/switchCKPTModel",
    method: "post",
    data,
  });
};

// 切换本地Vae
export const changeLocalVae = (data) => {
  return request({
    url: "",
    method: "post",
    data,
  });
};
// 测试本地Sd链接
export const testLocalPing = (data) => {
  return request({
    url: "/sd/testConnectToLocalSd",
    method: "post",
    data,
  });
};

// 切换云端||本地
export const switchCloud = () => {
  return request({
    url: "/sd/switchCloudSd",
    method: "post",
  });
};

//gpt
// 获取全部对话
export const getAllMsg = (data) => {
  return request({
    url: "/gpt/getConversation ",
    method: "get",
  });
};

// 删除对话
export const delgptMsg = (data) => {
  return request({
    url: `/gpt/delete/${data}`,
    method: "get",
  });
};

// 更新对话数据
export const updategptMsg = (data) => {
  return request({
    url: `/gpt/updates`,
    method: "post",
    data,
  });
};
// 进行对话
export const chatGpt = (data) => {
  return request({
    url: `/gpt/chat`,
    method: "post",
    data,
  });
};
