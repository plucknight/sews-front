<template>
  <div>
    <Title>
      <template #title> Test </template>
    </Title>

    <!-- 添加查询框和查询按钮 -->
    <div class="search-container">
      <!-- 左侧：查询框和查询按钮 -->
      <div class="left">
        <el-input
          v-model="searchQuery"
          placeholder="Enter model name to search"
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
        modelTableData.slice(
          (currentPage - 1) * pagesize,
          currentPage * pagesize
        )
      "
      style="width: 98%"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column label="modelId" prop="modelId"></el-table-column>
      <el-table-column label="modelName" prop="modelName"></el-table-column>
      <el-table-column label="modelType" prop="modelType"></el-table-column>
      <el-table-column
        label="modelVersion"
        prop="modelVersion"
      ></el-table-column>
      <el-table-column
        label="modelFilePath"
        prop="modelFilePath"
      ></el-table-column>

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
        :total="modelTableData.length"
        size="small"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="Edit Model Information"
      :visible.sync="dialogVisible"
      width="400px"
      @close="handleDialogClose"
    >
      <el-form :model="editForm">
        <el-form-item label="modelName" prop="modelName">
          <el-input v-model="editForm.modelName" />
        </el-form-item>
        <el-form-item label="modelType" prop="modelType">
          <el-input v-model="editForm.modelType" />
        </el-form-item>
        <el-form-item label="modelVersion" prop="modelVersion">
          <el-input v-model="editForm.modelVersion" />
        </el-form-item>
        <el-form-item label="modelFilePath" prop="modelFilePath">
          <el-input v-model="editForm.modelFilePath" />
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
} from "element-plus";
import Title from "@/components/device/Title.vue"; // 假设 Title 是一个已定义的组件
import {
  getAllModels,
  getModelById,
  updateModel,
  addModel,
  deleteModelById,
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
    Title,
  },
  data() {
    return {
      modelTableData: [],
      currentPage: 1,
      pagesize: 10,
      dialogVisible: false,
      editForm: {
        modelId: "",
        modelName: "",
        modelType: "",
        modelVersion: "",
        modelFilePath: "",
        dataTime: "",
      },
      searchQuery: "", // 用于存储查询框输入的内容
    };
  },
  mounted() {
    this.fetchgetAllModels();
  },
  methods: {
    formatDate,
    async fetchgetAllModels() {
      try {
        const response = await getAllModels();
        this.modelTableData = response; // 假设 API 返回的是用户数据
      } catch (error) {
        console.error("Error fetching getAllModels:", error);
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
          return (this.modelTableData = await getAllModels());
        }
        const response = await getModelById(this.searchQuery);
        if (response != null) {
          console.log("Searching for:", response);

          this.modelTableData = [response];
        }
      } catch (error) {
        // if (error.response.status === 404) {
        //   ElMessage({
        //     type: "error",
        //     message: "查找失败，请检查输入是否正确。",
        //   });
        // }
        console.error();
      }
    },
    handleAdd() {
      // 重置表单，准备新增
      this.editForm = {
        modelName: "",
        modelType: "",
        modelVersion: "",
        modelFilePath: "",
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
        modelId: "",
        modelName: "",
        modelType: "",
        modelVersion: "",
        modelFilePath: "",
        dataTime: "",
      };
    },
    async handleSave() {
      try {
        if (this.editForm.modelId) {
          // 如果 modelId 存在，则是更新操作
          const response = await updateModel(
            this.editForm.modelId,
            this.editForm
          );
          console.log("res", response);
          const index = this.modelTableData.findIndex(
            (item) => item.modelId === this.editForm.modelId
          );
          if (index !== -1) {
            this.modelTableData.splice(index, 1, { ...this.editForm });
          }
          ElMessage({
            type: "success",
            message: "Model updated successfully!",
          });
        } else {
          // 否则是新增操作
          const newModel = await addModel(this.editForm);
          console.log("newModel", newModel);
          this.modelTableData.push(newModel); // 将新添加的模型加入表格数据
          ElMessage({
            type: "success",
            message: "Model added successfully!",
          });
        }
        this.dialogVisible = false; // 关闭对话框
      } catch (error) {
        console.error("Error saving model:", error);
        ElMessage({
          type: "error",
          message: "Failed to save model.",
        });
      }
    },
    handleDelete(row) {
      ElMessageBox.confirm(
        "Are you sure you want to delete this model?",
        "Warning",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          const index = this.modelTableData.findIndex(
            (item) => item.modelId === row.modelId
          );
          if (index !== -1) {
            const response = deleteModelById(row.modelId);
            this.modelTableData.splice(index, 1); // 删除表格中的数据
            ElMessage({
              type: "success",
              message: "Model deleted successfully!",
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
