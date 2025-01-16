<template>
  <Float />
  <div class="map-container" id="mapContainer"></div>
  <div class="add-marker-btn" @click="showInputDialog">添加标记</div>

  <!-- 弹出框 -->
  <div v-show="isDialogVisible" class="dialog-overlay">
    <div class="dialog">
      <h3>添加标记</h3>

      <label for="longitude">经度：</label>
      <input
        type="number"
        id="longitude"
        v-model="newMarker.lng"
        placeholder="请输入经度"
      />
      <label for="latitude">纬度：</label>
      <input
        type="number"
        id="latitude"
        v-model="newMarker.lat"
        placeholder="请输入纬度"
      />
      <label for="color">选择颜色：</label>
      <select id="color" v-model="newMarker.color">
        <option value="green">绿色</option>
        <option value="red">红色</option>
        <option value="yellow">黄色</option>
      </select>

      <button @click="addNewMarker">确定</button>
      <button @click="closeDialog">取消</button>
    </div>
  </div>

  <!-- 用于调试显示 -->
  <div>
    <h4>Dialog 显示状态: {{ isDialogVisible }}</h4>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Float from "@/components/float/float.vue"; // 导入组件
import geoJsonData from "@/assets/js/geo.json"; // 导入GeoJSON文件

// 用来存储新的标记数据
const newMarker = ref({
  lat: null,
  lng: null,
  color: "green", // 默认颜色
});

// 控制弹窗显示与隐藏
const isDialogVisible = ref(false);

// 用于存储地图实例
let map = null;

// 显示输入弹框
const showInputDialog = () => {
  console.log("点击了添加标记按钮");
  isDialogVisible.value = true;
  console.log("Dialog 显示状态:", isDialogVisible.value); // 输出弹窗状态
};

// 关闭弹框
const closeDialog = () => {
  console.log("关闭弹窗");
  isDialogVisible.value = false;
  console.log("Dialog 显示状态:", isDialogVisible.value); // 输出弹窗状态
};

// 根据选择的颜色返回对应的图标
const getIconByColor = (color) => {
  const iconMap = {
    green: require("@/assets/img/green.png"),
    red: require("@/assets/img/red.png"),
    yellow: require("@/assets/img/yellow.png"),
  };
  return L.icon({
    iconUrl: iconMap[color], // 根据颜色选择对应的图片
    iconSize: [25, 25],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

// 初始化地图的函数
const initMap = () => {
  if (map) return map; // 如果地图已经存在，直接返回现有地图实例

  // 创建地图对象
  map = L.map("mapContainer", {
    center: [34.3416, 108.9398], // 设置地图中心为西安的经纬度
    zoom: 5,
    minZoom: 5,
    maxZoom: 25,
    zoomControl: false,
    attributionControl: false,
  });

  // 设置地图底图层
  L.tileLayer(
    "https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
    { attribution: "&copy; <p>OpenStreetMap</p> contributors" }
  ).addTo(map);

  // 定义一个变量存储遮罩图层
  let hoverLayer = null;

  // 递归处理GeoJSON数据，加载省市区的区域
  const processGeoJsonData = (node) => {
    if (node.properties.level === "province") {
      const geoData = node;

      if (geoData && geoData.geometry) {
        const provinceLayer = L.geoJSON(geoData, {
          style: { color: "#C0C0C0", weight: 1, fillOpacity: 0.6 },
          onEachFeature: (feature, layer) => {
            layer.on("mouseover", () => {
              const bounds = layer.getBounds();

              if (hoverLayer) {
                map.removeLayer(hoverLayer);
              }

              hoverLayer = L.geoJSON(geoData, {
                style: {
                  color: "#61AFEF",
                  weight: 2,
                  fillColor: "#61AFEF",
                  fillOpacity: 0.5,
                },
              }).addTo(map);
            });

            layer.on("mouseout", () => {
              setTimeout(() => {
                if (hoverLayer) {
                  map.removeLayer(hoverLayer);
                  hoverLayer = null;
                }
              }, 4000);
            });

            layer.on("click", () => {
              map.setView(
                node.properties.center || [34.3416, 108.9398],
                map.getZoom()
              );
            });
          },
        }).addTo(map);

        if (node.properties.children) {
          node.properties.children.forEach((child) =>
            processGeoJsonData(child)
          );
        }
      }
    }
  };

  // 处理GeoJSON数据
  geoJsonData.features.forEach((feature) => processGeoJsonData(feature));

  return map;
};

// 动态添加标记的函数
const addNewMarker = () => {
  console.log("准备添加新的标记");
  const { lat, lng, color } = newMarker.value; // 获取用户输入的坐标和颜色

  // 模拟的预测结果和防治建议
  const longTermPrediction = "长期预测结果：温暖气候可能导致害虫数量上升";
  const previousResults = "前两次监测结果：数量分别为 20 和 25";
  const currentPrediction = "本次预测结果：预计数量为 30";
  const preventionSuggestions = "防治建议：使用生物农药进行防治";

  if (lat && lng) {
    const newIcon = getIconByColor(color); // 根据选择的颜色获取图标

    // 获取地图实例
    const currentMap = initMap();

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

    console.log("标记已添加");
  } else {
    alert("请输入有效的坐标！");
  }
  closeDialog(); // 关闭弹窗
};

// 监听地图容器大小变化，确保蒙版大小和地图容器一致
const onMapResize = () => {
  const mapContainer = document.getElementById("mapContainer");
  const dialogOverlay = document.querySelector(".dialog-overlay");

  // 强制更新蒙版大小
  dialogOverlay.style.width = `${mapContainer.offsetWidth}px`;
  dialogOverlay.style.height = `${mapContainer.offsetHeight}px`;
};

// 在组件挂载后初始化地图，并设置监听器
onMounted(() => {
  console.log("组件挂载，初始化地图");
  initMap();
  onMapResize(); // 初始化时同步蒙版大小
  window.addEventListener("resize", onMapResize); // 窗口大小改变时重新同步蒙版大小
});

// 在组件更新时同步蒙版大小
onUpdated(() => {
  onMapResize(); // 更新时同步蒙版
});

// 清理监听器
onUnmounted(() => {
  window.removeEventListener("resize", onMapResize);
});
</script>

<style>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.add-marker-btn {
  position: fixed; /* 固定位置 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 居中 */
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 1000; /* 确保按钮在地图上方 */
}

.dialog-overlay {
  position: absolute; /* 绝对定位确保蒙版跟地图容器同步 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001; /* 确保蒙版在地图之上 */
}

.dialog {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  z-index: 1002; /* 弹窗本身的z-index */
}

.dialog h3 {
  text-align: center;
}

.dialog input,
.dialog select {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
}

.dialog button {
  width: 48%;
  padding: 10px;
  margin-top: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.dialog button:hover {
  background-color: #0056b3;
}
</style>
