<template>
  <div class="login-container">
    <!-- 系统标题 -->
    <h1 class="title">作物靶标害虫自动监测预警系统</h1>

    <!-- 登录框 -->
    <div id="user-login">
      <!-- 登录表单标题 -->
      <div id="form-title">欢迎!</div>

      <!-- 登录表单 -->
      <el-form :model="form" label-width="50px" ref="loginForm">
        <!-- 用户名输入框 -->
        <el-form-item label="账号" :rules="usernameRules" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入管理员账号"
            @keyup.enter="Login"
            size="large"
          />
        </el-form-item>

        <!-- 密码输入框 -->
        <el-form-item label="密码" :rules="passwordRules" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            @keyup.enter="Login"
            size="large"
          />
        </el-form-item>

        <!-- 登录按钮 -->
        <el-button
          type="primary"
          block
          @click="Login"
          size="Small"
          class="login-button"
          >登录</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { login } from "@/api/api";
// 响应式表单数据
const form = ref({
  username: "",
  password: "",
});

// 表单验证规则
const usernameRules = [
  { required: true, message: "请输入用户名", trigger: "blur" },
];
const passwordRules = [
  { required: true, message: "请输入密码", trigger: "blur" },
];

// 路由
const router = useRouter();

// 登录方法
const Login = async () => {
  const response = await login({
    username: form.value.username,
    password: form.value.password,
  });

  console.log("sssssssss");
  if (!response.data || !response.data.token) {
    ElMessage.error("登录失败");
    return;
  }

  console.log(response.data.token);
  // 假设这里是你的登录逻辑，可以是 API 调用
  localStorage.setItem("token", response.data.token);
  // 存储 token（假设登录成功）
  ElMessage.success("登录成功！");

  // 跳转到首页
  router.push("/home");
};
</script>

<style scoped>
/* 页面整体布局 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f4f7fc; /* 背景色改为浅灰 */
  flex-direction: column; /* 标题和表单垂直排列 */
}

.title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

#user-login {
  background: white;
  padding: 2rem;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 380px;
  text-align: center;
}

#form-title {
  font-size: 1.5rem;
  color: #388e3c;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

/* 登录按钮样式 */
.el-button {
  font-size: 1.1rem;
  padding: 1rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

/* 按钮居中 */
.login-button {
  width: 100px;
  justify-content: center;
  align-items: center;
  margin-top: 5px; /* 给按钮添加一些间距 */
}
</style>
