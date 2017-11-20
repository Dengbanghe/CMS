import isofetch from 'isomorphic-fetch'
import { message } from 'antd';
const fetch=async(url,data,method='post')=>{
    let formData = new FormData();
    for(let key in data){
        formData.append(key,data[key])
    }
    let res,result={}
    try {
        res = await isofetch(url, {method: method, body: formData})
        if (res.status === 200) {
            result = await res.json();
            if(result.result!=null){
                if(result.result==true){
                    message.success(result.message)
                }else if(result.result==false){
                    message.error(result.message)
                }
            }
        }else if(res.status === 404){
            message.error(`请求路径 ${url} 不存在 请联系管理员`)
        }
    }catch(e){
        message.error(e)
        // console.error(e)
        return res
    }finally {
        return result
    }
}

const remoteHost = 'http://localhost:9876'

module.exports ={fetch,remoteHost}
