let constant = 1;
const store = {
  namespaced: true,
  state: {
    currentPage:{
      active: 0,
      pageNumber: '/guideModelPage'+ String(constant),
    }
  },
  mutations: {
    nextPage(state) {
      //变更状态
      constant ++ ;
      state.currentPage.active ++ ;
      state.currentPage.pageNumber = '/guideModelPage' + String(constant);
    },
    beforePage(state) {
      //变更状态
      state.currentPage.active -- ;
      state.currentPage.pageNumber = '/guideModelPage' + String(constant);
    }
  },
  actions: {

  },
}

export default store
