<template>
  <div>
    <Title>
      <template #title> Device Management </template>
    </Title>

    <!-- 添加查询框和查询按钮 -->
    <div class="search-container">
      <!-- 左侧：查询框和查询按钮 -->
      <div class="left">
        <el-input
          v-model="searchQuery"
          placeholder="Enter device name to search"
          style="width: 200px; margin-right: 10px"
        />
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </div>

      <!-- 右侧：新增按钮 -->
      <div class="right">
        <!-- Element Plus 添加坐标和选择颜色的对话框 -->
        <el-button
          @click="showInputDialog"
          type="primary"
          class="add-marker-btn"
          >添加设备</el-button
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
                v-model="newDevice.trapsId"
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
            <el-button type="primary" @click="addDevice1">确定</el-button>
          </span>
        </el-dialog>
        <el-button type="success" @click="handleAdd">Add New</el-button>
      </div>
    </div>

    <el-table
      :data="
        deviceTableData.slice(
          (currentPage - 1) * pagesize,
          currentPage * pagesize
        )
      "
      style="width: 98%"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <!-- <el-table-column label="deviceId" prop="deviceId"></el-table-column> -->
      <el-table-column label="deviceName" prop="deviceName"></el-table-column>
      <el-table-column label="trapsId" prop="trapsId"></el-table-column>
      <el-table-column label="location" prop="location"></el-table-column>
      <el-table-column label="latitude" prop="latitude"></el-table-column>
      <el-table-column label="longitude" prop="longitude"></el-table-column>
      <el-table-column label="cropType" prop="cropType"></el-table-column>
      <el-table-column label="adminName" prop="adminName"></el-table-column>
      <el-table-column label="adminPhone" prop="adminPhone"></el-table-column>
      <el-table-column label="installTime" prop="installTime">
        <template #default="{ row }">
          {{ formatDate(row.installTime) }}
        </template>
      </el-table-column>
      <el-table-column
        label="status"
        prop="status"
        sortable="custom"
      ></el-table-column>
      <el-table-column label="dataTime" prop="dataTime" sortable="custom">
        <template #default="{ row }">
          {{ formatDate(row.dataTime) }}
        </template>
      </el-table-column>
      <el-table-column label="Operations">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)"
            >Edit</el-button
          >
          <el-popconfirm
            title="Are you sure to delete this?"
            @confirm="handleDelete(scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">Delete</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        background
        :page-sizes="[5, 10, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="deviceTableData.length"
        size="small"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="Edit Device Information"
      :visible.sync="dialogVisible"
      width="400px"
      @close="handleDialogClose"
    >
      <el-form :model="editForm">
        <el-form-item label="deviceName" prop="deviceName">
          <el-input v-model="editForm.deviceName" />
        </el-form-item>
        <el-form-item label="trapsId" prop="trapsId">
          <el-input v-model="editForm.trapsId" />
        </el-form-item>
        <el-form-item label="location" prop="location">
          <el-input v-model="editForm.location" />
        </el-form-item>
        <el-form-item label="latitude" prop="latitude">
          <el-input v-model="editForm.latitude" />
        </el-form-item>
        <el-form-item label="longitude" prop="longitude">
          <el-input v-model="editForm.longitude" />
        </el-form-item>
        <el-form-item label="cropType" prop="cropType">
          <el-input v-model="editForm.cropType" />
        </el-form-item>
        <el-form-item label="adminName" prop="adminName">
          <el-input v-model="editForm.adminName" />
        </el-form-item>
        <el-form-item label="adminPhone" prop="adminPhone">
          <el-input v-model="editForm.adminPhone" />
        </el-form-item>
        <el-form-item label="installTime" prop="installTime">
          <el-date-picker
            v-model="editForm.installTime"
            type="datetime"
            placeholder="Select date and time"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="status" prop="status">
          <el-input v-model="editForm.status" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSave">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElMessageBox,
  ElMessage,
  ElPagination,
  ElPopconfirm,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElDatePicker,
} from "element-plus";
import Title from "@/components/device/Title.vue"; // 假设 Title 是一个已定义的组件
import {
  getAllDevices,
  getDeviceById,
  updateDevice,
  addDevice,
  deleteDeviceById,
} from "@/api/api"; // 引入封装好的请求方法
import { formatDate } from "@/utils/dateUtils.js"; // 引入自定义的日期格式化函数

