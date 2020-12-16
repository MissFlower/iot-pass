
import router from '@/router'
import Cookie from '@/utils/cookie.js'
import store from '@/store'
import { Message } from 'element-ui'

const whiteList = ['/index', '/login', '/register', '/password-find', '/verify', '/success'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  store.dispatch('setLoading', true)
  const hasToken = Cookie.getValue('access_token')
  if (hasToken) {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      const hasGetUserInfo = store.getters.addRoutes.length > 0
      if (hasGetUserInfo) {
        const meta = JSON.parse(JSON.stringify(to.meta))
        if (to.query.id) {
          meta.name += `（ ${to.query.id} ）`
        } else if (to.params.key) {
          meta.name += `（ ${to.params.key} ）`
        }
        store.dispatch('setBreadcrumb', {
          path: to.fullPath,
          meta: meta
        })
        next()
      } else {
        // 没有获取权限菜单的情况下
        try {
          const list = await store.dispatch('getUserInfo')
          const asyncList = await store.dispatch('setRouters', list)
          if (asyncList) {
            router.addRoutes(asyncList)
            next({ ...to, replace: true })
          } else {
            Message.warning('账号没有菜单权限，请联系管理员')
            next('/index')
          }
        } catch (error) {
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  // NProgress.done()
  store.dispatch('setLoading', false)
})
