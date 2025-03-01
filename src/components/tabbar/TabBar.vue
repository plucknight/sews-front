<template>
  <div class="tabbar" :style="style">
    <!-- 标题 -->
    <div class="titleback">
      <div class="icon"></div>
      <div class="title">作物靶标害虫自动监测预警系统</div>
    </div>

    <!-- 用户名和退出按钮 -->
    <div class="right">
      <div class="username">欢迎！ {{ username }}</div>
      <div>
        <div class="icon-container" @click="logout">
          <div class="out"></div>
          <div class="out-text"><span>退出</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAdminInfo } from "@/api/api";
// 获取路由实例
const router = useRouter(); // 确保在 script setup 中正确初始化
// 响应式数据
const username = ref("");
// 获取用户名并更新
const getUsername = async () => {
  try {
    const adminInfo = await getAdminInfo();
    if (adminInfo.username) {
      username.value = adminInfo.username;
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

// 退出登录
const logout = () => {
  localStorage.removeItem("token"); // 清除 token
  localStorage.removeItem("role");
  router.push("/map");
  // .then(() => {
  //   window.location.reload(); // 强制刷新页面
  // }) // 跳转到登录页面
};

onMounted(getUsername);
// 样式
const style = {
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  padding: "5px 0",
  borderBottom: "1px solid gray",
};
</script>

<style scoped lang="less">
.tabbar {
  z-index: 999;
  width: 100%;
  position: fixed;
  top: 0;
  background: linear-gradient(to right, #6db06d, #378d3d);
  .icon {
    width: 60px;
    height: 60px;
    background-image: url("../../assets/icon/xn.png");
    background-size: cover;
    margin-left: 1%;
  }
  .titleback {
    font-size: calc(100vw * 40 / 1920);
    height: 60px;
    width: 800px;
    line-height: 60px;
    text-align: left;
    padding-left: 10px;
    display: flex;
    align-items: center;
  }
  .title {
    font-weight: bold;
    margin-left: 15px;
  }
  .right {
    width: 220px;
    padding-right: 1%;
    display: flex;
    justify-content: space-between;
    transform: translateY(35%);
    font-size: calc(100vw * 20 / 1920) !important;

    div {
      text-align: center;
    }
  }
  .username {
    font-size: calc(100vw * 16 / 1920);
    // margin-right: 10px;
  }
  .icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 24px;
    font-size: calc(100vw * 16 / 1920);
    margin-right: 40px;
  }
  .out {
    width: 24px;
    height: 24px;
    background-image: url("../../assets/icon/退出.png");
    background-size: cover;
  }
}
</style>
