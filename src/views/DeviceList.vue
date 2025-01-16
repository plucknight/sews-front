<template>
  <div id="devicelist">
    <Title>
      <template #title> 设备管理 </template>
    </Title>

    <!-- 设备管理 UI -->
    <div class="option">
      <label for="date-picker">创建时间</label>
      <input
        type="date"
        id="date-picker"
        v-model="selectedDate"
        class="input"
      />

      <label for="device-type">设备类型</label>
      <select v-model="model" id="device-type" class="input">
        <option
          v-for="item in deviceList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </option>
      </select>

      <label for="device-id">设备ID</label>
      <input
        type="text"
        id="device-id"
        placeholder="请输入设备ID"
        v-model="deviceID"
        class="input"
      />

      <div class="btn">
        <button @click="Getdevicelist" class="btn-search">查询</button>
        <button @click="add" class="btn-add">新增设备</button>
      </div>
    </div>

    <!-- 设备列表表格 -->
    <div class="view">
      <table>
        <thead>
          <tr>
            <th>设备ID</th>
            <th>设备名称</th>
            <th>设备用户</th>
            <th>设备添加时间</th>
            <th>设备类型</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in datas" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.employeeId }}</td>
            <td>{{ item.createTime }}</td>
            <td>{{ item.type }}</td>
            <td>
              <button @click="show(index)" class="btn-edit">修改</button>
              <button @click="remove(index)" class="btn-delete">删除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分页 -->
      <div class="pagination">
        <button
          @click="changePage(page.pageNo - 1)"
          :disabled="page.pageNo <= 1"
          class="btn-pagination"
        >
          上一页
        </button>
        <span>{{ page.pageNo }} / {{ totalPage }}</span>
        <button
          @click="changePage(page.pageNo + 1)"
          :disabled="page.pageNo >= totalPage"
          class="btn-pagination"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- 修改设备弹窗 -->
    <div v-if="modal" class="modal">
      <div class="modal-content">
        <h3>{{ title }}</h3>
        <input type="text" placeholder="设备名称：" v-model="change.name" />
        <input
          type="text"
          placeholder="设备负责人："
          v-model="change.employeeId"
        />
        <input type="text" placeholder="设备类型：" v-model="change.type" />
        <input
          type="text"
          placeholder="设备负责人联系方式："
          v-model="change.contact"
        />
        <input
          type="text"
          placeholder="安装位置（经纬度）："
          v-model="change.location"
        />
        <input type="text" placeholder="设备日志：" v-model="change.log" />
        <div class="modal-footer">
          <button @click="ok" class="btn-save">保存</button>
          <button @click="cancel" class="btn-cancel">取消</button>
        </div>
      </div>
    </div>

    <!-- 新增设备弹窗 -->
    <div v-if="modal1" class="modal">
      <div class="modal-content">
        <h3>新增设备</h3>
        <input type="text" placeholder="设备ID：" v-model="adddevice.id" />
        <input type="text" placeholder="设备名称：" v-model="adddevice.name" />
        <input
          type="text"
          placeholder="设备负责人："
          v-model="adddevice.employeeId"
        />
        <input
          type="text"
          placeholder="设备负责人联系方式："
          v-model="adddevice.contact"
        />
        <input type="text" placeholder="设备类型：" v-model="adddevice.type" />
        <input
          type="text"
          placeholder="安装位置（经纬度）："
          v-model="adddevice.location"
        />
        <textarea placeholder="设备日志：" v-model="adddevice.log"></textarea>
        <div class="modal-footer">
          <button @click="addok" class="btn-save">保存</button>
          <button @click="cancel" class="btn-cancel">取消</button>
        </div>
      </div>
    </div>

    <!-- 删除设备弹窗 -->
    <div v-if="modal2" class="modal">
      <div class="modal-content">
        <h3>{{ title1 }}</h3>
        <p style="color: red">此操作不可逆</p>
        <div class="modal-footer">
          <button @click="deleteok" class="btn-danger">确认删除</button>
          <button @click="cancel" class="btn-cancel">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/components/device/Title.vue";
