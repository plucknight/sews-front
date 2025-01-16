<template>
  <div>
    <!-- 悬浮标题 -->
    <div class="floating-header">
      <h1>{{ title }}</h1>
    </div>

    <!-- 悬浮状态栏 -->
    <div class="floating-status" v-if="status">
      <p>{{ status }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Float",
  props: {
    title: {
      type: String,
      default: "作物靶标害虫自动监测预警系统",
    },
    status: {
      type: String,
      default: "状态未知",
    },
  },
};
</script>

<style scoped>
/* 悬浮标题 */
.floating-header {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  z-index: 999;
  font-size: 24px;
  font-weight: bold;
  border-radius: 5px;
}

/* 悬浮状态栏 */
.floating-status {
  position: fixed;
  top: 60px; /* 距离顶部60px */
  right: 10px;
  background-color: rgba(0, 255, 0, 0.7);
  color: white;
  padding: 10px 20px;
  z-index: 999;
  border-radius: 5px;
  font-size: 16px;
}
</style>
