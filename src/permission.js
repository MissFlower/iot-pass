import router from "@/router";
import Cookie from "@/utils/cookie.js";

const whiteList = ["/index", "/login", "/register", "/password-find"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  const hasToken = Cookie.getValue("access_token");
  if (hasToken) {
    // if (Cookie.getValue("emailStatus") * 1 === 0) {
    //   next("/add-email-tips");
    // } else {
    //   next();
    // }
    next();
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      // alert("未登录");
      next(`/login?redirect=${to.path}`);
    }
  }
});

router.afterEach(() => {
  // NProgress.done()
});
