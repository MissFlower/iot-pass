<template>
  <div class="header">
    <div class="con">
      <img class="logo hand" src="../../assets/logo.png" @click.stop="gotoIndex" />
      <div class="flex1 ml10 hand">
        <span @click.stop="gotoIndex">IoT管理系统</span>
      </div>
      <div class="f12 mr20">文档</div>
      <div class="f12 mr20 text hand" v-if="!flag" @click="handleGoHome">控制台</div>
      <el-dropdown class="avatar-container" trigger="hover" v-if="loginStatus">
        <div class="avatar-wrapper df ai_c">
          <img src="../../assets/imgs/photo.png" class="user-avatar" @click.stop="handleGoUserCenter">
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <div class="df ai_c p10">
            <img src="../../assets/imgs/photo.png" class="user-avatar mr10">
            <span>{{ userName }}</span>
          </div>
          <div class="drop-link df ai_c f12 c6">
            <div
              class="drop-link-item hand"
              v-for="(item, index) in dropArr"
              :key="index"
              @click.stop="handleGoPath(item)"
            >{{ item.name }}</div>
          </div>
          <el-dropdown-item divided class="tc">
            <span style="display:block;" @click="logoutFun">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span v-if="!flag && !loginStatus" class="f12 hand success mr20" @click="handleLogin">登录</span>
      <!-- <span v-if="!flag && !loginStatus" class="f12 hand blue" @click="handleRegister">注册</span> -->
      <!-- <el-button v-if="!flag && !loginStatus" type="success" size="mini" @click="handleRegister">注册</el-button> -->
    </div>
  </div>
</template>

<script>
import { clearLoginInfo } from '@/data/fun'
import { logout } from '@/api'
// import { resetRouter } from "@/router"
export default {
  data() {
    return {
      flag: false, // 是否在登录页面
      dropArr: [
        {
          name: '基本资料',
          path: '/center/basicInfo'
        },
        {
          name: '实名认证',
          path: '/center/authc'
        },
        {
          name: '安全设置',
          path: '/center/secure'
        }
      ]
    }
  },
  computed: {
    userName() {
      return this.$store.state.app.userInfo
        ? this.$store.state.app.userInfo.account
        : null
    },
    userInfo() {
      return this.$store.state.app.userInfo
    },
    loginStatus() {
      return this.$store.state.app.loginStatus
    }
  },
  watch: {
    $route() {
      this.flag = this.$route.path === '/login'
      // this.pathChange()
      this.showEmailTips()
    },
    loginStatus() {
      if (this.loginStatus) {
        this.$store.dispatch('getUserInfo')
      }
    }
  },
  mounted() {
    this.flag = this.$route.path === '/login'
    // this.pathChange()
    this.showEmailTips()
  },
  methods: {
    // pathChange() {
    //   // delBreadCrumbFun(1)
    //   const list = JSON.parse(JSON.stringify(this.breadcrumdList))
    //   const paths = this.$route.matched
    //   paths.forEach(item => {
    //     list.push({
    //       name: item.meta.name,
    //       path: item.path
    //     })
    //   })
    //   this.$store.dispatch('setBreadcrumb', list)
    // },
    logoutFun() {
      if (this.userInfo && this.userInfo.id) {
        this.$store.dispatch('setLoading', true)
        logout({
          userId: this.userInfo.id
        }).then(res => {
          clearLoginInfo()
          if (res.code === 200) {
            let path = '/index'
            if (this.$route.path !== path) {
              path = `${path}?redirect=${this.$route.path}`
            }
            this.$router.push(path)
          } else {
            this.$router.push('/index')
            // this.$message.error(res.message)
          }
          this.$store.dispatch('setLoading', false)
        }).catch(() => {
          this.$message.warning('退出失败')
          this.$store.dispatch('setLoading', false)
        })
      } else {
        clearLoginInfo()
        this.$router.push('/index')
      }
    },
    handleLogin() {
      this.$router.push('/login')
    },
    handleRegister() {
      this.$router.push('/register')
    },
    handleGoHome() {
      if (this.loginStatus) {
        this.$router.push('/home')
      } else {
        // this.handleLogin();
        this.$router.push('/login??redirect=/home')
      }
    },
    showEmailTips() {
      const path = this.$route.path
      const status = this.$cookie.getValue('emailStatus') * 1
      if (status === 0) {
        const pathArr = ['/index', '/verify']
        // 未绑定，显示提示
        if (pathArr.indexOf(path) === -1) {
          this.$router.push('/add-email-tips')
        }
      } else if (path === '/add-email-tips') {
        this.$router.push('/home')
      }
    },
    gotoIndex() {
      this.$router.push('/index')
    },
    handleGoPath(item) {
      if (!item.path) {
        this.$message.warning('功能正在开发中。。。')
      } else {
        this.$router.push(item.path)
      }
    },
    handleGoUserCenter() {
      this.$router.push('/center')
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  width: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) !important;
  line-height: 60px;
  z-index: 1;
  background: #fff;
  padding: 0 20px;
  .con {
    // max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
  }
  .text:hover {
    color: #1890ff;
  }
  .logo {
    // width: 40px;
    height: 30px;
  }
  .avatar-container {
    // margin-right: 30px;
    .avatar-wrapper {
      // margin-top: 5px;
      // min-width: 100px;
      position: relative;
      border: none;
      .user-avatar {
        cursor: pointer;
        width: 40px !important;
        height: 40px !important;
      }
      // .el-icon-caret-bottom {
      //   cursor: pointer;
      //   margin-left: 5px;
      // }
    }
  }
}
.user-dropdown {
  width: 300px;
  .user-avatar {
    cursor: pointer;
    width: 40px !important;
    height: 40px !important;
  }
  .drop-link {
    margin-bottom: 10px;
    .drop-link-item {
      flex: 1;
      text-align: center;
      padding: 2px 5px;
    }
    .drop-link-item + .drop-link-item {
      border-left: 1px solid #ddd;
    }
  }
}
</style>
