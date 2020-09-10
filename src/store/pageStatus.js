const store = {
  namespaced: true,
  state: {
    pageStatus: true,
  },
  mutations: {
    changeStatus(state) {
      //变更状态
      state.pageStatus = false
    }
  },
  actions: {

  }
}

export default store
