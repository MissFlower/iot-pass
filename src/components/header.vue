<template>
  <header id="header">
    <img class="logo hand" src="../assets/logo.png" @click="gotoIndex" />
    <div class="flex1 ml10 hand" @click="gotoIndex">
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
import { delBreadCrumbFun, dealUserTreeFun } from "@/data/fun";
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
      getUserInfo()
        .then(res => {
          if (res.code === 200) {
            // 邮箱的标志存放在cookie中， 0 未绑定提示， 1已绑定， 2 未绑定 不提示
            const emailStatus = this.$cookie.getValue("emailStatus");
            this.$cookie.setValue("info", JSON.stringify(res.data));
            if (res.data.email) {
              this.$cookie.setValue("emailStatus", 1);
            } else if (!emailStatus) {
              // 登录 没有，状态为2不处理
              this.$cookie.setValue("emailStatus", 0);
              this.$router.push("/add-email-tips");
            }
            if (res.data.menus) {
              // this.$store.dispatch("setMenuLists", res.data.menus);
              this.dealMenus(res.data.menus);
            } else {
              this.$store.dispatch("setMenuLists", JSON.stringify([]));
              this.$message.warning("用户没有权限，请联系管理员");
              if (this.$route.path !== "/index") {
                this.$router.push("/index");
              }
            }
          }
          this.$store.dispatch("setLoading", false);
        })
        .catch(() => {
          this.$message.warning("用户信息获取失败");
          // this.$cookie.setValue("emailStatus", 0); // test
          this.$store.dispatch("setLoading", false);
        });
    },
    showEmailTips() {
      const path = this.$route.path;
      const status = this.$cookie.getValue("emailStatus") * 1;
      if (status === 0) {
        const pathArr = ["/index", "/verify"];
        // 未绑定，显示提示
        if (pathArr.indexOf(path) === -1) {
          this.$router.push("/add-email-tips");
        }
      } else if (path === "/add-email-tips" || path === "/verify") {
        this.$router.push("/home");
      }
    },
    dealMenus(menus) {
      const list = [];
      const funArr = [];
      const funList = [];
      if (menus.length > 0) {
        menus.forEach(item => {
          if (item.menuFlag === "Y") {
            item.path = item.frontPath ? item.frontPath : "/";
            list.push(item);
          } else {
            funArr.push(item.code);
            funList.push(item);
          }
        });
      }
      let list_ = dealUserTreeFun(list);
      this.$store.dispatch("setMenuLists", list_);
      this.$store.dispatch("setFunctionArr", funArr);
      this.$store.dispatch("setFunctionLists", funList);
    },
    gotoIndex() {
      this.$router.push("/index")
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
  z-index: 2;
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
