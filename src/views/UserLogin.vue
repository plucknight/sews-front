<template>
  <div class="login-container">
    <!-- 系统标题 -->
    <h1 id="title">病害虫监测预警系统</h1>

    <!-- 登录框 -->
    <div id="user-login">
      <!-- 登录表单标题 -->
      <div id="form-title">登录</div>

      <!-- 用户名输入框 -->
      <div class="input-group">
        <label for="username" class="input-label">用户名</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="请输入用户名"
          @keyup.enter="Login"
        />
      </div>

      <!-- 密码输入框 -->
      <div class="input-group">
        <label for="password" class="input-label">密码</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="请输入密码"
          @keyup.enter="Login"
        />
      </div>

      <!-- 登录按钮 -->
      <button id="login-btn" @click="Login">登录</button>

      <!-- 注册链接 -->
      <!-- <p id="register-link">
        <router-link to="/register">没有账号？注册</router-link>
      </p> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "", // 存储用户名
      password: "", // 存储密码
    };
  },
  methods: {
    // 登录方法
    Login() {
      localStorage.setItem("token", "1"); // 存储 token（假设登录成功）
      this.$router.push("/home"); // 跳转到首页
      // if (this.username && this.password) {
      //   // 在此可以调用 API 进行身份验证
      //   console.log("登录中...");

      //   // 临时跳转至主页（假设登录成功）
      //   localStorage.setItem("token", "1"); // 存储 token（假设登录成功）
      //   this.$router.push("/home"); // 跳转到首页
      // } else {
      //   alert("用户名和密码不能为空");
      // }
    },
  },
};
</script>

<style scoped>
/* 页面整体布局 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #4caf50, #81c784); /* 绿色渐变背景 */
  flex-direction: column; /* 标题和表单垂直排列 */
}

#title {
  font-size: 2.5rem;
  color: white;
  margin-bottom: 1rem;
}

#user-login {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

#form-title {
  font-size: 1.8rem;
  color: #388e3c;
  margin-bottom: 2rem;
  font-weight: bold;
}

/* 输入框样式 */
.input-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.input-label {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  background-color: #f9f9f9;
}

input:focus {
  border-color: #388e3c; /* 聚焦时边框变绿色 */
}

#login-btn {
  width: 100%;
  padding: 1rem;
  background-color: #388e3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
}

#login-btn:hover {
  background-color: #2e7d32; /* 鼠标悬停时背景颜色 */
}

#register-link {
  margin-top: 1rem;
}

#register-link a {
  color: #388e3c;
  text-decoration: none;
}

#register-link a:hover {
  text-decoration: underline;
}
</style>
