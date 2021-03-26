const collapse = {
  state: {
    opened: true // 菜单栏是否打开
  },
  mutations: {
    SET_OPENED: (state, de) => {
      state.opened = de
    }
  },
  actions: {
    setOpened({ commit }, de) {
      commit('SET_OPENED', de)
    }
  }
}

export default collapse
