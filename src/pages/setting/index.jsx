import style  from './index.module.less'
import Book from '@/assets/book.png'

const App = ()=>{
    return(
        <div className={style.box}>
           <div className={style.content}>
               <img src={Book} alt=""/>
               <div>
                   教程
               </div>
           </div>
            <div className={style.listBox}>
                <div className={style.listTitle}>
                       <div>
                           基础配置
                       </div>
                </div>
                <div className={style.listConent}>
                    <div className={style.listItem}>
                        <div>SD地址</div>
                        <input type="text"  placeholder={'请输入'}/>
                        <div className={style.itemBtn}>测试连接</div>
                    </div>
                    <div className={style.listItem}>
                        <div>剪辑草稿目录</div>
                        <input type="text"  placeholder={'请输入'}/>
                        <div className={style.itemBtn}>选择路径</div>
                    </div>
                    <div className={style.listItem}>
                        <div>抽帧速度</div>
                        <input type="text" defaultValue={4} placeholder={'请输入'}/>
                        <div className={style.itemBtn}>恢复默认</div>
                    </div>
                    <div className={style.listItem}>
                        <div>Key</div>
                        <input type="text"  placeholder={'请输入'}/>
                        <div className={style.itemBtn}>保存</div>
                    </div>

                </div>
            </div>
        </div>
    )
}
export  default  App