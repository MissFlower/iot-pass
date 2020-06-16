import router from "@/router";
import Cookie from "@/utils/cookie.js";

const whiteList = ["/index", "/login", "/register", "/password-find"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  const hasToken = Cookie.getValue("access_token");
  if (hasToken) {
    console.log(Cookie.getValue("emailStatus"));
    if (Cookie.getValue("emailStatus") * 1 === 0) {
      console.log("----------");
      next("/add-email-tips");
    } else {
      next();
    }
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
