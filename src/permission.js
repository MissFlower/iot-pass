import router from "@/router";
import Cookie from "@/utils/cookie.js";
import store from '@/store'

const whiteList = ["/index", "/login", "/register", "/password-find", "/verify"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  const hasToken = Cookie.getValue("access_token");
  if (hasToken) {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      const hasGetUserInfo = store.getters.addRoutes.length > 0
      if (hasGetUserInfo) {
        next();
      } else {
        // 没有获取权限菜单的情况下
        try {
          const list = await store.dispatch("getUserInfo")
          const asyncList = await store.dispatch("setRouters", list)
          if (asyncList) {
            router.addRoutes(asyncList)
            next({ ...to, replace: true })
          }
        } catch (error) {
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
  }
});

router.afterEach(() => {
  // NProgress.done()
});
