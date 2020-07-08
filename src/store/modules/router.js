import { asyncRoutes, constantRoutes } from '@/router'
// import routerObj from "@/router";
import { deepClone } from '@/utils/validate'
import { dealMenus } from "@/data/fun"

let functionArr = null

function filterFun(list) {
  // 处理路由
  // 不能影响路由要深克隆
  const asyncRoutes_ = deepClone(asyncRoutes)
  const codeArr = list.map(item => {
    return item.code
  })
  const asyncList = fun(asyncRoutes_, codeArr, list) // 递归处理路由
  return asyncList
}

function fun (routes, codeArr, list) {
  const routerArr = []
  for (let i = 0; i < routes.length; i++) {
    const item  = routes[i]
    if (item.meta && item.meta.code && codeArr.indexOf(item.meta.code) > -1) {
      const len = codeArr.indexOf(item.meta.code);
      item.meta.icon = list[len].icon
      item.meta.name = list[len].name
      list[len].path = item.path
      routerArr.push(item)
      if (!item.hidden && item.children && item.children.length > 0) {
        item.children = fun(item.children, codeArr, list)
      }
    } else if (item.meta && item.meta.code && functionArr.indexOf(item.meta.code) > -1) {
      item.hidden = true
      routerArr.push(item)
    }
  }
  return routerArr
}

const router = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTERS: (state, routes) => {
      state.addRoutes = routes
      if (routes.length > 0) {
        state.routes = routes.concat(constantRoutes)
      } else {
        state.routes = constantRoutes
      }
    }
  },
  actions: {
    setRouters ({ commit }, menus) {
      return new Promise((resolve) => {
        if (menus) {
          const {list, funArr} = dealMenus(menus);
          functionArr = funArr
          if (list.length > 0) {
            const asyncList = filterFun(list);
            commit('SET_ROUTERS', asyncList);
            resolve(asyncList);
          } else {
            commit('SET_ROUTERS', []);
            resolve()
          }
        } else {
          commit('SET_ROUTERS', []);
          resolve()
        }
      })
    }
  }
}

export default router
