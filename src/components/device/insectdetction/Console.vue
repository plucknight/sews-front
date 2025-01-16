<template>
  <div id="option">
    <div class="select">
      <Space>
        工作模式
        <Select v-model="model" style="width: 200px">
          <Option
            v-for="item in cityList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </Space>

      <Space>
        定时模式
        <Select v-model="model" style="width: 200px">
          <Option
            v-for="item in cityList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </Space>

      <Space>
        开始结束时间：
        <Select v-model="model" style="width: 80px">
          <Option
            v-for="item in cityList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
        至
        <Select v-model="model" style="width: 80px">
          <Option
            v-for="item in cityList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </Space>
    </div>

    <div class="slider">
      <div class="slideritem">
        落虫时间：
        <Space>
          <Slider v-model="value1" :marks="marks"></Slider>
        </Space>
      </div>
      <div class="slideritem">
        加热时间：
        <Space>
          <Slider v-model="value2" :marks="marks"></Slider>
        </Space>
      </div>
      <div class="slideritem">
        加热温度：
        <Space>
          <Slider v-model="value3" :marks="marks"></Slider>
        </Space>
      </div>
      <div class="slideritem">
        高温保护阈值：
        <Space>
          <Slider v-model="value4" :marks="marks"></Slider>
        </Space>
      </div>
      <div class="slideritem">
        低温保护阈值：
        <Space>
          <Slider v-model="value5" :marks="marks"></Slider>
        </Space>
      </div>
      <div class="slideritem">
        数据上传间隔：
        <Space>
          <Slider v-model="value6" :marks="marks"></Slider>
        </Space>
      </div>
    </div>

    <div class="flexmodel">
      <button class="sure">确定</button>
      <button class="cancel">取消</button>
    </div>
  </div>
</template>

<script>
import { Space, Select, Option, Slider } from "view-ui-plus";
export default {
  components: {
    Space,
    Select,
    Option,
    Slider,
  },
  data() {
    return {
      value1: 25,
      value2: 25,
      value3: 25,
      value4: 25,
      value5: 0,
      value6: 25,
      marks: {
        0: "0",
        100: "100",
      },
    };
  },
};
</script>

<style lang="less" scoped>
#option {
  .select {
    .ivu-space {
      display: flex;
      margin-top: 0.6rem;
    }
  }

  .slider {
    .slideritem {
      display: flex;
      justify-content: space-between;
      text-align: right;
      align-items: center;

      .ivu-space {
        width: 70%;
        display: block !important;
        // padding-top: .5rem;
        padding: 0.25rem 0.5rem;
      }
    }
  }

  .flexmodel {
    margin: 0.3rem 0;
    width: 100%;
    text-align: center;

    button {
      margin: 0 1rem;
      padding: 0.4rem 0.7rem;
      color: white;
      cursor: pointer;
      border-radius: 10px;
    }

    .sure {
      background-color: rgba(135, 207, 235, 0.542);
      border: none;
    }

    .cancel {
      background-color: rgba(128, 128, 128, 0.558);
      border: none;
    }
  }
}

@media screen and (max-width: 720px) {
  .flexmodel {
    margin: 2rem 0;
    font-size: calc(100vw * 90 / 1920);
  }
}
</style>

<style lang="less"></style>
