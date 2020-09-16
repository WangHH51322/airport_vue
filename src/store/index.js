import Vue from 'vue';
import Vuex from 'vuex'
import graphInfo from './graphInfo'
import projectList from './projectList'
import steady from './steady'
import pageStatus from './pageStatus'
import guideModelPageChange from './guideModelPageChange'
import basicData from './basicData'
Vue.use(Vuex)

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production', // 在非生产环境下，使用严格模式
    modules: {
        //将graphInfo.js按模块导入
        graphInfo,
        //将稳态计算steady.js按模块导入
        steady,
        pageStatus,
        projectList,
        guideModelPageChange,
        basicData
    }
})
