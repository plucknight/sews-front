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
      <el-table-column label="deviceType" prop="deviceType"></el-table-column>
      <!-- <el-table-column label="location" prop="location"></el-table-column> -->
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
        <el-form-item label="deviceType" prop="deviceType">
          <el-input v-model="editForm.deviceType" />
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

<script>
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

export default {
  components: {
    ElTable,
    ElTableColumn,
    ElButton,
    ElMessageBox,
    ElPagination,
    ElPopconfirm,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElDatePicker,
    Title,
  },
  data() {
    return {
      deviceTableData: [],
      currentPage: 1,
      pagesize: 10,
      dialogVisible: false,
      editForm: {
        deviceId: "",
        deviceName: "",
        deviceType: "",
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
      },
      searchQuery: "", // 用于存储查询框输入的内容
    };
  },
  mounted() {
    this.fetchAllDevices();
  },
  methods: {
    formatDate,
    async fetchAllDevices() {
      try {
        const response = await getAllDevices();
        this.deviceTableData = response; // 假设 API 返回的是设备数据
      } catch (error) {
        console.error("Error fetching devices:", error);
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
        if (this.searchQuery === "" || this.searchQuery == null) {
          return (this.deviceTableData = await getAllDevices());
        }
        const response = await getDeviceById(this.searchQuery);
        if (response != null) {
          console.log("Searching for:", response);
          this.deviceTableData = [response];
        }
      } catch (error) {
        console.error("Error searching for device:", error);
      }
    },
    handleAdd() {
      // 重置表单，准备新增
      this.editForm = {
        deviceName: "",
        deviceType: "",
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
        deviceId: "",
        deviceName: "",
        deviceType: "",
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
      };
    },
    async handleSave() {
      try {
        if (this.editForm.deviceId) {
          // 如果 deviceId 存在，则是更新操作
          const response = await updateDevice(
            this.editForm.deviceId,
            this.editForm
          );
          console.log("res", response);
          const index = this.deviceTableData.findIndex(
            (item) => item.deviceId === this.editForm.deviceId
          );
          if (index !== -1) {
            this.deviceTableData.splice(index, 1, { ...this.editForm });
          }
          ElMessage({
            type: "success",
            message: "Device updated successfully!",
          });
        } else {
          // 否则是新增操作
          const newDevice = await addDevice(this.editForm);
          console.log("newDevice", newDevice);
          this.deviceTableData.push(newDevice); // 将新添加的设备加入表格数据
          ElMessage({
            type: "success",
            message: "Device added successfully!",
          });
        }
        this.dialogVisible = false; // 关闭对话框
      } catch (error) {
        console.error("Error saving device:", error);
        ElMessage({
          type: "error",
          message: "Failed to save device.",
        });
      }
    },
    handleDelete(row) {
      ElMessageBox.confirm(
        "Are you sure you want to delete this device?",
        "Warning",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          const index = this.deviceTableData.findIndex(
            (item) => item.deviceId === row.deviceId
          );
          if (index !== -1) {
            const response = deleteDeviceById(row.deviceId);
            this.deviceTableData.splice(index, 1); // 删除表格中的数据
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
