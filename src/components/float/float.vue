<template>
  <!-- 悬浮标题 -->
  <div class="floating-header">
    <h1>{{ title }}</h1>
  </div>

  <!-- 悬浮登录按钮 -->
  <el-button class="login-btn" type="primary" @click="openLoginDialog">
    登录
  </el-button>

  <!-- 登录弹窗 -->
  <el-dialog
    title="管理员登录"
    v-model="isDialogVisible"
    width="400px"
    @close="resetForm"
    class="el-dialog"
  >
    <el-form :model="form" label-width="50px" ref="loginForm">
      <el-form-item label="账号" :rules="usernameRules" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入管理员账号"
          name="username"
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
          name="password"
          @keyup.enter="Login"
          size="large"
        />
      </el-form-item>

      <el-form-item label="">
        <el-checkbox v-model="form.rememberMe">记住账号和密码</el-checkbox>
      </el-form-item>

      <!-- 登录按钮 -->
      <div class="button-container">
        <el-button
          class="login-button"
          type="primary"
          @click="Login"
          size="small"
        >
          登录
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
  ElDialog,
  ElCheckbox,
} from "element-plus";
import { useRouter } from "vue-router";
import { login } from "@/api/api";
// 系统标题
const title = "作物靶标害虫自动监测预警系统";

// 弹窗显示状态
const isDialogVisible = ref(false);

// 响应式表单数据
const form = ref({
  username: "",
  password: "",
  rememberMe: false, // 新增属性，用于记住账号和密码
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

// 打开登录弹窗
const openLoginDialog = () => {
  // 弹窗打开时，检查是否有保存的用户名和密码
  const savedUsername = localStorage.getItem("username");
  const savedPassword = localStorage.getItem("password");

  if (savedUsername && savedPassword) {
    form.value.username = savedUsername;
    form.value.password = savedPassword;
    form.value.rememberMe = true; // 如果有保存的账号和密码，自动勾选“记住我”
  }

  isDialogVisible.value = true;
};

// 登录方法
const Login = async () => {
  console.log(form.value.username + form.value.password);
  const response = await login({
    username: form.value.username,
    password: form.value.password,
  });
  if (!response) {
    ElMessage.error("登录失败");
    return;
  }
  // 存储 token（假设登录成功）
  localStorage.setItem("token", response.token);

  // 根据用户选择决定是否保存账号和密码
  if (form.value.rememberMe) {
    localStorage.setItem("username", form.value.username);
    localStorage.setItem("password", form.value.password);
  } else {
    // 如果用户不选择记住，清除保存的账号和密码
    localStorage.removeItem("username");
    localStorage.removeItem("password");
  }

  ElMessage.success("登录成功！");
  router.push("/home");
};

// 重置表单
const resetForm = () => {
  form.value = {
    username: "",
    password: "",
    rememberMe: false, // 重置复选框状态
  };
};
</script>

<style scoped>
/* 悬浮标题 */
.floating-header {
  position: fixed;
  top: 0;
  left: 20%;
  transform: translateX(-50%);
  color: rgb(47, 152, 98);
  padding: 10px 20px;
  z-index: 999;
  font-size: 20px;
  font-weight: bold;
  border-radius: 5px;
}

/* 悬浮登录按钮 */
.login-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  font-size: 16px;
  padding: 10px 20px;
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

/* 使用 div 居中按钮 */
.button-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 100%;
  margin-top: 10px;
}

.login-button {
  width: 60px;
}

.el-dialog {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0px !important;
}
</style>
