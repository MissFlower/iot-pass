<!-- 
  文件作者：mawenjuan
  创建日期：2020.6.16
  文件说明：登录页面
 -->
<template>
  <div id="login">
    <div class="login-con df">
      <div class="showImg"></div>
      <div class="form-con">
        <div class="f24 b">登录</div>
        <el-input v-model="account" placeholder="请输出账户名"></el-input>
        <el-input v-model="password" placeholder="请输出密码" show-password />
        <div class="wp100">
          <el-button type="primary" class="wp100" @click="handleSubmit"
            >登录
          </el-button>
          <div class="df f12 c6 jc_sb mt10">
            <div class="hand" @click="handleFind">忘记密码</div>
            <div class="hand" @click="handleRedister">注册</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "@/api";
export default {
  data() {
    return {
      account: "",
      phone: "",
      password: ""
    };
  },
  mounted() {
    if (this.$cookie.getValue("access_token")) {
      this.$router.push("/index");
    }
  },
  methods: {
    handleSubmit() {
      if (
        this.$fun.trim(this.account) === "" ||
        this.$fun.trim(this.password) === ""
      ) {
        this.$message.warning("请输入账号和密码");
        return;
      }
      this.$store.dispatch("setLoading", true);
      login({
        account: this.account,
        password: this.password
      })
        .then(res => {
          if (res.code === 200) {
            if (res.data) {
              this.$cookie.setValue("access_token", res.data.tk);
              this.$cookie.setValue("userName", this.account);
              this.$store.dispatch("setUserInfo", {
                account: this.account
              });
              this.$store.dispatch("setLoginStatus", true);
              if (!res.data.email) {
                this.$router.push("/add-email-tips");
              } else {
                if (this.$route.query.redirect) {
                  this.$router.push(this.$route.query.redirect);
                } else {
                  this.$router.push("/index");
                }
              }
            }
          } else {
            this.$message.warning(res.message);
          }
          this.$store.dispatch("setLoading", false);
        })
        .catch(() => {
          this.$store.dispatch("setLoading", false);
        });
    },
    handleRedister() {
      this.$router.push("register");
    },
    handleFind() {
      this.$router.push("password-find");
    }
  }
};
</script>

<style lang="scss" scoped>
#login {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  // margin: 100px auto;
  .login-con {
    width: 800px;
    margin: 100px auto;
    .showImg {
      width: 380px;
      height: 380px;
      background-image: url("../../assets/imgs/timg.jpeg");
      background-position: center;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .form-con {
      width: 400px;
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
    }
  }
}
</style>
