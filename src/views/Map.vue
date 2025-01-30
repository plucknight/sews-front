<template>
  <Float />
  <div class="map-container" id="mapContainer"></div>
</template>

<script setup>
import Float from "@/components/float/float.vue";
import { ref, onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import geoJsonData from "@/assets/js/geo.json"; // 导入省级区域的GeoJSON数据

let map = null;

const initMap = () => {
  if (map) return map;

  map = L.map("mapContainer", {
    center: [34.3416, 108.9398], // 初始坐标：西安的经纬度
    zoom: 5,
    minZoom: 5,
    maxZoom: 25,
    zoomControl: false,
    attributionControl: false,
  });

  L.tileLayer(
    "https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
    { attribution: "&copy; <p>OpenStreetMap</p> contributors" }
  ).addTo(map);

  geoJsonData.features.forEach((feature) => processGeoJsonData(feature));

  map.invalidateSize(); // 确保地图完全加载
  return map;
};

let hoverLayer = null; // 用于保存当前高亮的图层（保持唯一）
const processGeoJsonData = (node) => {
  if (node.properties.level === "province") {
    const geoData = node;
    if (geoData && geoData.geometry) {
      const provinceLayer = L.geoJSON(geoData, {
        style: { color: "#C0C0C0", weight: 1, fillOpacity: 0.6 },
        onEachFeature: (feature, layer) => {
          const { name, level } = feature.properties;
          layer.bindTooltip(
            `Name: <strong>${name}</strong><br/>Level: ${level}`,
            {
              permanent: false,
              direction: "top",
              className: "province-tooltip",
              offset: L.point(10, -40),
            }
          );

          let currentHoverLayer = null;
          // 鼠标悬停时高亮
          layer.on("mouseover", () => {
            if (hoverLayer) {
              map.removeLayer(hoverLayer);
            }

            if (!currentHoverLayer) {
              currentHoverLayer = L.geoJSON(geoData, {
                style: {
                  color: "#61AFEF",
                  weight: 2,
                  fillColor: "#61AFEF",
                  fillOpacity: 0.5,
                },
              }).addTo(map);
            }
          });

          // 鼠标移开时清除高亮图层
          layer.on("mouseout", () => {
            setTimeout(() => {
              if (currentHoverLayer) {
                map.removeLayer(currentHoverLayer);
                currentHoverLayer = null;
              }
            }, 100);
          });
        },
      }).addTo(map);
    }
  }
};

onMounted(() => {
  console.log("组件挂载，初始化地图");
  initMap();
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.province-tooltip {
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  padding: 5px 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
