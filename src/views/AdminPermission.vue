<template>
  <div>
    <Title>
      <template #title> Admin Permission Management </template>
    </Title>

    <!-- 添加查询框和查询按钮 -->
    <div class="search-container">
      <div class="left">
        <el-input
          v-model="searchQuery"
          placeholder="Enter username or email to search"
          style="width: 200px; margin-right: 10px"
        />
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </div>

      <div class="right">
        <el-button type="success" @click="handleAdd"
          >Add New Permission</el-button
        >
      </div>
    </div>

    <el-table
      :data="
        permissionTableData.slice(
          (currentPage - 1) * pagesize,
          currentPage * pagesize
        )
      "
      style="width: 98%"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column label="Username" prop="username"></el-table-column>
      <el-table-column label="Email" prop="email"></el-table-column>
      <el-table-column
        label="Permission Name"
        prop="permissionName"
      ></el-table-column>
      <el-table-column
        label="Permission Type"
        prop="permissionType"
      ></el-table-column>
      <el-table-column label="Description" prop="description"></el-table-column>
      <el-table-column label="Created At" prop="createdAt">
        <template #default="{ row }">
          {{ formatDate(row.dateTime) }}
        </template>
      </el-table-column>

      <el-table-column label="Operations">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">
            Edit
          </el-button>
          <el-popconfirm
            title="Are you sure you want to delete this permission?"
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
        :total="permissionTableData.length"
        size="small"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="Edit Permission Information"
      :visible.sync="dialogVisible"
      width="400px"
      @close="handleDialogClose"
    >
      <el-form :model="editForm">
        <el-form-item label="Username" prop="username">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="Permission Name" prop="permissionName">
          <el-input v-model="editForm.permissionName" />
        </el-form-item>
        <el-form-item label="Permission Type" prop="permissionType">
          <el-input v-model="editForm.permissionType" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="editForm.description" />
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
import Title from "@/components/device/Title.vue";
import {
  getAllPermissions,
  getPermissionById,
  updatePermission,
  addPermission,
  deletePermissionById,
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
      permissionTableData: [],
      currentPage: 1,
      pagesize: 10,
      dialogVisible: false,
      editForm: {
        id: "",
        username: "",
        email: "",
        permissionName: "",
        permissionType: "",
        description: "",
        dateTime: "",
      },
      searchQuery: "", // 用于存储查询框输入的内容
    };
  },
  mounted() {
    this.fetchAllPermissions();
  },
  methods: {
    formatDate,
    async fetchAllPermissions() {
      try {
        const response = await getAllPermissions();
        this.permissionTableData = response; // 假设 API 返回的是权限数据
      } catch (error) {
        console.error("Error fetching permissions:", error);
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
          return (this.permissionTableData = await getAllPermissions());
        }
        const response = await getPermissionById(this.searchQuery);
        if (response != null) {
          console.log("Searching for:", response);
          this.permissionTableData = [response];
        }
      } catch (error) {
        console.error(error);
      }
    },
    handleAdd() {
      this.editForm = {
        username: "",
        email: "",
        permissionName: "",
        permissionType: "",
        description: "",
        dateTime: new Date(),
      };
      this.dialogVisible = true;
    },

    handleEdit(row) {
      this.editForm = { ...row };
      this.dialogVisible = true;
    },

    handleDialogClose() {
      this.editForm = {
        id: "",
        username: "",
        email: "",
        permissionName: "",
        permissionType: "",
        description: "",
        dateTime: "",
      };
    },

    async handleSave() {
      try {
        if (this.editForm.id) {
          const response = await updatePermission(
            this.editForm.id,
            this.editForm
          );
          console.log("Updated permission", response);
          const index = this.permissionTableData.findIndex(
            (item) => item.id === this.editForm.id
          );
          if (index !== -1) {
            this.permissionTableData.splice(index, 1, { ...this.editForm });
          }
          ElMessage({
            type: "success",
            message: "Permission updated successfully!",
          });
        } else {
          const newPermission = await addPermission(this.editForm);
          this.permissionTableData.push(newPermission);
          ElMessage({
            type: "success",
            message: "Permission added successfully!",
          });
        }
        this.dialogVisible = false;
      } catch (error) {
        console.error("Error saving permission:", error);
        ElMessage({
          type: "error",
          message: "Failed to save permission.",
        });
      }
    },

    handleDelete(row) {
      ElMessageBox.confirm(
        "Are you sure you want to delete this permission?",
        "Warning",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          const index = this.permissionTableData.findIndex(
            (item) => item.id === row.id
          );
          if (index !== -1) {
            deletePermissionById(row.id);
            this.permissionTableData.splice(index, 1);
            ElMessage({
              type: "success",
              message: "Permission deleted successfully!",
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
