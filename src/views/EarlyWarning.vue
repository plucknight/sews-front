<template>
  <div class="warning-management">
    <!-- 预警规则设置 -->
    <div class="section">
      <Title>
        <template #title>预警分析</template>
      </Title>
      <h2>预警规则设置</h2>

      <!-- 新增预警规则按钮 -->
      <button class="add-rule-btn" @click="openRuleForm">新增规则</button>

      <!-- 弹出表单: 新增或编辑规则 -->
      <div
        v-if="isFormVisible"
        class="dialog-overlay"
        @click.self="closeRuleForm"
      >
        <div class="dialog-box">
          <h3>设置预警规则</h3>
          <form @submit.prevent="saveRule" class="rule-form">
            <div class="form-item">
              <label for="pestType">害虫种类</label>
              <input
                type="text"
                id="pestType"
                v-model="warningRule.pestType"
                placeholder="请输入害虫种类"
                required
              />
            </div>
            <div class="form-item">
              <label for="threshold">阈值</label>
              <input
                type="number"
                id="threshold"
                v-model="warningRule.threshold"
                min="1"
                required
              />
            </div>
            <div class="form-item">
              <label for="isActive">启用</label>
              <input
                type="checkbox"
                id="isActive"
                v-model="warningRule.isActive"
              />
            </div>
            <div class="form-buttons">
              <button type="submit">保存规则</button>
              <button type="button" @click="closeRuleForm">取消</button>
            </div>
          </form>
        </div>
      </div>

      <!-- 预警规则表格 -->
      <h3>已有规则</h3>
      <table>
        <thead>
          <tr>
            <th>害虫种类</th>
            <th>阈值</th>
            <th>启用</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rule, index) in warningRules" :key="index">
            <td>{{ rule.pestType }}</td>
            <td>{{ rule.threshold }}</td>
            <td>{{ rule.isActive ? "启用" : "禁用" }}</td>
            <td>
              <button class="edit-btn" @click="editRule(index)">编辑</button>
              <button class="delete-btn" @click="deleteRule(index)">
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 预警记录 -->
    <div class="section">
      <h2>预警记录</h2>
      <table>
        <thead>
          <tr>
            <th>害虫种类</th>
            <th>数量</th>
            <th>触发时间</th>
            <th>地点</th>
            <th>监测设备</th>
            <th>图片链接</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in warningRecords" :key="index">
            <td>{{ record.pestType }}</td>
            <td>{{ record.quantity }}</td>
            <td>{{ record.time }}</td>
            <td>{{ record.location }}</td>
            <td>{{ record.device }}</td>
            <td><a :href="record.imageUrl" target="_blank">查看图片</a></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 预警分析 -->
    <div class="section">
      <h2>预警分析</h2>
      <div class="chart-selection">
        <label>
          <input type="radio" v-model="chartType" value="饼图" name="chart" />
          饼图
        </label>
        <label>
          <input type="radio" v-model="chartType" value="柱状图" name="chart" />
          柱状图
        </label>
      </div>

      <!-- 示例图：饼图 -->
      <div v-if="chartType === '饼图'" class="chart">
        <div class="pie-chart">饼图示例（使用实际图表库生成）</div>
      </div>

      <!-- 示例图：柱状图 -->
      <div v-if="chartType === '柱状图'" class="chart">
        <div class="bar-chart">柱状图示例（使用实际图表库生成）</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import Title from "@/components/device/Title.vue";

export default {
  components: {
    Title,
  },
  setup() {
    // 预警规则
    const warningRules = ref([
      { pestType: "害虫A", threshold: 50, isActive: true },
      { pestType: "害虫B", threshold: 30, isActive: false },
    ]);

    // 预警规则表单数据
    const warningRule = ref({
      pestType: "",
      threshold: 0,
      isActive: false,
    });

    // 是否显示规则表单
    const isFormVisible = ref(false);

    // 打开规则表单（新增规则）
    const openRuleForm = () => {
      warningRule.value = { pestType: "", threshold: 0, isActive: false };
      isFormVisible.value = true;
    };

    // 关闭规则表单
    const closeRuleForm = () => {
      isFormVisible.value = false;
    };

    // 保存预警规则
    const saveRule = () => {
      if (!warningRule.value.pestType || !warningRule.value.threshold) {
        alert("请填写完整的预警规则");
        return;
      }

      // 判断是新增还是修改
      const existingRuleIndex = warningRules.value.findIndex(
        (rule) => rule.pestType === warningRule.value.pestType
      );

      if (existingRuleIndex !== -1) {
        // 修改已有规则
        warningRules.value[existingRuleIndex] = { ...warningRule.value };
      } else {
        // 新增规则
        warningRules.value.push({ ...warningRule.value });
      }

      closeRuleForm();
    };

    // 编辑预警规则
    const editRule = (index) => {
      warningRule.value = { ...warningRules.value[index] };
      isFormVisible.value = true;
    };

    // 删除预警规则
    const deleteRule = (index) => {
      warningRules.value.splice(index, 1);
    };

    // 预警记录数据
    const warningRecords = ref([
      {
        pestType: "害虫A",
        quantity: 50,
        time: "2024-12-20 08:30",
        location: "区域1",
        device: "设备A",
        imageUrl: "http://example.com/image1.png",
      },
      {
        pestType: "害虫B",
        quantity: 30,
        time: "2024-12-20 09:00",
        location: "区域2",
        device: "设备B",
        imageUrl: "http://example.com/image2.png",
      },
      {
        pestType: "害虫C",
        quantity: 20,
        time: "2024-12-21 10:00",
        location: "区域3",
        device: "设备C",
        imageUrl: "http://example.com/image3.png",
      },
      {
        pestType: "害虫D",
        quantity: 15,
        time: "2024-12-21 11:00",
        location: "区域4",
        device: "设备D",
        imageUrl: "http://example.com/image4.png",
      },
    ]);

    // 图表类型选择
    const chartType = ref("饼图");

    return {
      warningRules,
      warningRule,
      isFormVisible,
      openRuleForm,
      closeRuleForm,
      saveRule,
      editRule,
      deleteRule,
      warningRecords,
      chartType,
    };
  },
};
</script>

<style scoped>
/* 样式 */
.warning-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.add-rule-btn {
  background-color: #67c23a;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.add-rule-btn:hover {
  background-color: #85d64b;
}

/* 弹窗的遮罩层 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* 弹窗内容 */
.dialog-box {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  width: 400px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table th,
table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

table th {
  background-color: #f4f4f4;
}

.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.edit-btn {
  background-color: #409eff;
  color: white;
}

.delete-btn {
  background-color: #f56c6c;
  color: white;
}

.edit-btn:hover {
  background-color: #66b1ff;
}

.delete-btn:hover {
  background-color: #f79c42;
}
</style>
