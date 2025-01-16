<!-- <template>
  <div class="all">
    <h1 id="name">虫情监测预警系统</h1>
    <div id="userreigster">
      <div id="title">注册</div>
      <div class="input">
        <label for="username" class="prompt"><span>*</span>请输入用户名</label
        ><br />
        <input type="text" id="username" />
      </div>
      <div class="input">
        <label for="phone" class="prompt"><span>*</span>请输入手机号</label
        ><br />
        <input type="tel" id="phone" />
      </div>
      <div class="input">
        <label for="password" class="prompt"><span>*</span>设置密码</label
        ><br />
        <input type="password" id="password" />
      </div>
      <div class="input">
        <label for="password" class="prompt"><span>*</span>确认密码</label
        ><br />
        <input type="password" id="password" />
      </div>
      <van-button type="primary" id="loginbtn">注册</van-button>
      <p id="register">
        <router-link to="" @click="send">登录</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "userregister",
  emits: ["comname"],
  data() {
    return {
      comname: "UserLogin",
    };
  },
  methods: {
    send() {
      this.$emit("comname", this.comname);
    },
  },
};
</script>

<style lang="less" scoped>
.all {
  #name {
    text-align: center;
    color: rgb(0, 94, 255);
    font-family: stliti;
    margin-bottom: 1rem;
    font-size: calc(100vw * 60 / 1920);
  }
  #userreigster {
    width: 80%;
    background-color: white;
    padding: 3rem 3rem 0 3rem;
    border-radius: 5px;
    #title {
      padding-left: 1rem;
      font-size: calc(100vw * 30 / 1920);
      border-left: 0.3rem skyblue solid;
      margin-bottom: 2rem;
      font-weight: bolder;
    }
    .input {
      font-size: calc(100vw * 20 / 1920);
      margin-bottom: 1rem;
      input {
        width: 100%;
        border: 1px solid skyblue;
        margin-top: 0.5rem;
        height: 1.5rem;
      }
      span {
        color: red;
      }
    }
    #loginbtn {
      width: 100%;
      margin-top: 2rem;
      background: linear-gradient(to right, skyblue, blue);
      border: none;
    }
    #register {
      font-size: calc(100vw * 18 / 1920);
      text-align: right;
      padding: 2rem 0;
    }
  }
}
@media screen and (max-width: 720px) {
  .all {
    #name {
      width: 100%;
      margin-bottom: 1rem;
      font-size: calc(100vw * 100 / 1920) !important;
    }
    #userreigster {
      width: 80%;
      padding: 1rem;
    }
    .input {
      input {
        height: 1rem !important;
      }
    }
    #loginbtn {
      margin-top: 0.6rem !important;
    }
    #register {
      // font-size: calc(100vw * 18 / 1920);
      text-align: right;
      padding: 0.8rem 0 !important;
    }
  }
}
</style> -->
