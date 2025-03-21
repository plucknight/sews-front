import axios from "axios";
import { ElMessage } from "element-plus";

// 创建 axios 实例
const api = axios.create({
  baseURL: "http://localhost:8080", // 后端接口基础地址
  // headers: {
  //   "Content-Type": "application/json", // 设置请求头为 JSON 格式
  // },
  timeout: 10000, // 请求超时设置（10秒）
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = {};
    }

    if (!config.headers.common) {
      config.headers.common = {};
    }

    // 获取 token 并设置到请求头中
    const token = localStorage.getItem("token");
    // console.log("token: " + token);
    // if (!token) {
    //   console.warn("Token is missing in the request");
    //   // 可以在这里处理token缺失的情况，例如跳转到登录页面
    //   window.location.href = "/map";
    //   return Promise.reject(new Error("Token is missing"));
    // } else {
    config.headers["token"] = `${token}`;
    // }type.tex

    return config;
  },
  (error) => {
    // 请求失败时处理
    ElMessage.error("请求失败，请检查网络或参数");
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 如果响应数据有返回并且不为 null
    if ((res !== null && response.status === 200) || response.status === 201) {
      return res; // 假设后端返回的数据在 res.data 中
    } else {
      ElMessage.error(response.message || "请求失败");
      return Promise.reject(new Error(response.message || "请求失败"));
    }
  },
  (error) => {
    if (error.response.status === 404) {
      ElMessage({
        type: "error",
        message: "查找失败，请检查输入是否正确。",
      });
    } else {
      // 网络错误或其他响应错误
      ElMessage.error("服务器发生错误，请稍后再试");

      return Promise.reject(error);
    }
  }
);

export default api;
