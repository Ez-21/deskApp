import { useState } from 'react'
import style from './index.module.less'
import { getImageUrl } from '@/func'
const App = () => {
    const [index, setIndex] = useState(0)
    const ckMsgCard = (item) => {
        alert(item)
        setIndex(item)
    }
    return (
        <div className={style.box}>
            <div className={style.content}>
                <div className={style.left}>
                    <div className={style.bar}>
                        近期对话
                        <img src={getImageUrl('more')} alt="" />
                    </div>
                    {
                        new Array(30).fill(Math.random(1, 100)).map((item => (
                            <div className={style.msgCard} style={index == item ? {
                                background: 'rgba(255, 255, 255, 0.12)',
                                color: 'rgba(255, 255, 255, 0.85)'
                            } : null} key={Math.random(1, 100)} onClick={() => ckMsgCard(item)}>
                                这是一个话题
                            </div>
                        )))
                    }
                </div>
                <div className={style.right}>
                    <div className={style.footer}>
                        <div className={style.sendBox}>
                            <input type="text" />
                            <img src={getImageUrl('send')} alt="" />
                        </div>
                    </div>
                        <div className={style.flexL} >
                        <div className={style.flexLcon}>
                            <img src={getImageUrl('logo')} alt="" className={style.headPic} />
                            <div className={style.msg}>1231313123123</div>
                        </div>
                    </div>
                    <div className={style.flexR}>
                        <div className={style.flexRcon}>
                            <img src={getImageUrl('logo')} alt="" className={style.headPic} />
                            <div className={style.msg}>1231313123123</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default App