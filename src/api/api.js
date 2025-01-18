import api from "@/api/config.js"; // 引入封装好的 api 实例
export const getAllModels = () => {
  return api.get("/models/getAllModels"); // 这里的 /users 是你实际的 API 路径
};
export const login = (data) => {
  return api.post("/login", data); // 登录接口
};
