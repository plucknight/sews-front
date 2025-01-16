<template>
  <div id="imgshow">
    <div class="image">
      <Image
        width="200px"
        height="100px"
        src="https://zgf.scwhnk.com/AgriInfo/AgriImg/lampDb/SC510101/20230809/20230809030052ps.jpg"
      >
        <!-- <template #error>
                    <Icon type="ios-image-outline" size="24" color="#ccc" />
                </template> -->
      </Image>
    </div>
    <div class="content">
      <h5 class="time">
        <slot name="time"> </slot>
      </h5>
      <button>手动添加</button>
      <button>手动统计</button>
      <button>识别统计</button>
    </div>
  </div>
</template>

<script>
import { Image, Icon } from "view-ui-plus";
export default {
  components: {
    Image,
    Icon,
  },
};
</script>

<style lang="less" scoped>
#imgshow {
  text-align: center;
  z-index: 1;
  .content {
    color: skyblue;
    button {
      background-color: rgba(0, 0, 0, 0);
      border: none;
      cursor: pointer;
      margin: 0 0.3rem;
    }
  }
}
</style>
