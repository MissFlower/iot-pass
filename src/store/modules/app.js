const app = {
  state: {
    userInfo: null,
    loading: false,
    loginStatus: false,
    breadcrumdList: [
      {
        name: "IOT平台",
        path: "/home"
      }
    ]
  },
  mutations: {
    SET_USER_INFO: (state, info) => {
      state.userInfo = info;
    },
    SET_LOADING: (state, val) => {
      state.loading = val;
    },
    SET_LOGIN_STATUS: (state, flag) => {
      state.loginStatus = flag;
    },
    SET_BTEADCRUMB_LIST: (state, list) => {
      state.breadcrumdList = list;
    }
  },
  actions: {
    setUserInfo({ commit }, info) {
      commit("SET_USER_INFO", info);
    },
    setLoading({ commit }, val) {
      commit("SET_LOADING", val);
    },
    setLoginStatus({ commit }, flag) {
      return new Promise(resolve => {
        commit("SET_LOGIN_STATUS", flag);
        resolve();
      });
    },
    setBreadcrumb({ commit }, list) {
      return new Promise(resolve => {
        commit("SET_BTEADCRUMB_LIST", list);
        resolve();
      });
    }
  }
};
export default app;
