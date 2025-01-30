<template>
  <Float />
  <div class="map-container" id="mapContainer"></div>

  <!-- Element Plus 添加坐标和选择颜色的对话框 -->
  <el-button @click="showInputDialog" type="primary" class="add-marker-btn"
    >添加标记</el-button
  >
  <el-dialog
    title="添加设备"
    v-model="isDialogVisible"
    width="400px"
    @close="resetForm"
  >
    <el-form :model="newDevice" label-width="100px">
      <el-form-item label="设备名称">
        <el-input
          v-model="newDevice.deviceName"
          placeholder="输入设备名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="设备类型">
        <el-input
          v-model="newDevice.deviceType"
          placeholder="输入设备类型"
        ></el-input>
      </el-form-item>
      <el-form-item label="位置">
        <el-input
          v-model="newDevice.location"
          placeholder="输入位置"
        ></el-input>
      </el-form-item>
      <el-form-item label="纬度">
        <el-input
          v-model="newDevice.latitude"
          type="number"
          placeholder="输入纬度"
        ></el-input>
      </el-form-item>
      <el-form-item label="经度">
        <el-input
          v-model="newDevice.longitude"
          type="number"
          placeholder="输入经度"
        ></el-input>
      </el-form-item>
      <el-form-item label="作物类型">
        <el-input
          v-model="newDevice.cropType"
          placeholder="输入作物类型"
        ></el-input>
      </el-form-item>
      <el-form-item label="管理员姓名">
        <el-input
          v-model="newDevice.adminName"
          placeholder="输入管理员姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="管理员电话">
        <el-input
          v-model="newDevice.adminPhone"
          placeholder="输入管理员电话"
        ></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="isDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="addDevice">确定</el-button>
    </span>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Float from "@/components/float/float.vue";
import geoJsonData from "@/assets/js/geo.json"; // 导入省级区域的GeoJSON数据
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput } from "element-plus";

// 弹窗数据模型
const newDevice = ref({
  deviceName: "",
  deviceType: "",
  location: "",
  latitude: null,
  longitude: null,
  cropType: "",
  adminName: "",
  adminPhone: "",
});
const isDialogVisible = ref(false);
const showInputDialog = () => {
  console.log("点击了添加标记按钮");
  isDialogVisible.value = true;
  console.log("Dialog 显示状态:", isDialogVisible.value); // 输出弹窗状态
};
let map = null;

const getIconByColor = (color) => {
  const iconMap = {
    green: require("@/assets/img/green.png"),
    red: require("@/assets/img/red.png"),
    yellow: require("@/assets/img/yellow.png"),
  };
  return L.icon({
    iconUrl: iconMap[color],
    iconSize: [25, 25],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

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
let tooltipLayer = null;
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
          let currentTooltipLayer = null;
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
            if (!currentTooltipLayer) {
              currentTooltipLayer = layer.openTooltip();
            }
          });

          // 鼠标移开时清除高亮图层
          layer.on("mouseout", () => {
            setTimeout(() => {
              if (currentHoverLayer) {
                map.removeLayer(currentHoverLayer);
                currentHoverLayer = null;
              }
              if (currentTooltipLayer) {
                layer.closeTooltip();
                currentTooltipLayer = null;
              }
            }, 100);
          });
        },
      }).addTo(map);
    }
  }
};

// 重置表单
const resetForm = () => {
  newDevice.value = {
    deviceName: "",
    deviceType: "",
    location: "",
    latitude: null,
    longitude: null,
    cropType: "",
    adminName: "",
    adminPhone: "",
  };
};
// 添加设备方法
const addDevice = async () => {
  const longTermPrediction = "长期预测结果：温暖气候可能导致害虫数量上升";
  const previousResults = "前两次监测结果：数量分别为 20 和 25";
  const currentPrediction = "本次预测结果：预计数量为 30";
  const preventionSuggestions = "防治建议：使用生物农药进行防治";
  console.log("Add Marker Function Called");
  const deviceData = { ...newDevice.value }; // 获取表单数据
  try {
    const response = await axios.post("/api/devices", deviceData); // 发送请求到后端
    console.log("设备添加成功", response.data);

    const { lat, lng, color } = newDevice.value;
    if (lat !== null && lng !== null) {
      const newIcon = getIconByColor(color); // 根据选择的颜色获取图标
      const currentMap = initMap();
      console.log(`Adding marker at Lat: ${lat}, Lng: ${lng}, Color: ${color}`);
      // 在指定位置添加新标记
      L.marker([lat, lng], { icon: newIcon })
        .addTo(currentMap)
        .bindPopup(
          `
          <div style="font-size: 14px; color: #333; line-height: 1.6;">
            <strong>新标记: (${lat}, ${lng})</strong><br>
            <div style="color: #007bff; font-weight: bold;">${longTermPrediction}</div><br>
            <div style="color: #28a745;">${previousResults}</div><br>
            <div style="color: #ffc107;">${currentPrediction}</div><br>
            <div style="color: #dc3545; font-style: italic;">${preventionSuggestions}</div>
          </div>
        `
        )
        .openPopup();

      isDialogVisible.value = false; // 关闭对话框
      resetForm(); // 重置表单
    }
  } catch (error) {
    console.error("添加设备失败", error);
    alert("设备添加失败，请重试");
  }
};

onMounted(() => {
  console.log("组件挂载，初始化地图");
  initMap();
});

onUpdated(() => {});

onUnmounted(() => {});
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
.add-marker-btn {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 1000;
}
</style>
