<template>
  <div id="monitor">
    <Title>
      <template #title> 实时监控 </template>
    </Title>

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
  </div>
</template>

<script setup>
import Title from "@/components/device/Title.vue";
import { ref, onMounted, onUpdated, onUnmounted } from "vue";
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput } from "element-plus";
import "leaflet/dist/leaflet.css"; // 引入 Leaflet 的 CSS 文件
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
</script>

<style lang="less" scoped></style>
