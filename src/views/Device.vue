<template>
  <div class="devicetabbar">
    <DeviceTabBar></DeviceTabBar>
  </div>

  <router-view v-slot="{ Component }" id="devicecontent">
    <keep-alive>
      <component :key="$route.path" :is="Component" v-if="!isshow" />
    </keep-alive>
    <component :is="Component" v-if="isshow" v-show="isshow" />
  </router-view>
</template>

<script>
import DeviceTabBar from "@/components/tabbar/LeftTabBar.vue";
export default {
  name: "device",
  data() {
    return {
      width: "",
      isshow: false,
    };
  },
  components: {
    DeviceTabBar,
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
        console.log(val.path);

        if (val.path != "/device/meteorology") {
          this.isshow = false;
        } else {
          this.isshow = true;
        }
      },
      // 深度观察监听
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
.devicetabbar {
  position: fixed;
  z-index: 0;
  top: 4.4rem;
  height: 100%;
  width: 8rem;
}
#devicecontent {
  padding-top: 3rem;
  padding-left: 9rem;
}

@media screen and (max-width: 720px) {
  #devicecontent {
    padding-top: 5rem;
    padding-left: 0rem;
  }
}
</style>
