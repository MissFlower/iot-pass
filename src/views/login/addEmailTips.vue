<template>
  <div id="addEmail">
    <div class="con">
      <div class="f20">
        <i class="el-icon-warning blue"></i>
        <span>
          您的帐号未绑定电子邮箱，请绑定一个电子邮箱，以方便您完成以下操作
        </span>
      </div>
      <div class="text f12 c6 lh20">
        <div class="mt30">
          1. 接收云服务开通、到期、故障及关停等操作通知；
        </div>
        <div>
          2. 重要信息操作例如更改、找回帐号密码、释放ECS等云产品高危操作时用作身份验证;
        </div>
        <div class="tc mt30">
          <el-button type="primary" @click="handleGo">立即绑定</el-button>
          <el-button type="primary" class="ml20" @click="handleNext"
            >下次再说
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleGo() {
      this.$router.push("/verify");
    },
    handleNext() {
      this.$cookie.setValue("emailStatus", 2);
      this.$router.push("/home");
    }
  }
};
</script>

<style lang="scss" scoped>
#addEmail {
  position: relative;
  width: 100%;
  height: 100%;
  .con {
    width: 700px;
    margin: 80px auto 0;
    .text {
      padding-left: 30px;
    }
  }
}
</style>
