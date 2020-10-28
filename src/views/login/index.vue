<!--
  文件作者：mawenjuan
  创建日期：2020.6.16
  文件说明：登录页面
 -->
<template>
  <div id="login">
    <div class="login-con1 df">
      <div class="form-con">
        <div class="f24 b">登录</div>
        <el-input v-model="account" size="larger" placeholder="请输入账号名" prefix-icon="el-icon-user"></el-input>
        <el-input v-model="password" size="larger" placeholder="请输入密码" prefix-icon="el-icon-lock" show-password />
        <div class="wp100">
          <el-button type="success" size="larger" class="wp100" @click="handleSubmit">登录</el-button>
          <div class="f12 c6 mt10 tc pr">
            <div class="hand pa" style="right: 0px" @click="handleFind">忘记密码</div>
            <!-- <div class="hand success" @click="handleRedister">立即注册</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api'
export default {
  data() {
    return {
      account: '',
      phone: '',
      password: ''
    }
  },
  mounted() {
    // if (this.$cookie.getValue('access_token')) {
    //   this.$router.push('/index')
    // }
  },
  methods: {
    handleSubmit() {
      if (
        this.$fun.trim(this.account) === '' ||
        this.$fun.trim(this.password) === ''
      ) {
        this.$message.warning('请输入账号和密码')
        return
      }
      this.$store.dispatch('setLoading', true)
      login({
        account: this.account,
        password: this.password
      })
        .then(res => {
          if (res.code === 200) {
            if (res.data) {
              this.$cookie.setValue('access_token', res.data.tk)
              this.$cookie.setValue('userName', this.account)
              this.$store.dispatch('setUserInfo', {
                account: this.account
              })
              this.$store.dispatch('setLoginStatus', true)
              if (!res.data.email) {
                this.$router.push('/add-email-tips')
              } else {
                if (this.$route.query.redirect) {
                  this.$router.push(this.$route.query.redirect)
                } else {
                  this.$router.push('/index')
                }
              }
            }
          } else {
            this.$message.warning(res.message)
          }
          this.$store.dispatch('setLoading', false)
        })
        .catch(() => {
          this.$store.dispatch('setLoading', false)
        })
    },
    handleRedister() {
      this.$router.push('register')
    },
    handleFind() {
      this.$router.push('password-find')
    }
  }
}
</script>

<style lang="scss" scoped>
#login {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-image: url('../../assets/imgs/bg1.png');
  background-size: 100% auto;
}
</style>
