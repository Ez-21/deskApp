import Back from "/public/assets/back.png";
import Hot from "/public/assets/hot.png";
import Book from "/public/assets/book.png";
import style from "./index.module.less";
import ht from "/public/assets/ht.png";
import { useNavigate } from "react-router-dom";
export default () => {
  const go = useNavigate()
  return (
    <div className={style.box}>
      <div className={style.back}>
        <img
          src={Back}
          alt=''
          className={style.backImg}
          onClick={() => go('/index/home')}
        />
        <img src={ht} alt='' className={style.ht} />
        <div>
          <img src='' alt='' />
          <img src={Hot} alt='' />
        </div>
      </div>
      <div className={style.book}>
        <img src={Book} alt='' />
        教程
      </div>
    </div>
  );
};
