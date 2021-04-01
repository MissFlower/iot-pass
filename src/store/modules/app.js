import router from '@/router'
import { getUserInfo } from '@/api'
import Cookie from '@/utils/cookie.js'
import { Message } from 'element-ui'
import { clearLoginInfo } from '@/data/fun'

const app = {
  state: {
    userInfo: null,
    loading: false,
    loginStatus: false,
    breadcrumdList: [{
      path: '/home',
      meta: {
        name: '首页'
      }
    }],
    menuLists: [], // 用户的菜单列表
    functionLists: [], // 系统功能权限的具体项
    functionArr: [], // 系统功能权限的code数组
    auths: [] // 角色编辑已选的角色
  },
  mutations: {
    SET_USER_INFO: (state, info) => {
      state.userInfo = info
    },
    SET_LOADING: (state, val) => {
      state.loading = val
    },
    SET_LOGIN_STATUS: (state, flag) => {
      state.loginStatus = flag
    },
    SET_BTEADCRUMB_LIST: (state, obj) => {
      const list = JSON.parse(JSON.stringify(state.breadcrumdList))
      const paths = list.map(item => item.path)
      const len = paths.indexOf(obj.path)
      if (len > 1) {
        list.splice(len, 1)
      }
      list.splice(1, 0, obj)
      state.breadcrumdList = list
    },
    RESET_BTEADCRUMB_LIST: (state, list) => {
      state.breadcrumdList = list
    },
    SET_MENU_LISTS: (state, list) => {
      state.menuLists = list
    },
    SET_FUNCTION_ARR: (state, arr) => {
      state.functionArr = arr
    },
    SET_FUNCTION_LISTS: (state, list) => {
      state.functionLists = list
    },
    SET_AUTHS: (state, auths) => {
      state.auths = auths
    }
  },
  actions: {
    setUserInfo({ commit }, info) {
      commit('SET_USER_INFO', info)
    },
    getUserInfo({ commit }) {
      commit('SET_LOADING', true)
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          if (res.code === 200) {
            // 邮箱的标志存放在cookie中， 0 未绑定提示， 1已绑定， 2 未绑定 不提示
            const emailStatus = Cookie.getValue('emailStatus')
            localStorage.setItem('info', JSON.stringify(res.data))
            commit('SET_USER_INFO', res.data)
            if (res.data.email) {
              Cookie.setValue('emailStatus', 1)
            } else if (!emailStatus) {
              // 登录 没有，状态为2不处理
              Cookie.setValue('emailStatus', 0)
              router.push('/add-email-tips')
            }
            commit('SET_LOADING', false)
            resolve(res.data.menus)
          } else {
            commit('SET_LOADING', false)
            Message.warning(res.message)
            localStorage.setItem('info', null)
            clearLoginInfo()
            router.push('/login')
            resolve()
          }
        }).catch(error => {
          commit('SET_LOADING', false)
          reject(error)
        })
      })
    },
    setLoading({ commit }, val) {
      commit('SET_LOADING', val)
    },
    setLoginStatus({ commit }, flag) {
      return new Promise(resolve => {
        commit('SET_LOGIN_STATUS', flag)
        resolve()
      })
    },
    setBreadcrumb({ commit }, obj) {
      return new Promise(resolve => {
        commit('SET_BTEADCRUMB_LIST', obj)
        resolve()
      })
    },
    resetBreadcrumb({ commit }, list) {
      return new Promise(resolve => {
        commit('RESET_BTEADCRUMB_LIST', list)
        resolve()
      })
    },
    setMenuLists({ commit }, list) {
      return new Promise(resolve => {
        commit('SET_MENU_LISTS', list)
        resolve()
      })
    },
    setFunctionArr({ commit }, arr) {
      return new Promise(resolve => {
        commit('SET_FUNCTION_ARR', arr)
        resolve()
      })
    },
    setFunctionLists({ commit }, list) {
      return new Promise(resolve => {
        commit('SET_FUNCTION_LISTS', list)
        resolve()
      })
    },
    setAuths({ commit }, auths) {
      return new Promise(resolve => {
        commit('SET_AUTHS', auths)
        resolve()
      })
    }
  }
}
export default app
