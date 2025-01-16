<template>
  <div class="pest-data">
    <Title>
      <template #title> 害虫数据 </template>
    </Title>

    <!-- Table -->
    <div class="table-container">
      <table class="pest-table">
        <thead>
          <tr>
            <th>害虫种类</th>
            <th>数量</th>
            <th>生命周期阶段</th>
            <th>监测时间</th>
            <th>监测设备</th>
            <th>严重程度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedPestData" :key="index">
            <td>{{ item.species }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.lifeStage }}</td>
            <td>{{ item.monitoringTime }}</td>
            <td>{{ item.deviceId }}</td>
            <td>{{ item.severity }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        Prev
      </button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Next
      </button>
    </div>

    <!-- Filter Dialog -->
    <div v-if="filterDialogVisible" class="filter-dialog">
      <h3>筛选数据</h3>
      <form @submit.prevent="applyFilters">
        <label>害虫种类</label>
        <select v-model="filterForm.species">
          <option value="">选择害虫种类</option>
          <option value="玉米螟">玉米螟</option>
          <option value="蚜虫">蚜虫</option>
          <option value="红蜘蛛">红蜘蛛</option>
          <option value="小麦蚜虫">小麦蚜虫</option>
          <option value="稻飞虱">稻飞虱</option>
        </select>

        <label>生命周期阶段</label>
        <select v-model="filterForm.lifeStage">
          <option value="">选择生命周期阶段</option>
          <option value="卵">卵</option>
          <option value="幼虫">幼虫</option>
          <option value="成虫">成虫</option>
        </select>

        <label>严重程度</label>
        <select v-model="filterForm.severity">
          <option value="">选择严重程度</option>
          <option value="低">低</option>
          <option value="中">中</option>
          <option value="高">高</option>
        </select>

        <div class="dialog-footer">
          <button @click="resetFilters">重置</button>
          <button type="submit">应用筛选</button>
        </div>
      </form>
    </div>

    <!-- Filter Button -->
    <button @click="showFilterDialog">筛选数据</button>
  </div>
</template>

<script>
import Title from "@/components/device/Title.vue";
export default {
  name: "PestData",
  components: {
    Title,
  },
  data() {
    return {
      pestData: [
        {
          species: "玉米螟",
          quantity: 120,
          lifeStage: "幼虫",
          monitoringTime: "2024-12-20 10:00",
          deviceId: "Device001",
          severity: "中",
        },
        {
          species: "蚜虫",
          quantity: 300,
          lifeStage: "成虫",
          monitoringTime: "2024-12-19 09:30",
          deviceId: "Device002",
          severity: "高",
        },
        {
          species: "红蜘蛛",
          quantity: 50,
          lifeStage: "卵",
          monitoringTime: "2024-12-18 08:00",
          deviceId: "Device003",
          severity: "低",
        },
        // Add more pest data...
      ],
      currentPage: 1,
      pageSize: 10,
      filterForm: {
        species: "",
        lifeStage: "",
        severity: "",
      },
      filterDialogVisible: false,
      filteredPestData: [],
    };
  },
  created() {
    this.filteredPestData = this.pestData;
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredPestData.length / this.pageSize);
    },
    paginatedPestData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredPestData.slice(start, end);
    },
  },
  methods: {
    showFilterDialog() {
      this.filterDialogVisible = true;
    },
    applyFilters() {
      this.filteredPestData = this.pestData.filter((row) => {
        const matchesSpecies = this.filterForm.species
          ? row.species === this.filterForm.species
          : true;
        const matchesLifeStage = this.filterForm.lifeStage
          ? row.lifeStage === this.filterForm.lifeStage
          : true;
        const matchesSeverity = this.filterForm.severity
          ? row.severity === this.filterForm.severity
          : true;
        return matchesSpecies && matchesLifeStage && matchesSeverity;
      });
      this.filterDialogVisible = false;
    },
    resetFilters() {
      this.filterForm = { species: "", lifeStage: "", severity: "" };
      this.filteredPestData = this.pestData;
      this.filterDialogVisible = false;
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
.pest-data {
  padding: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.pest-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.pest-table th,
.pest-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.pest-table th {
  background-color: #f4f7fc;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  padding: 10px;
  margin: 0 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.filter-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  border-radius: 8px;
}

.filter-dialog form {
  display: flex;
  flex-direction: column;
}

.filter-dialog label {
  margin: 10px 0 5px;
}

.filter-dialog select {
  padding: 8px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.dialog-footer button {
  margin-left: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
}

.dialog-footer button:first-child {
  background-color: #6c757d;
}
</style>
