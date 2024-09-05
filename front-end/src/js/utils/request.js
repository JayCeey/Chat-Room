import axios from 'axios';
import {refresh} from "api/login";

// 创建一个实例
const instance = axios.create();

// 添加请求拦截器
instance.interceptors.request.use((config) => {
    const url = config.url;
    console.log("请求地址：", url)
    // if(url.includes('login') || url.includes('register') || url.includes('refresh')) return config;
    // 获取鉴权Token
    const accessToken = sessionStorage.getItem('accessToken'); // 假设Token存储在localStorage中
    if (accessToken) {
        // 在请求头中添加Authorization字段
        config.headers = {
            ...config.headers,
            'Authorization': `${accessToken}`,
        };
    }
    return config;
});

// 添加响应拦截器
instance.interceptors.response.use(async (response) => {
    const res = response.data;
    // 检查响应状态，如果未授权则执行重新登录等操作
    if (res.code === "00000") {
        return response;
    }
    else if (res.code === "A00004") {
        console.log('未授权，首先进行无感登录');
        // 进行无感登录
        await refresh().then(
            response => response.json()
        )
        .then(res => {
            console.log("当前返回：", res);
            if (res.code === "00000") {
                // 无感登录成功，保存accessToken，然后返回到本来的地方即可
                sessionStorage.setItem('accessToken', res.data.accessToken);
                window.location.href = '/index.html';
            }else if(res.code === "A00001"){ // 无感登录失败，需要手动登录
                confirm("登录状态已过期，请重新登录")
                // 触发重新登录流程
                window.location.href = '/login.html';
            }
        })
    }else{
        // 发生错误
        confirm("发生错误：代码", res.code, "，消息：", res.msg);
        return response;
    }
}, (error) => {
    console.error('Fetch error:', error);
    throw error;
});

export default instance;

