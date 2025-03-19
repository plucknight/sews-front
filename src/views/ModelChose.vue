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
        <!-- 新增上传文件的按钮 -->
        <el-form-item label="上传文件">
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileChange"
            :before-upload="beforeUpload"
            ref="upload"
          >
            <el-button type="primary">点击上传文件</el-button>
            <span v-if="selectedFile" style="margin-left: 10px; color: #666">
              {{ selectedFile.name }}
            </span>
          </el-upload>
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
  ElUpload,
} from "element-plus";
import Title from "@/components/device/Title.vue"; // 假设 Title 是一个已定义的组件
import {
  getAllModels,
  getModelById,
  updateModel,
  addModel,
  deleteModelById,
  uploadOnnxModel,
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
      selectedFile: null,
      uploadUrl: "/minio/upload",
    };
  },
  mounted() {
    this.fetchgetAllModels();
  },
  methods: {
    handleFileChange(file) {
      this.selectedFile = file.raw;
    },
    handleUploadSuccess(response, file, fileList) {
      console.log("上传成功：", response);
      if (response && response.filePath) {
        // 将返回的文件路径赋值给 editForm 中的 modelFilePath 字段
        this.editForm.modelFilePath = response.filePath;
      }
    },
    // 上传前的校验（如需要校验文件类型、大小等，可在此添加逻辑）
    // 修改上传前的校验方法
    beforeUpload(file) {
      const isValidType = file.type === "application/octet-stream";
      const isValidSize = file.size / 1024 / 1024 < 20;

      if (!isValidType) {
        ElMessage.error("只能上传ONNX格式文件");
        return false;
      }
      if (!isValidSize) {
        ElMessage.error("文件大小不能超过20MB");
        return false;
      }

      // 手动上传需要返回false
      return false;
    },

    // 重置时清空文件
    handleDialogClose() {
      this.selectedFile = null;
      // 其他重置逻辑...
    },
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
        // 如果有文件需要上传
        if (this.selectedFile) {
          const formData = new FormData();
          formData.append("onnxFile", this.selectedFile);

          // 执行文件上传
          const uploadRes = await uploadOnnxModel(formData);
          if (uploadRes && uploadRes.filePath) {
            this.editForm.modelFilePath = uploadRes.filePath;
          }
        }

        // 保存模型数据
        if (this.editForm.modelId) {
          await updateModel(this.editForm.modelId, this.editForm);
          // 更新本地数据...
        } else {
          await addModel(this.editForm);
          // 添加新数据...
        }

        ElMessage.success(this.editForm.modelId ? "更新成功" : "添加成功");
        this.dialogVisible = false;
        this.selectedFile = null; // 清空已选文件
      } catch (error) {
        ElMessage.error("操作失败");
        console.error("Error:", error);
      }
    },
    // async handleSave() {
    //   try {
    //     if (this.editForm.modelId) {
    //       // 如果 modelId 存在，则是更新操作
    //       const response = await updateModel(
    //         this.editForm.modelId,
    //         this.editForm
    //       );
    //       console.log("res", response);
    //       const index = this.modelTableData.findIndex(
    //         (item) => item.modelId === this.editForm.modelId
    //       );
    //       if (index !== -1) {
    //         this.modelTableData.splice(index, 1, { ...this.editForm });
    //       }
    //       ElMessage({
    //         type: "success",
    //         message: "Model updated successfully!",
    //       });
    //     } else {
    //       // 否则是新增操作
    //       const newModel = await addModel(this.editForm);
    //       console.log("newModel", newModel);
    //       this.modelTableData.push(newModel); // 将新添加的模型加入表格数据
    //       ElMessage({
    //         type: "success",
    //         message: "Model added successfully!",
    //       });
    //     }
    //     this.dialogVisible = false; // 关闭对话框
    //   } catch (error) {
    //     console.error("Error saving model:", error);
    //     ElMessage({
    //       type: "error",
    //       message: "Failed to save model.",
    //     });
    //   }
    // },
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
