<template>
  <div>
    <Title>
      <template #title> Test </template>
    </Title>
    <div>
      <el-table
        :data="
          modelTableData.slice(
            (currentPage - 1) * pagesize,
            currentPage * pagesize
          )
        "
        style="width: 100%"
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
        <el-table-column label="trainDate" prop="trainDate"></el-table-column>
        <el-table-column label="dataTime" prop="dataTime"></el-table-column>
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
        >
        </el-pagination>
      </div>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="Edit Model Information"
      :visible.sync="dialogVisible"
      width="50%"
      @close="handleDialogClose"
    >
      <el-form :model="editForm">
        <el-form-item label="modelId" prop="modelId">
          <el-input v-model="editForm.modelId" />
        </el-form-item>
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
        <el-form-item label="trainDate" prop="trainDate">
          <el-input v-model="editForm.trainDate" />
        </el-form-item>
        <el-form-item label="dataTime" prop="dataTime">
          <el-input v-model="editForm.dataTime" />
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
import { getAllModels } from "@/api/api"; // 引入封装好的请求方法

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
      pagesize: 5,
      dialogVisible: false,
      editForm: {
        modelId: "",
        modelName: "",
        modelType: "",
        modelVersion: "",
        modelFilePath: "",
        trainDate: "",
        dataTime: "",
      },
    };
  },
  mounted() {
    this.fetchgetAllModels();
  },
  methods: {
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
    handleEdit(row) {
      // 将表格行数据赋值给编辑表单
      this.editForm = { ...row };

      // 显示编辑对话框
      this.dialogVisible = true;
    },
    handleDialogClose() {
      this.editForm = {
        modelId: "",
        modelName: "",
        modelType: "",
        modelVersion: "",
        modelFilePath: "",
        trainDate: "",
        dataTime: "",
      };
    },
    handleSave() {
      // 在此进行保存操作，例如更新数据到后台
      const index = this.modelTableData.findIndex(
        (item) => item.modelId === this.editForm.modelId
      );
      if (index !== -1) {
        this.modelTableData.splice(index, 1, { ...this.editForm });
        ElMessage({
          type: "success",
          message: "Model edited successfully!",
        });
        this.dialogVisible = false;
      }
    },
    handleDelete(row) {
      // 使用 ElMessageBox.confirm 来弹出一个确认删除的对话框
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
          // 删除数据
          const index = this.modelTableData.findIndex(
            (item) => item.modelId === row.modelId
          );
          if (index !== -1) {
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
  margin-top: 20px; /* 你可以根据需要调整间距 */
}
</style>
