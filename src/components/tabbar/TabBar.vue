<template>
  <div class="tabbar" :style="style">
    <!-- 标题 -->

    <div class="titleback">
      <div class="icon"></div>
      <div class="title">作物靶标害虫自动监测预警系统</div>
    </div>

    <!-- 时间 个人 退出 -->
    <div class="time">
      <div v-if="smallwidth === false">
        <p>{{ times }}</p>
      </div>
      <div>
        <div class="icon-container">
          <i class="iconfont icon-geren2"></i>&nbsp;
        </div>
      </div>
      <div>
        <div class="icon-container" @click="logout">
          <i class="iconfont icon-dianyuan"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/icon/iconfont.css";

export default {
  data() {
    return {
      times: "", //格式化之后的当前时间
      name: null, //用户名
      style: {
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        padding: "5px 0",
        borderBottom: "1px solid gray",
      },
      smallwidth: false,
    };
  },
  props: ["title"],
  created() {
    this.getTimes();
    this.getwidth();
  },

  methods: {
    logout() {
      // 清除登录信息（如 token 或其他存储在 localStorage 中的内容）
      localStorage.removeItem("token");
      // 跳转到登录页面
      this.$router.push("/login");
    },
    getTimes() {
      setInterval(this.getTimesInterval, 1000);
    },
    getTimesInterval() {
      let _this = this;
      let date = new Date();
      let hours = String(date.getHours()).padStart(2, "0");
      let minutes = String(date.getMinutes()).padStart(2, "0");
      let seconds = String(date.getSeconds()).padStart(2, "0");
      _this.times = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${hours}:${minutes}:${seconds}`;
    },
    getname() {
      this.name = localStorage.getItem("token");
    },
    getwidth() {
      this.$nextTick(() => {
        this.smallwidth = window.innerWidth < 720 ? true : false;
      });
    },
  },
  mounted() {
    window.addEventListener("resize", () => {
      return (() => {
        this.$nextTick(() => {
          this.smallwidth = window.innerWidth < 720 ? true : false;
        });
      })();
    });
  },
  beforeDestroy() {
    if (this.times) {
      clearInterval(this.getTimesInterval);
    }
  },
};
</script>

<style lang="less" scoped>
.tabbar {
  z-index: 999;
  width: 100%;
  position: fixed;
  top: 0;
  background: linear-gradient(
    to right,
    #6db06d,
    #378d3d
  ); /* 整个栏背景渐变色 */
  .icon {
    width: 60px;
    height: 60px;
    background-image: url("../../assets/icon/xn.png");
    background-size: cover;
    margin-left: 1%;
  }
  .titleback {
    font-size: calc(100vw * 40 / 1920); /* 根据屏幕宽度自适应字体大小 */
    height: 60px;
    width: 800px;
    line-height: 60px;
    text-align: left; /* 标题居左 */
    padding-left: 10px; /* 左侧内边距 */
    display: flex; /* 使用flex布局 */
    align-items: center; /* 垂直居中标题和图标 */
  }
  .title {
    font-weight: bold;
    margin-left: 15px;
  }
  .time {
    width: 20rem;
    padding-right: 1%;
    display: flex;
    justify-content: space-around;
    transform: translateY(35%);
    font-size: calc(100vw * 20 / 1920) !important;

    div {
      text-align: center;
    }
  }

  .icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px; /* 设置固定宽度 */
    height: 24px; /* 设置固定高度，适配行高 */
    font-size: calc(100vw * 16 / 1920); /* 图标大小略小于行高 */
  }
}

@media screen and (max-width: 720px) {
  .tabbar {
    width: 100%;
    font-size: calc(100vw * 12 / 1920) !important;

    .ivu-menu {
      width: 8rem;

      .ivu-menu-item {
        font-size: calc(100vw * 12 / 1920) !important;
      }
    }

    .ivu-dropdown {
      /deep/.ivu-dropdown-rel {
        transform: translateY(100%);
      }

      /deep/.ivu-select-dropdown {
        padding: 0 0 !important;

        .ivu-dropdown-menu {
          background-color: #386e55 !important;
        }
      }
    }

    .titleback {
      width: 13rem !important;
      font-size: calc(100vw * 16 / 1920) !important;
    }

    .time {
      width: 5rem !important;
    }
  }
}
</style>
