// 引入axios实例  
import service from "@/request/index";  

// 登录接口函数  
export function login(data) {  
    return service({  
        url: "/user/login",
        method: "POST",  
        data  
    });  
}
// 注册接口
export function register(data) {
    return service({
        url: "/user/register",
        method: "POST",
        data
    });
}
// 用户排名接口函数  
export function getRankList(data) {
    return service({  
        url: "/start/gUser/search",
        method: "POST",
        data
    });  
}  
  
// 预测用户地区接口函数
export function predictByName(data) {
    return service({  
        url: "/start/gUser/guessLocation",
        method: "POST",
        data
    });  
}  
  
// 得分划档函数
export function classifyLever() {
    return service({  
        url: "/start/gUser/grade",
        method: "POST"
    });  
}

// 搜索用户信息接口函数
export function selectByName(data) {
    return service({
        url: "/start/gUser/getEvaluate",
        method: "POST",
        data
    });
}

// 根据关键词搜索接口函数
export function searchByKey(data) {
    return service({
        url: "/start/gUser/search",
        method: "POST",
        data
    });
}

// 限制用户访问量接口函数
export function limitLoad(data) {
    return service({
        url: "/start/data/loadUser",
        method: "POST",
        data
    });
}

// 添加用户接口函数
export function addUser(data) {
    return service({
        url: "/start/gUser/add",
        method: "POST",
        data
    });
}

// 饼状图数据接口
export function getEchartsData(data) {
    return service({
        url: "/start/gUser/getGradeCount",
        method: "POST",
        data
    });
}

// 柱状图数据接口
export function getUserInfoNum(data) {
    return service({
        url: "/start/gUser/getUserInfo",
        method: "POST",
        data
    });
}

// 获取用户的仓库信息
export function getUserRepo(data) {
    return service({
        url: "/start/gUser/getRepo",
        method: "POST",
        data
    });
}
