<template>
  <div id="success">
    <div class="con df ai_c">
      <div class="f24 mr20">
        <svg-icon icon-class="success"></svg-icon>
      </div>
      <div>
        <div v-if="flag == 1">
          <div class="f16 c3">修改成功，{{ userInfo.email }} 可作为您的辅助邮箱</div>
          <div class="f12 c9">
            该邮箱不能作为登录名使用，仅用于安全校验及必要时的紧急联系
          </div>
        </div>
        <div v-if="flag == 2">
          <div class="f16 c3">修改成功，您的手机号为 {{userInfo.phone}}</div>
          <div class="f12 c9">
            该手机号可作为安全验证的方式用于找回密码、修改手机等场景，但不能作为能录名使用
          </div>
        </div>
        <div v-if="flag == 3">
          <div class="f16 c3">修改成功，请牢记新的登录密码</div>
        </div>
        <div class="f12 hand" v-if="flag == 1 || flag == 2">返回 <span class="red" @click="back">首页</span></div>
        <div class="f12 hand" v-else><span class="red" @click="login">重新登录</span></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flag: 1
    };
  },
  computed: {
    userInfo () {
      return this.$store.state.app.userInfo
    }
  },
  mounted() {
    this.flag = this.$route.params.id;
  },
  methods: {
    back () {
      this.$route.push("/home");
    },
    login () {
      this.$cookie.removeValue("access_token");
      this.$cookie.removeValue("userName");
      this.$store.dispatch("setUserInfo", null);
      this.$store.dispatch("setLoginStatus", false);
      this.$cookie.removeValue("emailStatus");
      localStorage.removeItem("info")
      this.$router.push("/login")
    }
  }
};
</script>

<style lang="scss" scoped>
#success {
  position: relative;
  width: 100%;
  height: 100%;
  .con {
    margin: 30px auto;
    padding: 30px 20px;
    width: 990px;
    height: auto;
    border: 1px solid #e1e1ca;
    background: #edfed0;
    position: relative;
    zoom: 1;
    font-size: 12px;
    line-height: 22px;
  }
}
</style>
