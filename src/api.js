import axios from "axios"

const base = axios.create({
    baseURL: 'https://54549fz601.zicp.fun',
    // timeout:5000,
    // headers:{
        // 'Content-Type':'',
    // },
});

// 请求拦截器
base.interceptors.request.use(
    config=>{

        let token = localStorage.getItem("token");
    if (token) {
        config.headers.token = token;
    }

        return config;
    }
)

// 响应拦截器
base.interceptors.response.use(
    response=>{

        return response.data;
    },
    // error=>{

    //     return Promise.reject(error);
    // }
)

// 封装

//设备列表/设备查询
export function getdevicelist(url,params){

    return base.get(url,{params});
}

//登录
export function login(url,data){
    return base.post(url,data);
}

//设备管理
export function devicemanager(url,params){
    return base.get(url,{params});
}

//设备修改
export function changedevice(url,data){
    return base.put(url,data);
}

//新增设备
export function adddevice(url,data){
    return base.post(url,data);
}

//删除设备
export function deletedevice(url,params){
    return base.delete(url,{params});
}


export default{
    getdevicelist,
    login,
    devicemanager,
    changedevice,
    adddevice,
    deletedevice
};
