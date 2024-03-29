import Back from "@/assets/back.png";
import Hot from "@/assets/hot.png";
import Book from "@/assets/book.png";
import style from "./index.module.less";
import ht from "@/assets/ht.png";
export default () => {
  return (
    <div className={style.box}>
      <div className={style.back}>
        <img
          src={Back}
          alt=''
          className={style.backImg}
          onClick={() => history.back(-1)}
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
