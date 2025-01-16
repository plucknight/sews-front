<!-- <template>
  <v-scale-screen width="1920" height="1080">
    <keep-alive>
      <TabBar :title="title" class="tabbar"></TabBar>
    </keep-alive>

    <div class="module-box backimg content">
      <!-- 园区基本情况 information-->
      <div class="sonmodule">
        <!-- title -->
        <Title>
          <template #chinese> 园区基本情况 </template>
          <template #english> information </template>
        </Title>

        <!-- map -->
        <Map class="map"></Map>

        <!-- 监控预览 -->
        <Monitor></Monitor>

        <!-- 图片展示 -->
        <ImgShow></ImgShow>
      </div>

      <!-- 园区数据报表 data -->
      <div class="sonmodule">
        <!-- title -->
        <Title>
          <template #chinese> 园区数据报表 </template>
          <template #english> data </template>
        </Title>

        <!-- 害虫数量 -->
        <NumberOfPests></NumberOfPests>

        <!-- 害虫类型 -->
        <PestType></PestType>

        <!-- 墒情信息 -->
        <MoistureInformation></MoistureInformation>
      </div>

      <!-- 园区预警情况 early warning -->
      <div class="sonmodule">
        <!-- title -->
        <Title>
          <template #chinese> 园区预警情况 </template>
          <template #english> early warning </template>
        </Title>

        <!-- 成虫高峰期预测 -->
        <Imago></Imago>

        <!-- 若虫高峰期预测 -->
        <Nymph></Nymph>

        <!-- 稻飞虱发生程度预测 -->
        <RicePlanthopper></RicePlanthopper>
      </div>
    </div>
  </v-scale-screen>
</template>

<script>
import VScaleScreen from "v-scale-screen";
import TabBar from "@/components/tabbar/TabBar.vue";
import Title from "@/components/home/Title.vue";
import Map from "../components/home/Map.vue";
import NumberOfPests from "@/components/home/NumberOfPests.vue";
import PestType from "@/components/home/PestType.vue";
import MoistureInformation from "@/components/home/MoistureInformation.vue";
import Imago from "@/components/home/Imago.vue";
import Nymph from "@/components/home/Nymph.vue";
import RicePlanthopper from "@/components/home/RicePlanthopper.vue";
import Monitor from "@/components/home/Monitor.vue";
import ImgShow from "@/components/home/ImgShow.vue";
export default {
  name: "home",
  data() {
    return {
      width: null,
      height: null,
      title: "首页",
    };
  },
  components: {
    VScaleScreen,
    TabBar,
    Title,
    Map,
    NumberOfPests,
    PestType,
    MoistureInformation,
    Imago,
    Nymph,
    RicePlanthopper,
    Monitor,
    ImgShow,
  },
  methods: {
    getwidth() {
      if (window.innerWidth > 780) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
      } else {
        this.height = window.innerWidth;
        this.width = window.innerHeight;
      }
    },
  },
  activated() {},
  created() {
    this.getwidth();
  },
};
</script>

<style lang="less" scoped>
.tabbar {
  background-color: rgba(52, 167, 69, 0) !important;
}
.part {
  width: 100%;
  height: 290px;
}
.v-screen-box {
  width: 100%;
  background: url(../assets/img/back.png) !important;
}
.content {
  padding-top: 5%;
  width: 100%;
  //本页面默认大小
  font-size: calc(100vw * 24 / 1920);
  // margin-left: 1rem;
  color: white;
}
.content::after {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.module-box {
  display: flex;
  justify-content: space-between;
  margin-top: 1.25rem;
}
.title {
  //子标题字体大小
  font-size: calc(100vw * 30 / 1920);

  display: flex;
  margin-bottom: 0.3rem;
}
.titleback {
  //总标题字体大小
  font-size: calc(100vw * 45 / 1920);

  margin-left: 30%;
  width: 40%;
  height: 60px;
}
.sonmodule {
  width: 30%;
  justify-content: space-between;
}

@media screen and (max-width: 720px) {
  .part {
    height: 300px;
  }
  .content {
    // 默认字体大小
    font-size: calc(100vw * 180 / 1920);
    width: 100%;
    height: 100%;
  }
  .module-box {
    margin: 0 20px 20px 20px;
  }
  .titleback {
    // 总标题字体大小
    font-size: calc(100vw * 70 / 1920);

    margin-left: 15%;
    width: 70%;
    height: 60px;
  }
  .title {
    // 子标题大小
    font-size: calc(100vw * 50 / 1920);
  }
}
</style> -->
