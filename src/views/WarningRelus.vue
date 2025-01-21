<template>
  <div>
    <Title>
      <template #title> Warning Rules </template>
    </Title>

    <!-- 添加查询框和查询按钮 -->
    <div class="search-container">
      <div class="left">
        <el-input
          v-model="searchQuery"
          placeholder="Enter rule name to search"
          style="width: 200px; margin-right: 10px"
        />
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </div>
      <div class="right">
        <el-button type="success" @click="handleAdd">Add New</el-button>
      </div>
    </div>

    <el-table
      :data="
        warningRulesTableData.slice(
          (currentPage - 1) * pagesize,
          currentPage * pagesize
        )
      "
      style="width: 98%"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column label="ruleId" prop="ruleId"></el-table-column>
      <el-table-column label="ruleName" prop="ruleName"></el-table-column>
      <el-table-column label="deviceType" prop="deviceType"></el-table-column>
      <el-table-column
        label="warningLevel"
        prop="warningLevel"
      ></el-table-column>
      <el-table-column label="threshold" prop="threshold"></el-table-column>
      <el-table-column label="description" prop="description"></el-table-column>
      <el-table-column label="isActive" prop="isActive"></el-table-column>
      <el-table-column label="createTime" prop="createTime">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="Operations">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)"
            >Edit</el-button
          >
          <el-popconfirm
            title="Are you sure to delete this rule?"
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
        :total="warningRulesTableData.length"
        size="small"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="Edit Warning Rule"
      :visible.sync="dialogVisible"
      width="400px"
      @close="handleDialogClose"
    >
      <el-form :model="editForm">
        <el-form-item label="ruleName" prop="ruleName">
          <el-input v-model="editForm.ruleName" />
        </el-form-item>
        <el-form-item label="deviceType" prop="deviceType">
          <el-input v-model="editForm.deviceType" />
        </el-form-item>
        <el-form-item label="warningLevel" prop="warningLevel">
          <el-input v-model="editForm.warningLevel" />
        </el-form-item>
        <el-form-item label="threshold" prop="threshold">
          <el-input v-model="editForm.threshold" type="number" />
        </el-form-item>
        <el-form-item label="description" prop="description">
          <el-input v-model="editForm.description" />
        </el-form-item>
        <el-form-item label="isActive" prop="isActive">
          <el-switch v-model="editForm.isActive" />
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
  ElSwitch,
} from "element-plus";
import Title from "@/components/device/Title.vue"; // 假设 Title 是一个已定义的组件
import {
  getAllWarningRules,
  getWarningRuleById,
  updateWarningRule,
  addWarningRule,
  deleteWarningRuleById,
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
    ElSwitch,
    Title,
  },
  data() {
    return {
      warningRulesTableData: [],
      currentPage: 1,
      pagesize: 10,
      dialogVisible: false,
      editForm: {
        ruleId: "",
        ruleName: "",
        deviceType: "",
        warningLevel: "",
        threshold: 0,
        description: "",
        isActive: true,
        createTime: "",
        updateTime: "",
      },
      searchQuery: "",
    };
  },
  mounted() {
    this.fetchAllWarningRules();
  },
  methods: {
    formatDate,
    async fetchAllWarningRules() {
      try {
        const response = await getAllWarningRules();
        this.warningRulesTableData = response;
      } catch (error) {
        console.error("Error fetching warning rules:", error);
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
          return (this.warningRulesTableData = await getAllWarningRules());
        }
        const response = await getWarningRuleById(this.searchQuery);
        if (response != null) {
          this.warningRulesTableData = [response];
        }
      } catch (error) {
        console.error(error);
      }
    },
    handleAdd() {
      this.editForm = {
        ruleName: "",
        deviceType: "",
        warningLevel: "",
        threshold: 0,
        description: "",
        isActive: true,
        createTime: new Date(),
        updateTime: new Date(),
      };
      this.dialogVisible = true;
    },

    handleEdit(row) {
      this.editForm = { ...row };
      this.dialogVisible = true;
    },
    handleDialogClose() {
      this.editForm = {
        ruleId: "",
        ruleName: "",
        deviceType: "",
        warningLevel: "",
        threshold: 0,
        description: "",
        isActive: true,
        createTime: "",
        updateTime: "",
      };
    },
    async handleSave() {
      try {
        if (this.editForm.ruleId) {
          const response = await updateWarningRule(this.editForm);
          console.log("res", response);
          const index = this.warningRulesTableData.findIndex(
            (item) => item.ruleId === this.editForm.ruleId
          );
          if (index !== -1) {
            this.warningRulesTableData.splice(index, 1, { ...this.editForm });
          }
          ElMessage({
            type: "success",
            message: "Warning rule updated successfully!",
          });
        } else {
          const newRule = await addWarningRule(this.editForm);
          this.warningRulesTableData.push(newRule);
          ElMessage({
            type: "success",
            message: "Warning rule added successfully!",
          });
        }
        this.dialogVisible = false;
      } catch (error) {
        ElMessage({
          type: "error",
          message: "Failed to save rule.",
        });
      }
    },
    handleDelete(row) {
      ElMessageBox.confirm(
        "Are you sure you want to delete this warning rule?",
        "Warning",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(async () => {
          try {
            const response = await deleteWarningRuleById(row.ruleId);
            console.log("res", response);
            const index = this.warningRulesTableData.findIndex(
              (item) => item.ruleId === row.ruleId
            );
            if (index !== -1) {
              this.warningRulesTableData.splice(index, 1);
            }
            ElMessage({
              type: "success",
              message: "Warning rule deleted successfully!",
            });
          } catch (error) {
            ElMessage({
              type: "error",
              message: "Failed to delete rule.",
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
