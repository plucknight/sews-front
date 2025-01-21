<template>
  <div>
    <Title>
      <template #title> Warning Information </template>
    </Title>

    <!-- 添加查询框和查询按钮 -->
    <div class="search-container">
      <div class="left">
        <el-input
          v-model="searchQuery"
          placeholder="Enter warning message to search"
          style="width: 200px; margin-right: 10px"
        />
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </div>
    </div>

    <el-table
      :data="
        warningInfoTableData.slice(
          (currentPage - 1) * pagesize,
          currentPage * pagesize
        )
      "
      style="width: 98%"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column label="warningId" prop="warningId"></el-table-column>
      <el-table-column label="deviceId" prop="deviceId"></el-table-column>
      <el-table-column
        label="warningLevel"
        prop="warningLevel"
      ></el-table-column>
      <el-table-column
        label="warningMessage"
        prop="warningMessage"
      ></el-table-column>
      <el-table-column label="publishDate" prop="publishDate">
        <template #default="{ row }">
          {{ formatDate(row.publishDate) }}
        </template>
      </el-table-column>
      <el-table-column label="dataTime" prop="dataTime">
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
        :total="warningInfoTableData.length"
        size="small"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="Edit Warning Information"
      :visible.sync="dialogVisible"
      width="400px"
      @close="handleDialogClose"
    >
      <el-form :model="editForm">
        <el-form-item label="deviceId" prop="deviceId">
          <el-input v-model="editForm.deviceId" type="number" />
        </el-form-item>
        <el-form-item label="warningLevel" prop="warningLevel">
          <el-input v-model="editForm.warningLevel" />
        </el-form-item>
        <el-form-item label="warningMessage" prop="warningMessage">
          <el-input v-model="editForm.warningMessage" />
        </el-form-item>
        <el-form-item label="publishDate" prop="publishDate">
          <el-date-picker v-model="editForm.publishDate" type="datetime" />
        </el-form-item>
        <el-form-item label="dataTime" prop="dataTime">
          <el-date-picker v-model="editForm.dataTime" type="datetime" />
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
  getAllWarningInfo,
  getWarningInfoById,
  updateWarningInfo,
  addWarningInfo,
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
      warningInfoTableData: [],
      currentPage: 1,
      pagesize: 10,
      dialogVisible: false,
      editForm: {
        warningId: "",
        deviceId: "",
        warningLevel: "",
        warningMessage: "",
        publishDate: "",
        dataTime: "",
      },
      searchQuery: "",
    };
  },
  mounted() {
    this.fetchAllWarningInfo();
  },
  methods: {
    formatDate,
    async fetchAllWarningInfo() {
      try {
        const response = await getAllWarningInfo();
        console.log("response", response);
        this.warningInfoTableData = response;
      } catch (error) {
        console.error("Error fetching warning information:", error);
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
          return (this.warningInfoTableData = await getAllWarningInfo());
        }
        const response = await getWarningInfoById(this.searchQuery);
        if (response != null) {
          this.warningInfoTableData = [response];
        }
      } catch (error) {
        console.error(error);
      }
    },
    handleAdd() {
      this.editForm = {
        warningId: "",
        deviceId: "",
        warningLevel: "",
        warningMessage: "",
        publishDate: new Date(),
        dataTime: new Date(),
      };
      this.dialogVisible = true;
    },

    handleDialogClose() {
      this.editForm = {
        warningId: "",
        deviceId: "",
        warningLevel: "",
        warningMessage: "",
        publishDate: "",
        dataTime: "",
      };
    },
    async handleSave() {
      try {
        if (this.editForm.warningId) {
          const response = await updateWarningInfo(
            this.editForm.warningId,
            this.editForm
          );
          const index = this.warningInfoTableData.findIndex(
            (item) => item.warningId === this.editForm.warningId
          );
          if (index !== -1) {
            this.warningInfoTableData.splice(index, 1, { ...this.editForm });
          }
          ElMessage({
            type: "success",
            message: "Warning information updated successfully!",
          });
        } else {
          const newInfo = await addWarningInfo(this.editForm);
          this.warningInfoTableData.push(newInfo);
          ElMessage({
            type: "success",
            message: "Warning information added successfully!",
          });
        }
        this.dialogVisible = false;
      } catch (error) {
        ElMessage({
          type: "error",
          message: "Failed to save warning information.",
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
