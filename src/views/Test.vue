<template>
  <div>
    <Title>
      <template #title> Test </template>
    </Title>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="Name" width="100" />
      <el-table-column prop="state" label="State" width="100" />
      <el-table-column prop="city" label="City" width="100" />
      <el-table-column prop="address" label="Address" width="100" />
      <el-table-column prop="zip" label="Zip" width="100" />
    </el-table>
  </div>
</template>

<script setup>
import Title from "@/components/device/Title.vue";
import { ElTable, ElTableColumn } from "element-plus"; // 引入 Element Plus 相关组件
import "element-plus/dist/index.css"; // 引入 Element Plus 样式
const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-08",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-06",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-07",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
];
</script>
