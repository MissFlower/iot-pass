<template>
  <header id="header">
    <img class="logo" src="../assets/logo.png" />
    <div class="flex1 ml10">
      IOT管理系统
    </div>
    <div class="f12 mr20 text hand" v-if="!flag" @click="handleGoHome">
      控制台
    </div>
    <el-dropdown class="avatar-container" trigger="click" v-if="loginStatus">
      <div class="avatar-wrapper df ai_c">
        <span>{{ userName }}</span>
        <i class="el-icon-caret-bottom c2" />
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link to="/">
          <el-dropdown-item>
            Home
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">Log Out</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span
      v-if="!flag && !loginStatus"
      class="f12 hand blue"
      @click="handleLogin"
    >
      登录
    </span>
  </header>
</template>

<script>
import { delBreadCrumbFun } from "@/data/fun";
import { getUserInfo } from "@/api";
export default {
  data() {
    return {
      flag: false // 是否在登录页面
    };
  },
  computed: {
    userName() {
      return this.$store.state.app.userInfo
        ? this.$store.state.app.userInfo.userName
        : null;
    },
    loginStatus() {
      return this.$store.state.app.loginStatus;
    },
    breadcrumdList() {
      return this.$store.state.app.breadcrumdList;
    }
  },
  watch: {
    $route() {
      this.flag = this.$route.path === "/login" ? true : false;
      this.pathChange();
      this.showEmailTips();
    },
    loginStatus() {
      if (this.loginStatus) {
        this.getUserInfoFun();
      }
    }
  },
  mounted() {
    this.flag = this.$route.path === "/login" ? true : false;
    this.pathChange();
    if (this.loginStatus) {
      this.getUserInfoFun();
    }
    this.showEmailTips();
  },
  methods: {
    pathChange() {
      delBreadCrumbFun(1);
      let list = JSON.parse(JSON.stringify(this.breadcrumdList));
      const paths = this.$route.matched;
      paths.forEach(item => {
        list.push({
          name: item.meta.name,
          path: item.path
        });
      });
      this.$store.dispatch("setBreadcrumb", list);
    },
    logout() {
      this.$cookie.removeValue("access_token");
      this.$cookie.removeValue("userName");
      this.$store.dispatch("setUserInfo", null);
      this.$store.dispatch("setLoginStatus", false);
      this.$cookie.removeValue("emailStatus");
      let path = "/index";
      if (this.$route.path !== path) {
        path = `${path}?redirect=${this.$route.path}`;
      }
      this.$router.push(path);
    },
    handleLogin() {
      // let url = "/login"
      // if (this.$route.query.redirect) {
      //   url = `${url}?redirect`
      // }
      this.$router.push("/login");
    },
    handleGoHome() {
      if (this.loginStatus) {
        this.$router.push("/home");
      } else {
        // this.handleLogin();
        this.$router.push("/login??redirect=/home");
      }
    },
    getUserInfoFun() {
      this.$store.dispatch("setLoading", true);
      getUserInfo().then(res => {
        if (res.code === 200) {
          // 邮箱的标志存放在cookie中， 0 未绑定提示， 1已绑定， 2 未绑定 不提示
          const emailStatus = this.$cookie.getValue("emailStatus");
          this.$cookie.setValue("info", JSON.stringify(res.data));
          if (res.data.email) {
            this.$cookie.setValue("emailStatus", 1);
          } else if (!emailStatus) {
            // 登录 没有，状态为2不处理
            this.$cookie.setValue("emailStatus", 0);
            // this.$router.push("/add-email-tips");
          }
        }
        this.$store.dispatch("setLoading", false);
      });
    },
    showEmailTips() {
      // if (
      //   this.$cookie.getValue("emailStatus") * 1 === 0 &&
      //   this.$route.path !== "/index"
      // ) {
      //   this.$router.push("/add-email-tips");
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
#header {
  position: fixed;
  height: 60px;
  width: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) !important;
  line-height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 1;
  background: #fff;
  .text:hover {
    color: #1890ff;
  }
  .logo {
    width: 40px;
    height: 40px;
  }
  .avatar-container {
    // margin-right: 30px;
    .avatar-wrapper {
      // margin-top: 5px;
      min-width: 100px;
      position: relative;
      border: none;
      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      // .el-icon-caret-bottom {
      //   cursor: pointer;
      //   position: absolute;
      //   right: -20px;
      //   top: 25px;
      //   font-size: 12px;
      // }
    }
  }
}
</style>
