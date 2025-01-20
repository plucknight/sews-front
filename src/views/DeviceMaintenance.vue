<template>
  <div>
    <Title>
      <template #title>Device Maintenance Management</template>
    </Title>

    <!-- 查询框和查询按钮 -->
    <div class="search-container">
      <div class="left">
        <el-input
          v-model="maintenanceIdQuery"
          placeholder="Enter maintenance ID to search"
          style="width: 200px; margin-right: 10px"
        />
        <el-input
          v-model="deviceIdQuery"
          placeholder="Enter device ID to search"
          style="width: 200px; margin-right: 10px"
        />
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </div>
      <div class="right">
        <el-button type="success" @click="handleAdd"
          >Add New Maintenance</el-button
        >
      </div>
    </div>

    <el-table
      :data="
        maintenanceTableData.slice(
          (currentPage - 1) * pagesize,
          currentPage * pagesize
        )
      "
      style="width: 98%"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column
        label="maintenanceId"
        prop="maintenanceId"
      ></el-table-column>
      <el-table-column label="deviceId" prop="deviceId"></el-table-column>
      <el-table-column label="photoTime" prop="photoTime">
        <template #default="{ row }">
          {{ formatDate(row.photoTime) }}
        </template>
      </el-table-column>
      <el-table-column label="filmTime" prop="filmTime">
        <template #default="{ row }">
          {{ formatDate(row.filmTime) }}
        </template>
      </el-table-column>
      <el-table-column label="weatherDataTime" prop="weatherDataTime">
        <template #default="{ row }">
          {{ formatDate(row.weatherDataTime) }}
        </template>
      </el-table-column>
      <el-table-column label="status" prop="status"></el-table-column>
      <el-table-column label="dataTime" prop="dataTime">
        <template #default="{ row }">
          {{ formatDate(row.dataTime) }}
        </template>
      </el-table-column>
      <el-table-column label="Operations">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)"
            >Edit</el-button
          >
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
        :total="maintenanceTableData.length"
        size="small"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="Edit Maintenance Record"
      :visible.sync="dialogVisible"
      width="400px"
      @close="handleDialogClose"
    >
      <el-form :model="editForm">
        <el-form-item label="deviceId" prop="deviceId">
          <el-input v-model="editForm.deviceId" />
        </el-form-item>
        <el-form-item label="photoTime" prop="photoTime">
          <el-date-picker
            v-model="editForm.photoTime"
            type="datetime"
            placeholder="Select date and time"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="filmTime" prop="filmTime">
          <el-date-picker
            v-model="editForm.filmTime"
            type="datetime"
            placeholder="Select date and time"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="weatherDataTime" prop="weatherDataTime">
          <el-date-picker
            v-model="editForm.weatherDataTime"
            type="datetime"
            placeholder="Select date and time"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="status" prop="status">
          <el-input v-model="editForm.status" />
        </el-form-item>
        <el-form-item label="dataTime" prop="dataTime">
          <el-date-picker
            v-model="editForm.dataTime"
            type="datetime"
            placeholder="Select date and time"
            style="width: 100%"
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

<script>
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElMessage,
  ElPagination,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElDatePicker,
} from "element-plus";
import Title from "@/components/device/Title.vue"; // 假设 Title 是一个已定义的组件
import {
  getMaintenanceRecords,
  getMaintenanceById,
  getMaintenanceByDeviceId,
  addDeviceMaintenance,
  getMaintenanceByIdAndDeviceId,
} from "@/api/api"; // 引入封装好的请求方法
import { formatDate } from "@/utils/dateUtils.js"; // 引入自定义的日期格式化函数

export default {
  components: {
    ElTable,
    ElTableColumn,
    ElButton,
    ElMessage,
    ElPagination,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElDatePicker,
    Title,
  },
  data() {
    return {
      maintenanceTableData: [],
      currentPage: 1,
      pagesize: 10,
      dialogVisible: false,
      editForm: {
        maintenanceId: "",
        deviceId: "",
        photoTime: "",
        filmTime: "",
        weatherDataTime: "",
        status: "normal", // 默认状态
        dataTime: "",
      },
      maintenanceIdQuery: "", // 用于查询的维护ID
      deviceIdQuery: "", // 用于查询的设备ID
    };
  },
  mounted() {
    this.fetchAllMaintenanceRecords();
  },
  methods: {
    formatDate,
    async fetchAllMaintenanceRecords() {
      try {
        const response = await getMaintenanceRecords();
        this.maintenanceTableData = response;
      } catch (error) {
        console.error("Error fetching maintenance records:", error);
      }
    },
    handleSizeChange(size) {
      this.pagesize = size;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    async handleSearch() {
      try {
        console.log("maintenanceIdQuery:", this.maintenanceIdQuery);
        console.log("deviceIdQuery:", this.deviceIdQuery);
        let response;
        if (this.maintenanceIdQuery && this.deviceIdQuery) {
          // 同时使用设备ID和维护ID进行查询
          response = await getMaintenanceByIdAndDeviceId(
            this.deviceIdQuery,
            this.maintenanceIdQuery
          );
          this.maintenanceTableData = response;
        } else if (this.maintenanceIdQuery) {
          // 使用维护ID进行查询
          response = await getMaintenanceById(this.maintenanceIdQuery);
          this.maintenanceTableData = [response];
        } else if (this.deviceIdQuery) {
          // 使用设备ID进行查询
          response = await getMaintenanceByDeviceId(this.deviceIdQuery);
          this.maintenanceTableData = response;
        } else {
          response = await getMaintenanceRecords();
          this.maintenanceTableData = response;
        }
      } catch (error) {
        console.error("Error searching for maintenance record:", error);
      }
    },
    handleAdd() {
      // 重置表单，准备新增
      this.editForm = {
        deviceId: "",
        photoTime: new Date(),
        filmTime: new Date(),
        weatherDataTime: new Date(),
        status: "normal",
        dataTime: new Date(),
      };
      this.dialogVisible = true; // 显示编辑对话框
    },

    handleEdit(row) {
      // 将表格行数据赋值给编辑表单
      this.editForm = { ...row };
      this.dialogVisible = true; // 显示编辑对话框
    },
    handleDialogClose() {
      this.editForm = {
        maintenanceId: "",
        deviceId: "",
        photoTime: "",
        filmTime: "",
        weatherDataTime: "",
        status: "normal",
        dataTime: "",
      };
    },
    async handleSave() {
      try {
        if (this.editForm.maintenanceId) {
          // 如果 maintenanceId 存在，则是更新操作
          const response = await addDeviceMaintenance(this.editForm);
          const index = this.maintenanceTableData.findIndex(
            (item) => item.maintenanceId === this.editForm.maintenanceId
          );
          if (index !== -1) {
            this.maintenanceTableData.splice(index, 1, { ...this.editForm });
          }
          ElMessage({
            type: "success",
            message: "Maintenance record updated successfully!",
          });
        } else {
          // 否则是新增操作
          const newRecord = await addDeviceMaintenance(this.editForm);
          this.maintenanceTableData.push(newRecord); // 新增记录到表格
          ElMessage({
            type: "success",
            message: "Maintenance record added successfully!",
          });
        }
        this.dialogVisible = false; // 关闭对话框
      } catch (error) {
        console.error("Error saving maintenance record:", error);
        ElMessage({
          type: "error",
          message: "Failed to save maintenance record.",
        });
      }
    },
  },
};
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
