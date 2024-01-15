/*
 * @Author: w-qianzz 2275862144@qq.com
 * @Date: 2024-01-04 18:55:31
 * @LastEditors: w-qianzz 2275862144@qq.com
 * @LastEditTime: 2024-01-10 22:03:39
 * @FilePath: \quick\src\pages\Step2_pushPicture\componentTheme.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 主题变量
var theme = {
  components: {
    Tabs: {
      itemSelectedColor: "white",
      itemColor: "rgba(255, 255, 255, 0.45)",
    },
    Slider: {
      railBg: "rgba(255, 255, 255, 0.08)",
      algorithm: true,
      handleColor: "#1755FF",
      handleActiveColor: "#1755FF",
      trackBg: "#1755FF",
    },
    Spin: {
      contentHeight:'160px'
    },
    Select: {
      selectorBg: "#1E1E1E",
      colorTextPlaceholder: "#B0B0B0",
      colorBgElevated: "#181818",
      optionActiveBg: "#272727",
      optionSelectedBg: "#272727",
      colorBorder: "#4B4B4B",
      colorText: "#B0B0B0",
    },
    Table: {
      bodySortBg: "#181818 !important",
      headerBg: "#212121!important",
      headerColor: "white",
      headerSplitColor: "#2A2A2A",
      colorBgContainer: "#181818",
      lineType: "transparent",
    },
    InputNumber: {
        colorText:'#BDBDBD',
        colorBgContainer:'#232323',
        colorBorder:'#4F4F4F'
      },
  },
};
export default theme;
