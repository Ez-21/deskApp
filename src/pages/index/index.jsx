import {useEffect, useRef, useState} from "react";
import {setWindowSize, getImageUrl,setWindowCenter} from "@/func/index.js";
import {Outlet, useNavigate} from 'react-router-dom'
import style from './index.module.less'
import girl from '@/assets/logo.png'
import logoText from '@/assets/hot.png'

const App = () => {
    console.log(import.meta.url)
    const goPage = useNavigate()
    const [tabkey, setTabKey] = useState(1)
    const [route, setRoute] = useState([
        {
            id: 1,
            path: '/index/home',
            label: '首页',
            imgUrl: getImageUrl('home')
        },
        {
            id: 2,
            path: '/index/gpt',
            label: '助手',
            imgUrl: getImageUrl('gpt')

        },
        {
            id: 3,
            path: '/index/setting',
            label: '配置',
            imgUrl: getImageUrl('setting')
        },
        {
            id: 4,
            path: '/index/mine',
            label: '我的',
            imgUrl: getImageUrl('mine')

        }
    ])
    const ck = (item) => {
        setTabKey(item.id)
        goPage(item.path)
    }
    useEffect(() => {
        setWindowSize(1440, 750)
        // setWindowCenter()
    }, [])
    return (
        <div className={style.box}>
            <div className={style.left}>
                <div className={style.logoBox}>
                    <img src={girl} alt=""/>
                    <img src={logoText} alt=""/>
                </div>
                <div className={style.changeRoute}>
                    {
                        route.map(item => (
                            <div style={tabkey === item.id ? {
                                background: "#2E2EFF",
                                borderRadius: "8px",
                            } : null} className={style.ItemBox} key={item.id} onClick={() => ck(item)}>
                                <img src={item.imgUrl} alt=""/>
                                <div>
                                    {item.label}
                                </div>
                            </div>
                        ))
                    }

                </div>
            </div>
            <div className={style.right}>
                <Outlet></Outlet>
            </div>
        </div>
    )
}
export default App