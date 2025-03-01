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
import { mapDevice } from "@/api/api";
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

// 处理GeoJSON数据
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
        },
      }).addTo(map);
    }
  }
};

// 根据颜色获取图标
const getIconByColor = (color) => {
  const iconMap = {
    green: require("@/assets/img/green.png"),
    red: require("@/assets/img/red.png"),
    yellow: require("@/assets/img/yellow.png"),
  };
  return L.icon({
    iconUrl: iconMap[color] || iconMap["green"], // 默认使用绿色图标
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -10],
  });
};
// 添加设备标记到地图
const addDeviceMarkers = async () => {
  const devices = await getAllDevice(); // 调用方法获取设备数据

  devices.forEach((device) => {
    const {
      latitude,
      longitude,
      deviceName,
      location,
      peekDayForecastValue,
      shortTermForecastValue,
      suggestion,
      status,
    } = device;

    if (latitude && longitude) {
      // 根据状态选择图标颜色
      let iconColor = "green"; // 默认绿色
      if (status === "warning") iconColor = "yellow";
      if (status === "critical") iconColor = "red";

      // 创建带有图标的标记
      L.marker([latitude, longitude], { icon: getIconByColor(iconColor) })
        .addTo(map)
        .bindPopup(
          `
          <div style="font-size: 14px; color: #333; line-height: 1.6;">
            <strong>设备名称:</strong> ${deviceName}<br>
            <strong>位置:</strong> ${location}<br>
            <strong>短期预测值:</strong> ${
              shortTermForecastValue || "无数据"
            }<br>
            <strong>长期预测值:</strong> ${peekDayForecastValue || "无数据"}<br>
            <strong>建议:</strong> ${suggestion || "暂无建议"}
          </div>
        `
        );
    }
  });
};

// 获取所有设备数据的方法
const getAllDevice = async () => {
  try {
    const response = await mapDevice(); // 调用 API 获取设备数据
    console.log("设备数据:", response); // 打印日志以便调试
    return response; // 返回 API 的响应数据
  } catch (error) {
    console.error("Error fetching device data:", error);
    return []; // 如果发生错误，返回空数组以避免后续逻辑崩溃
  }
};

onMounted(() => {
  console.log("组件挂载，初始化地图");
  initMap();
  addDeviceMarkers(); // 初始化地图后添加设备标记
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