// State
const deviceTableData = ref([]);
const currentPage = ref(1);
const pagesize = ref(10);
const dialogVisible = ref(false);
const searchQuery = ref("");
const editForm = reactive({
  deviceId: "",
  deviceName: "",
  trapsId: "",
  location: "",
  latitude: "",
  longitude: "",
  cropType: "",
  adminName: "",
  adminId: "",
  adminPhone: "",
  installTime: "",
  status: "",
  dataTime: "",
});

// Methods
const fetchAllDevices = async () => {
  try {
    const response = await getAllDevices();
    deviceTableData.value = response;
  } catch (error) {
    console.error("Error fetching devices:", error);
  }
};

const handleSizeChange = (size) => {
  pagesize.value = size;
};

const handleCurrentChange = (page) => {
  currentPage.value = page;
};

const handleSearch = async () => {
  try {
    if (!searchQuery.value) {
      return (deviceTableData.value = await getAllDevices());
    }
    const response = await getDeviceById(searchQuery.value);
    if (response) {
      deviceTableData.value = [response];
    }
  } catch (error) {
    console.error("Error searching for device:", error);
  }
};

const handleAdd = () => {
  // Reset form and prepare for adding a new device
  Object.assign(editForm, {
    deviceName: "",
    trapsId: "",
    location: "",
    latitude: "",
    longitude: "",
    cropType: "",
    adminName: "",
    adminId: "",
    adminPhone: "",
    installTime: new Date(),
    status: "",
    dataTime: new Date(),
  });
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  // Fill form with data from the selected row
  Object.assign(editForm, row);
  dialogVisible.value = true;
};

const handleDialogClose = () => {
  // Reset form
  Object.assign(editForm, {
    deviceId: "",
    deviceName: "",
    trapsId: "",
    location: "",
    latitude: "",
    longitude: "",
    cropType: "",
    adminName: "",
    adminId: "",
    adminPhone: "",
    installTime: "",
    status: "",
    dataTime: "",
  });
};

const handleSave = async () => {
  try {
    if (editForm.deviceId) {
      // Update device
      const response = await updateDevice(editForm.deviceId, editForm);
      const index = deviceTableData.value.findIndex(
        (item) => item.deviceId === editForm.deviceId
      );
      if (index !== -1) {
        deviceTableData.value.splice(index, 1, { ...editForm });
      }
      ElMessage({
        type: "success",
        message: "Device updated successfully!",
      });
    } else {
      // Add new device
      const newDevice = await addDevice(editForm);
      deviceTableData.value.push(newDevice);
      ElMessage({
        type: "success",
        message: "Device added successfully!",
      });
    }
    dialogVisible.value = false;
  } catch (error) {
    console.error("Error saving device:", error);
    ElMessage({
      type: "error",
      message: "Failed to save device.",
    });
  }
};

const handleDelete = (row) => {
  ElMessageBox.confirm(
    "Are you sure you want to delete this device?",
    "Warning",
    {
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(async () => {
      const index = deviceTableData.value.findIndex(
        (item) => item.deviceId === row.deviceId
      );
      if (index !== -1) {
        await deleteDeviceById(row.deviceId);
        deviceTableData.value.splice(index, 1);
        ElMessage({
          type: "success",
          message: "Device deleted successfully!",
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete cancelled",
      });
    });
};
const newDevice = ref({
  deviceName: "",
  trapsId: "",
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
    trapsId: "",
    location: "",
    latitude: null,
    longitude: null,
    cropType: "",
    adminName: "",
    adminPhone: "",
  };
};
const addDevice1 = async () => {
  const longTermPrediction = "长期预测结果：温暖气候可能导致害虫数量上升";
  const previousResults = "前两次监测结果：数量分别为 20 和 25";
  const currentPrediction = "本次预测结果：预计数量为 30";
  const preventionSuggestions = "防治建议：使用生物农药进行防治";
  console.log("Add Marker Function Called");
  const deviceData = { ...newDevice.value }; // 获取表单数据
  try {
    const response = await addDevice(deviceData); // 发送请求到后端
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
// Lifecycle hooks
onMounted(() => {
  fetchAllDevices();
});
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.search-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.left {
  display: flex;
  align-items: center;
}

.right {
  display: flex;
  padding-right: 3%;
  align-items: center;
}
</style>