import {
  getdevicelist,
  changedevice,
  adddevice,
  deletedevice,
} from "../api.js";

export default {
  name: "devicelist",
  components: {
    Title,
  },
  data() {
    return {
      modal: false,
      modal1: false,
      modal2: false,
      title: "",
      title1: "设备列表",
      deviceList: [
        { value: "测报灯", label: "测报灯" },
        { value: "杀虫灯", label: "杀虫灯" },
        { value: "监控", label: "监控" },
      ],
      model: "",
      datas: [],
      deviceID: "",
      page: { pageNo: 1, pageSize: 8 },
      total: "",
      totalPage: 1,
      change: { id: "", name: "", employeeId: "", type: "" },
      adddevice: {
        employeeId: "",
        id: "",
        name: "",
        type: "",
        createTime: new Date(),
        location: "",
      },
      deletedevice: { ids: "" },
    };
  },

  created() {
    // 添加20条示例数据
    this.datas = Array.from({ length: 20 }, (_, i) => ({
      id: `device-${i + 1}`,
      name: `设备名称-${i + 1}`,
      employeeId: `负责人-${i + 1}`,
      createTime: `2024-12-${(i % 30) + 1}`,
      type: i % 3 === 0 ? "测报灯" : i % 3 === 1 ? "杀虫灯" : "监控",
    }));
    this.total = this.datas.length;
    this.totalPage = Math.ceil(this.total / this.page.pageSize);
  },

  methods: {
    async Getdevicelist() {
      await getdevicelist("/device/page", {
        id: this.deviceID,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }).then((Response) => {
        this.total = Response.data.total;
        this.datas = Response.data.records;
        this.totalPage = Math.ceil(this.total / this.page.pageSize);
      });
    },

    add() {
      this.modal1 = true;
    },

    show(index) {
      this.modal = true;
      this.change = { ...this.datas[index] };
      this.title = "修改设备 " + this.change.id;
    },

    remove(index) {
      this.modal2 = true;
      this.deletedevice.ids = this.datas[index].id;
      this.title1 = "删除设备 " + this.datas[index].id;
    },

    ok() {
      changedevice("/device", this.change).then(() => {
        this.Getdevicelist();
      });
    },

    addok() {
      adddevice("/device", this.adddevice).then(() => {
        this.Getdevicelist();
      });
    },

    deleteok() {
      deletedevice("/device", this.deletedevice).then(() => {
        this.Getdevicelist();
      });
    },

    cancel() {
      this.modal = this.modal1 = this.modal2 = false;
    },

    changePage(pageNo) {
      if (pageNo < 1 || pageNo > this.totalPage) return;
      this.page.pageNo = pageNo;
      this.Getdevicelist();
    },
  },
};
</script>

<style scoped>
/* 页面基础样式 */
#devicelist {
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.358);
}

/* 设备管理选项 */
.option {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.option label {
  font-weight: bold;
  margin-right: 10px;
  width: 100px;
}

.input {
  padding: 8px;
  width: 220px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.btn {
  display: flex;
  gap: 10px;
}

.btn button {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.btn-search {
  background-color: #4caf50;
  color: white;
  border: none;
}

.btn-add {
  background-color: #2196f3;
  color: white;
  border: none;
}

/* 表格样式 */
.view table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

/* 按钮样式 */
.btn-edit,
.btn-delete {
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}

.btn-edit {
  background-color: #ff9800;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination .btn-pagination {
  padding: 10px 20px;
  border-radius: 4px;
  background-color: #2196f3;
  color: white;
  cursor: pointer;
}

.pagination .btn-pagination:disabled {
  background-color: #ccc;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(25, 171, 110, 0.611);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.modal-footer {
  margin-top: 20px;
  text-align: right;
}

.modal-footer button {
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-save {
  background-color: #4caf50;
  color: white;
  border: none;
}

.btn-cancel {
  background-color: #ccc;
  color: white;
  border: none;
}

.btn-danger {
  background-color: #f44336;
  color: white;
  border: none;
}
</style>
