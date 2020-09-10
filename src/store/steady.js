/*************稳态计算界面和后台的数据交互************************* */
//接收后台传来的稳态计算结果，传给页面
//所以页面的数据修改都要先传给vuex再传回页面？？
//从模型建立页面接收，向后台传输管网的拓补结构，设备参数，边界条件，流体等
//mxgraph的数据可以直接放在vuex吗
/*************************************************************** */


// export const SEL_NODEINFO = 'SEL_NODEINFO'
// export const LAYER_INFO = 'LAYER_INFO'
const store = {
    namespaced: true,
    state: {
        // //图层数据
        // layerData: {
        //     id: null,
        //     name: null
        // },
        // // 节点数据
        // nodeData: {
        //     id: null,
        //     type: "",
        //     nodeNumber:null,
        //     source: [],
        //     target: [],
        //     //为设备绑定的参数
        //     parameters: {}
        // },

    },
    mutations: {
        // //图层信息
        // [LAYER_INFO](state, value = { layer }) {
        //     state.layerData = []
        //     state.layerData.id = value.layer.id
        //     if (value.layer.layerName != null) {
        //         state.layerData.name = value.layer.layerName
        //     }

        // },
        // // 选中节点信息
        // [SEL_NODEINFO](state, value = { nodeType, nodeId, source, target, parameters ,nodeNumber}) {
        //     state.nodeData.source = []
        //     state.nodeData.target = []
        //     state.nodeData.type=[]
        //     state.nodeData.id=[]
        //     state.nodeData.nodeNumber=[]
        //     state.nodeData.parameters =[]
        //     state.nodeData.type = value.nodeType
        //     state.nodeData.id = value.nodeId
        //     state.nodeData.nodeNumber = value.nodeNumber
        //     state.nodeData.parameters = value.parameters
        //         //console.log('parameters', state.nodeData.parameters)

        //     for (let i = 0; i < value.source.length; i++) {
        //         state.nodeData.source[i] = Object()
        //         state.nodeData.source[i].id = value.source[i].id
        //         state.nodeData.source[i].type = value.source[i].info.typeName

        //     }
        //     //console.log(state.nodeData.source)


        //     for (let i = 0; i < value.target.length; i++) {

        //         state.nodeData.target[i] = Object()
        //         state.nodeData.target[i].id = value.target[i].id
        //         state.nodeData.target[i].type = value.target[i].info.typeName

        //     }
        //     //console.log(state.nodeData.target)

        // },


    },
    actions: {

    }
}

export default store