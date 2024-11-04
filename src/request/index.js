// 引入axios库  
import axios from "axios";
import Agent from "agentkeepalive";
// 创建一个axios实例
const service = axios.create({
    baseURL:'/api',
    timeout: 60000, // 设置请求超时时间
    // keepAlive pools and reuses TCP connections, so it's faster
    httpAgent: new Agent({
        maxSockets: 100,
        maxFreeSockets: 10,
        timeout: 1*60 * 1000,
        freeSocketTimeout: 60 * 1000,
        keepAlive: true
    }),
    httpsAgent: new Agent.HttpsAgent({
        maxSockets: 100,
        maxFreeSockets: 10,
        timeout: 2 * 60 * 1000,
        freeSocketTimeout: 1 * 60 * 1000,
        keepAlive: true
    }),
    // follow up to 10 HTTP 3xx redirects
    maxRedirects: 10,
    // cap the maximum content length we'll accept to 50MBs, just in case
    maxContentLength: 50 * 1000 * 1000,

    headers: { // 设置默认请求头  
        "Content-Type": "application/json;charset=utf-8"  
    }  
});  
  
// 添加请求拦截器  
service.interceptors.request.use(  
    config => {  
        // 在发送请求之前做些什么，比如添加token  
        config.headers = config.headers || {};  
        const token = localStorage.getItem("token");  
        if (token) {  
            config.headers["token"] = token;  
        }  
        return config; // 必须返回配置，否则请求将不会被发送  
    },  
    error => {  
        // 对请求错误做些什么  
        return Promise.reject(error);  
    }  
);  
  
// 添加响应拦截器  
service.interceptors.response.use(  
    response => {  
        // 对响应数据做点什么，比如根据状态码判断请求是否成功  
        const { code } = response.data;  
        if (code !== 200) {  
            // 如果状态码不是200，表示请求失败  
            return Promise.reject(response);  
        } else {  
            // 如果状态码是200，表示请求成功，返回响应数据  
            console.log(response, '请求成功----');  
            return response.data;  
        }  
    },  
    error => {  
        // 对响应错误做点什么  
        console.log(error, '错误信息的处理');  
        return Promise.reject(error);


    }  
);  
  
// 导出axios实例，以便在其他文件中使用  
export default service;