<template>
  <div>
    <Title>
      <template #title> index </template>
    </Title>
    <button @click="openDialog" class="btn-add-rule">新增规则</button>

    <el-button type="text" @click="open">点击打开 Message Box</el-button>

    <div v-if="dialogVisible" class="dialog-overlay" @click.self="closeDialog">
      <div class="dialog-box">
        <h3>新增规则</h3>
        <form>
          <div class="form-item">
            <label for="pestType">害虫种类</label>
            <input
              v-model="form.pestType"
              type="text"
              id="pestType"
              placeholder="请输入害虫种类"
            />
          </div>

          <div class="form-item">
            <label for="threshold">阈值</label>
            <input
              v-model="form.threshold"
              type="number"
              id="threshold"
              placeholder="请输入阈值"
            />
          </div>

          <div class="form-item">
            <label for="enabled">启用</label>
            <input type="checkbox" v-model="form.enabled" id="enabled" />
            <span>{{ form.enabled ? "是" : "否" }}</span>
          </div>

          <div class="form-footer">
            <button type="button" @click="closeDialog">取消</button>
            <button type="button" @click="saveRule">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import Title from "@/components/device/Title.vue";
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus"; // 引入 Element Plus 相关组件
import "element-plus/dist/index.css"; // 引入 Element Plus 样式

const dialogVisible = ref(false); // 控制弹窗显示
const form = ref({
  pestType: "",
  threshold: 0,
  enabled: false,
});

// 打开弹窗
const openDialog = () => {
  dialogVisible.value = true;
};

// 关闭弹窗
const closeDialog = () => {
  dialogVisible.value = false;
};

// 保存规则
const saveRule = () => {
  // 校验输入
  if (!form.value.pestType || form.value.threshold <= 0) {
    ElMessage.error("请填写完整的规则！");
    return;
  }
  console.log("保存的规则:", form.value);
  closeDialog(); // 关闭弹窗
  ElMessage.success("规则已保存！");
};

// 打开消息框
const open = () => {
  dialogVisible.value = true;
  ElMessageBox.alert("这是一段内容", "标题名称", {
    confirmButtonText: "确定",
    callback: (action) => {
      ElMessage({
        type: "info",
        message: `action: ${action}`,
      });
    },
  });
};
</script>

<style scoped>
/* 按钮样式 */
.btn-add-rule {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
}

.btn-add-rule:hover {
  background-color: #0056b3;
}

/* 弹窗的遮罩层 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 弹窗盒子 */
.dialog-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.dialog-box h3 {
  margin-top: 0;
  font-size: 20px;
}

.form-item {
  margin-bottom: 15px;
  text-align: left;
}

.form-item label {
  display: block;
  margin-bottom: 5px;
}

.form-item input {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.form-footer {
  display: flex;
  justify-content: space-between;
}

.form-footer button {
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.form-footer button:hover {
  background-color: #0056b3;
}
</style>
