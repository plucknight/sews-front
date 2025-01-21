<template>
  <div>
    <Title>
      <template #title> 监控照片 </template>
    </Title>

    <!-- 添加查询框和查询按钮 -->
    <div class="search-container">
      <div class="left">
        <el-input
          v-model="searchQuery"
          placeholder="请输入害虫类型或照片ID进行搜索"
          style="width: 200px; margin-right: 10px"
        />
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </div>
    </div>

    <el-table
      :data="
        monitoringPhotosTableData.slice(
          (currentPage - 1) * pagesize,
          currentPage * pagesize
        )
      "
      style="width: 98%"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column label="photoId" prop="photoId"></el-table-column>
      <el-table-column label="deviceId" prop="deviceId"></el-table-column>
      <el-table-column label="photoDate" prop="photoDate">
        <template #default="{ row }">
          {{ formatDate(row.photoDate) }}
        </template>
      </el-table-column>
      <el-table-column label="pestCount" prop="pestCount"></el-table-column>
      <el-table-column label="pestType" prop="pestType"></el-table-column>

      <!-- 图片预览列 -->
      <el-table-column label="图片预览">
        <template #default="{ row }">
          <div class="image-preview-container">
            <el-image
              class="image-preview"
              style="
                width: 100%;
                height: 100%;
                max-width: 80px;
                max-height: 80px;
              "
              :src="row.photoPath"
              fit="contain"
            />
            <el-link :href="row.photoPath" target="_blank">查看照片</el-link>
          </div>
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
        :total="monitoringPhotosTableData.length"
        size="small"
      />
    </div>
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
  ElLink,
  ElImage, // 引入 el-image 组件
} from "element-plus";
import Title from "@/components/device/Title.vue"; // 假设 Title 是一个已定义的组件
import { getAllMonitoringPhotos, getMonitoringPhotoById } from "@/api/api"; // 引入封装好的请求方法
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
    ElLink,
    ElImage, // 添加 el-image 组件
    Title,
  },
  data() {
    return {
      monitoringPhotosTableData: [],
      currentPage: 1,
      pagesize: 10,
      dialogVisible: false,
      editForm: {
        photoId: "",
        deviceId: "",
        photoDate: "",
        pestCount: "",
        pestType: "",
        photoPath: "",
        dataTime: "",
      },
      searchQuery: "",
    };
  },
  mounted() {
    this.fetchAllMonitoringPhotos();
  },
  methods: {
    formatDate,
    async fetchAllMonitoringPhotos() {
      try {
        const response = await getAllMonitoringPhotos();
        this.monitoringPhotosTableData = response;
      } catch (error) {
        console.error("获取监控照片失败:", error);
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
          return (this.monitoringPhotosTableData =
            await getAllMonitoringPhotos());
        }
        const response = await getMonitoringPhotoById(this.searchQuery);
        if (response != null) {
          this.monitoringPhotosTableData = response;
        }
      } catch (error) {
        console.error(error);
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

/* 新增样式，用于居中显示图片和查看链接 */
.image-preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.image-preview {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 10px;
}
</style>
