// 入口配置文件 创建VUE实例
import App from './App'

import './plugins/element.js'
import router from './router'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import './assets/css/fonts/iconfont.css'
import './assets/css/common.css'


import VueResource from 'vue-resource'
Vue.use(VueResource)

//引入x2js
import x2js from 'x2js' //xml数据处理插件
Vue.prototype.$x2js = new x2js() //全局方法挂载

//引入mxgraph
import './style/mxgraph.css'
import './style/style.scss'

// //引入ramda
// import * as R from 'ramda'
// Vue.prototype.R = R

//引入axios
import axios from 'axios';
Vue.prototype.$axios = axios;

import {postRequest} from "./utils/api";
import {postKeyValueRequest} from "./utils/api";
import {putKeyValueRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {getRequest} from "./utils/api";

Vue.prototype.postRequest = postRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putKeyValueRequest = putKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;

Vue.config.productionTip = false

//封装sessionStorage
import ls from './utils/ls'
Vue.prototype.ls = ls;

//引入vuex
import store from './store'


window.ViserVue
    // Vue.use(Viser)
Vue.use(ViewUI)
    // Vue.use(echarts)
Vue.config.productionTip = false
    /* eslint-disable no-new */

//引入ELEMENT UI
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
