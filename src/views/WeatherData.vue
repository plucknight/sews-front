<template>
  <div>
    <Title>
      <template #title> Weather Data </template>
    </Title>

    <!-- 添加查询框和查询按钮 -->
    <div class="search-container">
      <div class="left">
        <el-input
          v-model="searchQuery"
          placeholder="Enter device ID to search"
          style="width: 200px; margin-right: 10px"
        />
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </div>
    </div>

    <el-table
      :data="
        weatherDataTable.slice(
          (currentPage - 1) * pagesize,
          currentPage * pagesize
        )
      "
      style="width: 98%"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column label="Weather ID" prop="weatherId"></el-table-column>
      <el-table-column label="Device ID" prop="deviceId"></el-table-column>
      <el-table-column label="Temperature" prop="temperature"></el-table-column>
      <el-table-column label="Humidity" prop="humidity"></el-table-column>
      <el-table-column
        label="Precipitation"
        prop="precipitation"
      ></el-table-column>
      <el-table-column label="Radiation" prop="radiation"></el-table-column>
      <el-table-column label="Wind Speed" prop="windSpeed"></el-table-column>
      <el-table-column label="Data Time" prop="dataTime">
        <template #default="{ row }">
          {{ formatDate(row.dataTime) }}
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
        :total="weatherDataTable.length"
        size="small"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="Edit Weather Data"
      :visible.sync="dialogVisible"
      width="400px"
      @close="handleDialogClose"
    >
      <el-form :model="editForm">
        <el-form-item label="Device ID" prop="deviceId">
          <el-input v-model="editForm.deviceId" type="number" />
        </el-form-item>
        <el-form-item label="Temperature" prop="temperature">
          <el-input v-model="editForm.temperature" type="number" />
        </el-form-item>
        <el-form-item label="Humidity" prop="humidity">
          <el-input v-model="editForm.humidity" type="number" />
        </el-form-item>
        <el-form-item label="Precipitation" prop="precipitation">
          <el-input v-model="editForm.precipitation" type="number" />
        </el-form-item>
        <el-form-item label="Radiation" prop="radiation">
          <el-input v-model="editForm.radiation" type="number" />
        </el-form-item>
        <el-form-item label="Wind Speed" prop="windSpeed">
          <el-input v-model="editForm.windSpeed" type="number" />
        </el-form-item>
        <el-form-item label="Data Time" prop="dataTime">
          <el-date-picker
            v-model="editForm.dataTime"
            type="datetime"
            placeholder="Select date and time"
          />
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
import { ref, reactive, onMounted } from "vue";
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
  getAllWeatherData,
  getWeatherDataById,
  updateWeatherData,
  addWeatherData,
  deleteWeatherDataById,
} from "@/api/api"; // 引入封装好的请求方法
import { formatDate } from "@/utils/dateUtils.js"; // 引入自定义的日期格式化函数

// Reactive variables
const weatherDataTable = ref([]);
const currentPage = ref(1);
const pagesize = ref(10);
const dialogVisible = ref(false);
const searchQuery = ref("");
const editForm = reactive({
  weatherId: "",
  deviceId: "",
  temperature: 0,
  humidity: 0,
  precipitation: 0,
  radiation: 0,
  windSpeed: 0,
  dataTime: "",
});

// Fetch all weather data
const fetchAllWeatherData = async () => {
  try {
    const response = await getAllWeatherData();
    weatherDataTable.value = response;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

// Search weather data by device ID
const handleSearch = async () => {
  try {
    if (!searchQuery.value) {
      weatherDataTable.value = await getAllWeatherData();
    } else {
      const response = await getWeatherDataById(searchQuery.value);
      weatherDataTable.value = response ? [response] : [];
    }
  } catch (error) {
    console.error(error);
  }
};

// Handle adding new weather data
const handleAdd = () => {
  editForm.deviceId = "";
  editForm.temperature = 0;
  editForm.humidity = 0;
  editForm.precipitation = 0;
  editForm.radiation = 0;
  editForm.windSpeed = 0;
  editForm.dataTime = new Date();
  dialogVisible.value = true;
};

// Handle editing an existing weather data
const handleEdit = (row) => {
  Object.assign(editForm, row);
  dialogVisible.value = true;
};

// Handle closing the dialog and resetting the form
const handleDialogClose = () => {
  Object.assign(editForm, {
    weatherId: "",
    deviceId: "",
    temperature: 0,
    humidity: 0,
    precipitation: 0,
    radiation: 0,
    windSpeed: 0,
    dataTime: "",
  });
};

// Handle saving the weather data (either add or update)
const handleSave = async () => {
  try {
    if (editForm.weatherId) {
      // Update existing data
      await updateWeatherData(editForm);
      const index = weatherDataTable.value.findIndex(
        (item) => item.weatherId === editForm.weatherId
      );
      if (index !== -1) {
        weatherDataTable.value.splice(index, 1, { ...editForm });
      }
      ElMessage({
        type: "success",
        message: "Weather data updated successfully!",
      });
    } else {
      // Add new data
      const newData = await addWeatherData(editForm);
      weatherDataTable.value.push(newData);
      ElMessage({
        type: "success",
        message: "Weather data added successfully!",
      });
    }
    dialogVisible.value = false;
  } catch (error) {
    ElMessage({ type: "error", message: "Failed to save weather data." });
  }
};

// Handle deleting weather data
const handleDelete = async (row) => {
  try {
    await deleteWeatherDataById(row.weatherId);
    const index = weatherDataTable.value.findIndex(
      (item) => item.weatherId === row.weatherId
    );
    if (index !== -1) {
      weatherDataTable.value.splice(index, 1);
    }
    ElMessage({
      type: "success",
      message: "Weather data deleted successfully!",
    });
  } catch (error) {
    ElMessage({ type: "error", message: "Failed to delete weather data." });
  }
};

// Handle pagination size change
const handleSizeChange = (size) => {
  pagesize.value = size;
};

// Handle current page change
const handleCurrentChange = (page) => {
  currentPage.value = page;
};

// Mount the component and fetch initial data
onMounted(fetchAllWeatherData);
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
}

.right {
  display: flex;
  align-items: center;
}
</style>
