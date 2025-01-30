<template>
  <div>
    <Title>
      <template #title> Admin Management </template>
    </Title>

    <!-- 添加查询框和查询按钮 -->
    <div class="search-container">
      <!-- 左侧：查询框和查询按钮 -->
      <div class="left">
        <el-input
          v-model="searchQuery"
          placeholder="Enter username or email to search"
          style="width: 200px; margin-right: 10px"
        />
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </div>

      <!-- 右侧：新增按钮 -->
      <div class="right">
        <el-button type="success" @click="handleAdd">Add New Admin</el-button>
      </div>
    </div>

    <el-table
      :data="
        adminTableData.slice(
          (currentPage - 1) * pagesize,
          currentPage * pagesize
        )
      "
      style="width: 98%"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="Username" prop="username"></el-table-column>
      <el-table-column label="Role" prop="role">
        <template #default="{ row }">
          {{ row.role === 1 ? "SuperAdmin" : "Admin" }}
        </template>
      </el-table-column>
      <el-table-column label="Email" prop="email"></el-table-column>
      <el-table-column label="Phone" prop="phone"></el-table-column>
      <el-table-column label="Created At" prop="createdAt">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="Updated At" prop="updatedAt">
        <template #default="{ row }">
          {{ formatDate(row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column label="Operations">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">
            Edit
          </el-button>
          <el-popconfirm
            title="Are you sure you want to delete this admin?"
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
        :total="adminTableData.length"
        size="small"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="Edit Admin Information"
      :visible.sync="dialogVisible"
      width="400px"
      @close="handleDialogClose"
    >
      <el-form :model="editForm">
        <el-form-item label="Username" prop="username">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="editForm.password" type="password" />
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-radio-group v-model="editForm.role">
            <el-radio :label="1">SuperAdmin</el-radio>
            <el-radio :label="2">Admin</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="editForm.phone" />
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
  ElRadioGroup,
  ElRadio,
} from "element-plus";
import Title from "@/components/device/Title.vue"; // 假设 Title 是一个已定义的组件
import {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  addAdmin,
  deleteAdminById,
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
    ElRadioGroup,
    ElRadio,
    Title,
  },
  data() {
    return {
      adminTableData: [],
      currentPage: 1,
      pagesize: 10,
      dialogVisible: false,
      editForm: {
        id: "",
        username: "",
        password: "",
        role: 1,
        email: "",
        phone: "",
        createdAt: "",
        updatedAt: "",
      },
      searchQuery: "", // 用于存储查询框输入的内容
    };
  },
  mounted() {
    this.fetchAllAdmins();
  },
  methods: {
    formatDate,
    async fetchAllAdmins() {
      try {
        const response = await getAllAdmins();
        this.adminTableData = response; // 假设 API 返回的是管理员数据
      } catch (error) {
        console.error("Error fetching admins:", error);
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
          return (this.adminTableData = await getAllAdmins());
        }
        const response = await getAdminById(this.searchQuery);
        if (response != null) {
          console.log("Searching for:", response);
          this.adminTableData = [response];
        }
      } catch (error) {
        console.error(error);
      }
    },
    handleAdd() {
      // 重置表单，准备新增
      this.editForm = {
        username: "",
        password: "",
        role: 1,
        email: "",
        phone: "",
        createdAt: new Date(),
        updatedAt: new Date(),
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
        id: "",
        username: "",
        password: "",
        role: 1,
        email: "",
        phone: "",
        createdAt: "",
        updatedAt: "",
      };
    },
    async handleSave() {
      try {
        if (this.editForm.id) {
          // 如果 id 存在，则是更新操作
          const response = await updateAdmin(this.editForm.id, this.editForm);
          console.log("Updated admin", response);
          const index = this.adminTableData.findIndex(
            (item) => item.id === this.editForm.id
          );
          if (index !== -1) {
            this.adminTableData.splice(index, 1, { ...this.editForm });
          }
          ElMessage({
            type: "success",
            message: "Admin updated successfully!",
          });
        } else {
          // 否则是新增操作
          const newAdmin = await addAdmin(this.editForm);
          console.log("newAdmin", newAdmin);
          this.adminTableData.push(newAdmin); // 将新添加的管理员加入表格数据
          ElMessage({
            type: "success",
            message: "Admin added successfully!",
          });
        }
        this.dialogVisible = false; // 关闭对话框
      } catch (error) {
        console.error("Error saving admin:", error);
        ElMessage({
          type: "error",
          message: "Failed to save admin.",
        });
      }
    },
    handleDelete(row) {
      ElMessageBox.confirm(
        "Are you sure you want to delete this admin?",
        "Warning",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          const index = this.adminTableData.findIndex(
            (item) => item.id === row.id
          );
          if (index !== -1) {
            deleteAdminById(row.id);
            this.adminTableData.splice(index, 1); // 删除表格中的数据
            ElMessage({
              type: "success",
              message: "Admin deleted successfully!",
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
