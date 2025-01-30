<template>
  <div id="app">
    <TabBar v-if="loginrouter === false" :title="title" />

    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import TabBar from "./components/tabbar/TabBar.vue";
import Login from "./views/UserLogin.vue";
import LeftTabBar from "./components/tabbar/LeftTabBar.vue";
import { useRoute } from "vue-router";
// 定义响应式数据
const loginrouter = ref(false);
const title = ref("");

// 获取当前路由信息
const route = useRoute();
window.document.title = "作物靶标害虫自动监测预警系统";
// 监听路由变化
watch(
  route,
  (newRoute) => {
    if (newRoute.name === "login" || newRoute.name === "map") {
      loginrouter.value = true;
    } else {
      loginrouter.value = false;
    }
  },
  { immediate: true }
);
</script>

<style lang="less" scoped></style>
