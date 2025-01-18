<!-- <template>
  <div id="dataview">
    <div class="item" v-for="(item, index) in data" :key="index">
      <div class="icon">
        <span class="iconfont">&#xe88c;</span>
      </div>
      <div class="content">
        <h5>{{ item.content }}</h5>
        <h5>{{ item.value }}</h5>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data"],
};
</script>

<style lang="less" scoped>
#dataview {
  display: flex;
  justify-content: space-around;
  .item {
    width: 10%;
    background-color: rgb(177, 177, 30);
    border-radius: 10px;
    text-align: center;
    display: flex;
    .icon {
      padding: 0.5rem 0.5rem;
      .iconfont {
        font-size: 26px;
      }
    }
    .content {
      display: block;
      padding: 0.5rem 0.5rem;
    }
  }
}

@media screen and (max-width: 720px) {
  #dataview {
    margin-top: 2rem;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .item {
      width: 18%;
      .icon {
        padding-right: 0.1rem;
        .iconfont {
          font-size: calc(100vw * 60 / 1920);
        }
      }
      .content {
        font-size: calc(100vw * 60 / 1920);
        display: block;
        padding: 0.5rem 0.1rem;
      }
    }
  }
}
</style> -->
