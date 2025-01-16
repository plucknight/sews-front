<template>
  <div id="temperatureview" v-for="(item, index) in data" :key="index">
    <div class="icon">
      <i class="iconfont">&#xe699;</i>
    </div>
    <div class="content">
      <h5>
        {{ item.content }}
      </h5>
      <h5>
        {{ item.value }}
      </h5>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data"],
};
</script>

<style lang="less" scoped>
#temperatureview {
  align-items: center;
  width: 100%;
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin-top: 2rem;
  .icon {
    width: 20%;
    background-color: rgba(135, 207, 235, 0.152);
    color: skyblue;
    border-radius: 50%;
    .iconfont {
      font-size: 30px;
    }
  }
  .content {
    width: 40%;
  }
}
</style>
