const collapse = {
  state: {
    opened: false
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
