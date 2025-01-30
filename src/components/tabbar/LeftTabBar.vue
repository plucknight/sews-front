<template>
  <nav v-if="bigwidth" class="nav">
    <!-- 动态渲染菜单 -->
    <router-link v-for="item in filteredMenu" :key="item.to" :to="item.to">
      <div>{{ item.name }}</div>
    </router-link>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAdminInfo } from "@/api/api";
// 响应式数据
const bigwidth = ref(true);
const userRole = ref(1); // 假设这是从接口或登录信息获取的角色
const menuItems = ref([
  { name: "首页", to: "/home/index", roles: [1] },
  { name: "实时监控", to: "/home/monitor", roles: [1, 2] },
  { name: "设备管理", to: "/home/devicelist", roles: [1, 2] },
  { name: "设备维护", to: "/home/deviceMaintenance", roles: [1, 2] },
  { name: "用户管理", to: "/home/admin", roles: [1] },
  { name: "害虫记录", to: "/home/photo", roles: [1, 2] },
  { name: "模型选择", to: "/home/modelchose", roles: [1, 2] },
  { name: "预警规则", to: "/home/warningRelus", roles: [1, 2] },
  { name: "预警记录", to: "/home/warningInfo", roles: [1, 2] },
  { name: "气象数据", to: "/home/weatherData", roles: [1, 2] },
  { name: "管理权限", to: "/home/adminPermission", roles: [1] },
]);

// 根据角色过滤出应该显示的菜单项
const filteredMenu = computed(() =>
  menuItems.value.filter((item) => item.roles.includes(userRole.value))
);
const getUserRelo = async () => {
  try {
    const adminInfo = await getAdminInfo();
    console.log("adminInfo" + adminInfo);
    if (adminInfo.role) {
      userRole.value = adminInfo.role;
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};
// 监听窗口大小变化
const handleResize = () => {
  bigwidth.value = window.innerWidth > 720;
};

onMounted(async () => {
  await getUserRelo(); // 获取用户角色
  handleResize(); // 初始化时设置 bigwidth
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style lang="less" scoped>
.nav {
  position: fixed;
  z-index: 0;
  top: 4.4rem;
  height: 100%;
  width: 8rem;
  background-color: rgb(159, 194, 162);

  a {
    div {
      color: rgb(0, 0, 0);
      font-weight: bold;
      text-align: center;
      height: 4rem;
      padding: 1rem 0;
    }
  }
  .router-link-active {
    div {
      background-color: green; /* 添加绿色背景 */
      color: white; /* 文字颜色改为白色 */
    }
  }
}

@media screen and (max-width: 720px) {
  .ivu-drawer-content {
    height: 100% !important;
    background-color: rgba(222, 29, 29, 0.306) !important;
    box-shadow: 0px 0px 0px rgba(222, 3, 3, 0) !important;
    .ivu-menu {
      height: 100% !important;
    }
  }
}
</style>
