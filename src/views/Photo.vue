<template>
  <div class="pest-monitoring">
    <Title>
      <template #title> 害虫图片 </template>
    </Title>

    <!-- 页面整体布局 -->
    <div class="container">
      <!-- 上方筛选区域，横向排列 -->
      <div class="filter-section">
        <div class="select-group">
          <label for="device-select">选择设备</label>
          <select
            id="device-select"
            v-model="selectedDevice"
            @change="filterImages"
          >
            <option value="">选择设备</option>
            <option
              v-for="device in devices"
              :key="device.id"
              :value="device.id"
            >
              {{ device.name }}
            </option>
          </select>
        </div>

        <!-- 日期选择区域，放置在同一行 -->
        <div class="select-group date-range">
          <label for="date-picker">date</label>
          <input
            type="date"
            v-model="selectedDate[0]"
            @change="filterImages"
            class="date-picker"
          />
          <span>至</span>
          <input
            type="date"
            v-model="selectedDate[1]"
            @change="filterImages"
            class="date-picker"
          />
        </div>

        <div class="select-group">
          <label for="pest-select">选择害虫种类</label>
          <select
            id="pest-select"
            v-model="selectedPestType"
            @change="filterImages"
          >
            <option value="">选择害虫种类</option>
            <option v-for="type in pestTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
      </div>

      <!-- 下方图片展示区域 -->
      <div class="image-gallery">
        <div class="grid-container">
          <div
            v-for="image in paginatedImages"
            :key="image.id"
            class="image-item"
          >
            <div class="card">
              <img :src="image.src" class="image-thumbnail" />
              <div class="image-info">
                <p><strong>设备：</strong>{{ image.deviceName }}</p>
                <p><strong>日期：</strong>{{ image.date }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="filteredImages.length > 0" class="pagination">
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage <= 1"
          >
            上一页
          </button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage >= totalPages"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/components/device/Title.vue";
import axios from "axios";

export default {
  components: {
    Title,
  },
  data() {
    return {
      devices: [
        { id: 1, name: "设备1" },
        { id: 2, name: "设备2" },
        { id: 3, name: "设备3" },
      ],
      pestTypes: ["虫害", "病虫害", "害虫种类1", "害虫种类2"],
      imageUrls: [], // 存储从后端获取的预签名 URL
      selectedDevice: null,
      selectedDate: [null, null],
      selectedPestType: null,
      filteredImages: [], // 存储筛选后的图片
      currentPage: 1,
      pageSize: 24, // 每页显示的图片数量
      paginatedImages: [], // 当前页的图片
    };
  },
  created() {
    this.loadImages();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredImages.length / this.pageSize);
    },
  },
  methods: {
    // 从后端加载图片 URL
    loadImages() {
      axios
        .get("http://localhost:8080/api/minio/images") // 请求后端接口，获取图片 URL 列表
        .then((response) => {
          // 后端返回的 URL 数据
          this.imageUrls = response.data.map((url, index) => {
            return {
              id: index + 1,
              deviceName: `设备${(index % 3) + 1}`, // 根据需要设置设备名
              filename: url.split("/").pop(), // 从 URL 中提取文件名
              date: "2024-12-20", // 示例日期，您可以根据需求设置
              pestType: "虫害", // 示例害虫种类
              src: url, // 图片的预签名 URL
            };
          });
          this.filteredImages = this.imageUrls; // 初始时未筛选
          this.paginateImages();
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
        });
    },
    // 过滤图片，根据筛选条件
    filterImages() {
      this.filteredImages = this.imageUrls.filter((image) => {
        const isDeviceMatch =
          !this.selectedDevice || image.deviceName === this.selectedDevice;
        const isDateMatch =
          !this.selectedDate[0] ||
          (new Date(image.date) >= new Date(this.selectedDate[0]) &&
            new Date(image.date) <= new Date(this.selectedDate[1]));
        const isPestTypeMatch =
          !this.selectedPestType || image.pestType === this.selectedPestType;
        return isDeviceMatch && isDateMatch && isPestTypeMatch;
      });
      this.paginateImages();
    },
    // 分页
    paginateImages() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedImages = this.filteredImages.slice(startIndex, endIndex);
    },
    handlePageChange(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.paginateImages();
    },
  },
};
</script>

<style scoped>
.pest-monitoring {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f4f7fb;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-section {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 20px;
  justify-content: space-between;
  flex-wrap: wrap;
}

.select-group {
  margin-bottom: 0;
  flex: 1 1 30%;
}

label {
  font-weight: bold;
  color: #555;
  margin-bottom: 8px;
  font-size: 16px;
}

select,
input[type="date"] {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  background-color: #f9f9f9;
  color: #555;
}

select:focus,
input[type="date"]:focus {
  border-color: #66a2ff;
  background-color: #fff;
  outline: none;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.image-gallery {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(8, 1fr); /* 一行显示 8 张图片 */
  grid-template-rows: repeat(3, auto); /* 最多 3 行 */
  gap: 20px;
  width: 100%;
  margin-bottom: 20px;
}

.image-item {
  width: 100%;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.image-thumbnail {
  width: 100%;
  height: 100px; /* 固定高度 */
  object-fit: cover; /* 保持图片比例，裁剪多余部分 */
  border-bottom: 1px solid #ddd;
}

.image-info {
  padding: 10px;
  text-align: center;
  background-color: #fafafa;
  font-size: 14px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  border-radius: 8px;
  background-color: #2196f3;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
