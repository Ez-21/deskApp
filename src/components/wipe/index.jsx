import style from "./index.module.less";
import close from "/public/assets/closeWindow.png";
const App = ({ setWipeStatus }) => {
  return (
    <div className={style.box}>
      <div className={style.title}>
        局部处理
        <img
          src={close}
          alt=''
          style={{
            cursor: "pointer",
          }}
          onClick={() => setWipeStatus(false)}
        />
      </div>
      <iframe
        src='http://lama.fyshark.com/'
        width={"100%"}
        frameborder='0'
        height={600}></iframe>
    </div>
  );
};
export default App;
