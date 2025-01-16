<template>
  <div class="model-chooser">
    <Title>
      <template #title> 模型选择 </template>
    </Title>
    <h2>请选择模型</h2>
    <div class="model-selection-container">
      <table class="model-table">
        <thead>
          <tr>
            <th></th>
            <th>模型名称</th>
            <th>版本号</th>
            <th>描述</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="model in models" :key="model.id">
            <td>
              <el-radio
                v-model="selectedModel"
                :label="model.name"
                @change="updateEnabledModel(model)"
              >
                {{ model.name }}
              </el-radio>
            </td>
            <td>{{ model.name }}</td>
            <td>{{ model.version }}</td>
            <td>{{ model.description }}</td>
            <td>
              <button
                class="toggle-button"
                :class="{ active: model.enabled }"
                @click="toggleEnable(model)"
              >
                {{ model.enabled ? "停用" : "启用" }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="selection-info">
      <span>当前选择的模型: {{ selectedModel || "无" }}</span>
      <button class="confirm-button" @click="handleConfirm">确认选择</button>
      <button class="disable-all-button" @click="disableAllModels">
        全部停用
      </button>
    </div>
    <p>已启用模型: {{ enabledModel || "无" }}</p>
  </div>
</template>

<script>
import Title from "@/components/device/Title.vue";

export default {
  components: {
    Title,
  },
  data() {
    return {
      models: [
        {
          id: 1,
          name: "模型A",
          version: "v1.0",
          description: "这是一个示例模型A",
          enabled: false,
        },
        {
          id: 2,
          name: "模型B",
          version: "v2.0",
          description: "这是一个示例模型B",
          enabled: false,
        },
        {
          id: 3,
          name: "模型C",
          version: "v1.5",
          description: "这是一个示例模型C",
          enabled: false,
        },
        // 添加更多模型...
      ],
      selectedModel: "",
      enabledModel: null,
    };
  },
  methods: {
    handleConfirm() {
      console.log("确认选择的模型:", this.selectedModel);
      // 设置已启用模型为当前选择的模型
      const selectedModel = this.models.find(
        (m) => m.name === this.selectedModel
      );
      if (selectedModel) {
        this.enabledModel = selectedModel.name;
        selectedModel.enabled = true; // 确保模型被启用
      } else {
        this.enabledModel = null;
      }
      // 这里可以添加其他逻辑，如发送请求等
    },
    toggleEnable(model) {
      // 先禁用所有模型
      this.models.forEach((m) => (m.enabled = false));

      // 启用当前模型
      model.enabled = true;

      // 更新已启用模型
      this.enabledModel = model.name;

      // 更新选中的模型
      this.selectedModel = model.name;
    },
    updateEnabledModel(model) {
      // 如果选择了某个模型，则将其设置为启用状态
      if (this.selectedModel === model.name && !model.enabled) {
        this.toggleEnable(model);
      }
    },
    disableAllModels() {
      // 将所有模型的状态设置为停用
      this.models.forEach((m) => (m.enabled = false));
      this.enabledModel = null;
      this.selectedModel = "";
    },
  },
};
</script>

<style scoped>
.model-chooser {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.model-selection-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.model-table {
  width: 100%;
  border-collapse: collapse;
}

.model-table th,
.model-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.model-table th {
  background-color: #f2f2f2;
}

.toggle-button {
  padding: 5px 10px;
  background-color: #ccc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
}

.toggle-button.active {
  background-color: #007bff;
}

.toggle-button.active:hover {
  background-color: #0056b3;
}

.toggle-button:hover {
  background-color: #aaa;
}

.selection-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.confirm-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-button:hover {
  background-color: #0056b3;
}

.disable-all-button {
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.disable-all-button:hover {
  background-color: #c82333;
}

p {
  margin-top: 20px;
  font-size: 14px;
}
</style>
