<template>
  <nav v-if="bigwidth === true" class="nav">
    <router-link to="/home/index"><div>首页</div></router-link>

    <router-link to="/home/monitor"><div>实时监控</div></router-link>

    <router-link to="/home/pestdata"><div>历史数据</div></router-link>

    <router-link to="/home/devicelist"><div>设备管理</div></router-link>

    <router-link to="/home/modelchose"><div>模型选择</div></router-link>

    <router-link to="/home/earlywarning"><div>预警分析</div></router-link>

    <router-link to="/home/photo"><div>设备图片</div></router-link>

    <router-link to="/home/test"><div>Test</div></router-link>
  </nav>
</template>

<script>
import { Menu, MenuItem, Button, Drawer, Icon } from "view-ui-plus";
export default {
  data() {
    return {
      theme: "dark",
      router: null,
      bigwidth: true,
      value1: false,
    };
  },
  components: {
    Menu,
    MenuItem,
    Button,
    Drawer,
    Icon,
  },
  created() {
    this.getwidth();
  },
  methods: {
    getwidth() {
      console.log("device", window.innerWidth);
      this.bigwidth = window.innerWidth > 720 ? true : false;
    },
  },
  mounted() {
    window.addEventListener("resize", () => {
      return (() => {
        this.$nextTick(() => {
          this.bigwidth = window.innerWidth > 720 ? true : false;
        });
      })();
    });
  },
  watch: {
    $route: {
      handler(val) {
        this.router = "/" + val.name;
      },
      // 深度观察监听
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
.nav {
  position: fixed;
  z-index: 0;

  top: 4.4rem;
  height: 100%;
  width: 8rem;

  background-color: rgb(159, 194, 162);
  // width: 100%;
  // height: 100%;
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
    // .router-link-active {
    //   div {
    //     color: skyblue;
    //   }
  }
}
.mosalnav {
  position: fixed;
  z-index: 999;
}

@media screen and (max-width: 720px) {
}
</style>

<!-- 修改侧边导航栏样式 -->
<style lang="less">
@media screen and (max-width: 720px) {
  .ivu-drawer-content {
    // width:50% !important;
    height: 100% !important;
    background-color: rgba(222, 29, 29, 0.306) !important;
    box-shadow: 0px 0px 0px rgba(222, 3, 3, 0) !important;
    .ivu-menu {
      height: 100% !important;
    }
  }
  .opendrawer {
    .ivu-btn {
      top: 4.4rem;
      position: fixed;
      z-index: 99 !important;
    }
  }
}
</style>
