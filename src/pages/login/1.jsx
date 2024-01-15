import { useEffect,useState } from "react"
import { userWxLogin} from "@/api/api.js";
const App = ()=>{
    const [msg,setMsg] = useState('')
    useEffect(()=>{
        userWxLogin().then(res=>{
            alert(JSON.stringify(res))
        }).catch((err)=>{
            alert(JSON.stringify(err))
            setMsg(JSON.stringify(err))
        })
    },[])
    return (
            <div>
                {msg}
            </div>
    )
}
export default App