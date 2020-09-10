export const PROJECT_INFO = 'PROJECT_INFO'
const store = {
    namespaced: true,
    state: {
        //项目名称
        projectName: "",
        //项目id
        projectId: ""

    },
    mutations: {
        // 刷新页面时，重新存入项目名称，项目id

        [PROJECT_INFO](state, value = { project }) {

            //console.log(value.project)
            state.projectName = value.project.name
            state.projectId = value.project.id
            //console.log("state",state.projectName, state.projectId)
        },
    },
    actions: {

    }

}

export default store
