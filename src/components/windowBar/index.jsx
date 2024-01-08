import style from './index.module.less'
import min from '@/assets/min.png'
import max from '@/assets/max.png'
import close from '@/assets/closeWindow.png'
import {Modal} from 'antd';
// 导入窗口自定义功能
import {
    minWindow,
    maxWindow,
    closeWindow,
    setPosition
} from '@/func'
import {useEffect, useLayoutEffect, useState,useRef} from "react";
// 监听拖拽事件

const App = ({children}) => {
    const barRef = useRef()
    const [closeStatus, SetCloseStatus] = useState(false)
    const [color, SetColor] = useState('black')
    useLayoutEffect(() => {
        changeBarBackGround()
    }, [window.location.pathname])
    // barRef.current?.addEventListener('dragstart', (event) => {
    //     console.log(event,'e')
    //     setPosition(event.pageX,event.pageX)
    // });
    //     barRef.current?.addEventListener('dragend', (event) => {
    //         console.log(event,'e')


    //         setPosition(event.pageX,event.pageX)
    //     });
    function changeBarBackGround() {
        console.log(location.pathname)
        if (location.pathname === '/') {
            SetColor(val => ' #1F1F1F')
        } else if (location.pathname.includes('/index')) {
            SetColor(val => '#141318');
        } else {
            SetColor(val => 'black')
        }

    }
    function checkOut(){
        if(location.pathname==('/index/gpt')){
            return
        }else{
            maxWindow()
        }
    }
    return (
        <div data-tauri-drag-region={true}  className={style.box} ref={barRef} style={{
            background: color
        }} >
            <div className={style.set}>
                <div onClick={minWindow}>
                    <img src={min} alt=""/>
                </div>
                <div onClick={checkOut}>
                    <img src={max} alt=""/>
                </div>
                <div onClick={() => SetCloseStatus(true)}>
                    <img src={close} alt=""/>
                </div>
            </div>
            <div className={style.content}>
                {children}
            </div>
            <Modal title="提示" cancelText={'取消'} okText={'退出'} open={closeStatus} onOk={closeWindow}
                   onCancel={() => SetCloseStatus(false)}>
                <p>确认退出吗？</p>
            </Modal>
        </div>
    )
}
export default App