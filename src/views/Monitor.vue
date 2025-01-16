<template>
  <div id="monitor">
    <Title>
      <template #title> 实时监控 </template>
    </Title>

    <Space>
      监控名称：
      <Select v-model="model" style="width: 200px">
        <Option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
    </Space>

    <Space>
      监控位置：
      <Select v-model="model" style="width: 200px">
        <Option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
    </Space>

    <div class="monitor">
      <!-- Optionally, you can add an image here -->
      <!-- <img src="../assets/img/1.jpg" alt="" class="monitorimg"> -->

      <!-- Map container -->
      <div id="map-container">
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/components/device/Title.vue";
import { Space, Select, Option } from "view-ui-plus";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css"; // 引入 Leaflet 的 CSS 文件

export default {
  name: "monitor",
  components: {
    Title,
    Space,
    Select,
    Option,
  },
  data() {
    return {
      model: "",
      cityList: [
        { value: "city1", label: "城市1" },
        { value: "city2", label: "城市2" },
        // Add more cities...
      ],
      map: null,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.map = new L.Map("map", {
        center: new L.LatLng(34.25, 108.95), // 调整中心到陕西
        zoom: 10, // 增加缩放级别以放大地图
      });

      const gaoDeVector = L.tileLayer(
        "http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
        {}
      );

      const osm = L.tileLayer(
        "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 18,
        }
      );

      const baseLayers = {
        高德矢量: gaoDeVector,
        OSM: osm,
      };

      const layerControl = L.control
        .layers(
          baseLayers,
          {},
          {
            position: "topleft",
            collapsed: true,
          }
        )
        .addTo(this.map);

      // 默认显示 OSM 图层
      osm.addTo(this.map);

      // 使用 Leaflet 默认图标
      L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.7.1/dist/images"; // 确保路径正确

      // 创建带有默认图标的标记
      const xa = L.marker([34.34, 108.94]).bindPopup("这里是西安");
      const xy = L.marker([34.35, 108.71]).bindPopup("这里是咸阳");
      const yl = L.marker([34.27, 108.92]).bindPopup("这里是杨凌");

      const cities = L.layerGroup([xa, xy, yl]);
      cities.addTo(this.map);
    },
  },
};
</script>

<style lang="less" scoped>
.monitor {
  width: 100%;
  padding: 2rem;
  margin: 0 auto;
  text-align: center;

  #map-container {
    width: 100%; /* 设置容器宽度为100% */
    height: 400px; /* 设置容器高度 */
    margin: 20px auto; /* 居中对齐 */
    border: 1px solid #ccc; /* 添加边框 */

    #map {
      width: 100%;
      height: 100%;
    }
  }

  .monitorimg {
    width: 80%;
  }
}
</style>
