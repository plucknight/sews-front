<template>
  <div id="app">
    <TabBar v-if="loginrouter === false" :title="title"></TabBar>

    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script>
import TabBar from "./components/tabbar/TabBar.vue";
import Login from "./views/UserLogin.vue";
import LeftTabBar from "./components/tabbar/LeftTabBar.vue";
export default {
  data() {
    return {
      loginrouter: false,
      title: "",
    };
  },
  watch: {
    $route: {
      handler(val) {
        console.log(val); //新路由信息
        if (val.name == "login" || val.name == "map") {
          this.loginrouter = true;
        } else {
          this.loginrouter = false;
        }
      },
      // 深度观察监听
      deep: true,
      immediate: true,
    },
  },
  components: {
    Login,
    // Home,
    TabBar,
    LeftTabBar,
  },
};
</script>

<style lang="less" scoped></style>
