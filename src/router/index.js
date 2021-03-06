import Vue from 'vue'
import VueRouter from 'vue-router'
import mainzy from '../views/mainzy'

//引入模式选择页面
import pageHeaderAndFooter from "../components/default/pageHeaderAndFooter";
import modelPage from "../components/modelSelect/modelPage";
import guiderModel from "../components/modelSelect/guiderModel";
import guideModelPage1 from "../components/guideModelPage/guideModelPage1";
import guideModelPage2 from "../components/guideModelPage/guideModelPage2";
import guideModelPage3 from "../components/guideModelPage/guideModelPage3";
import guideModelPage4 from "../components/guideModelPage/guideModelPage4";
import guideModelPage5 from "../components/guideModelPage/guideModelPage5";
import guideModelPage6 from "../components/guideModelPage/guideModelPage6";
import guideModelPage7 from "../components/guideModelPage/guideModelPage7";
import guideModelPage8 from "../components/guideModelPage/guideModelPage8";
import guideModelPage9 from "../components/guideModelPage/guideModelPage9";
import guideModelPage10 from "../components/guideModelPage/guideModelPage10";

//引入项目管理模块
import projectManagement from '../views/1projectManagement/projectManagement.vue'

// 引入基础数据模块
import basicDataUnit from "../views/2basicData/basicDataUnit";
import PhysicalQuantityUnit from "../views/2basicData/PhysicalQuantityUnit";
import basicData from '../views/2basicData/basicData.vue'
import basicData1 from '../views/2basicData/basicData1.vue'
import basicDataFluid from '../views/2basicData/basicDataFluid.vue'
import fluidList from '../views/2basicData/fluidList.vue'
import basicDataPipe from '../views/2basicData/basicDataPipe.vue'
import basicDataFacility from '../views/2basicData/basicDataFacility.vue'

// 设备模块
import pumpParams from '../components/basicData/basicDataFacility/pumpParams.vue'
import updata from '../components/basicData/basicData1/updata.vue'
import adddata from '../components/basicData/basicData1/adddata.vue'


// 引入模型检查模块
import validityCheck from '../views/3validityCheck/validityCheck.vue'

// 引入稳态计算模块
import steady from '../views/4steady/steady.vue'
import steadyBorder from '@/components/steady/steadyBorder.vue'

// 引入瞬态计算模块
import transient from '../views/5transient/transient.vue'

import iView from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS
Vue.use(iView);


import { Switch } from 'iview'
Vue.component('i-switch', Switch)
import ViewUI from 'view-design'
Vue.use(ViewUI)

// Vue.use(Router)
Vue.use(VueRouter)

const router = new VueRouter({
// export default new Router({
  routes: [
    {path: '/',component: () => import('@/views/login.vue'),meta: {title: '登录'}},
    {path:'/pageHeaderAndFooter',name: 'pageHeaderAndFooter',component:pageHeaderAndFooter,
      children: [
        {path:'',name:'modelPage',component:modelPage},
        {path:'/guiderModel',name:'guiderModel',component:guiderModel,
          children: [
            {path:'',name:'guideModelPage1',component:guideModelPage1},
            {path:'/guideModelPage1',name:'guideModelPage1',component:guideModelPage1},
            {path:'/guideModelPage2',name:'guideModelPage2',component:guideModelPage2},
            {path:'/guideModelPage3',name:'guideModelPage3',component:guideModelPage3},
            {path:'/guideModelPage4',name:'guideModelPage4',component:guideModelPage4},
            {path:'/guideModelPage5',name:'guideModelPage5',component:guideModelPage5},
            {path:'/guideModelPage6',name:'guideModelPage6',component:guideModelPage6},
            {path:'/guideModelPage7',name:'guideModelPage7',component:guideModelPage7},
            {path:'/guideModelPage8',name:'guideModelPage8',component:guideModelPage8},
            {path:'/guideModelPage9',name:'guideModelPage9',component:guideModelPage9},
            {path:'/guideModelPage10',name:'guideModelPage10',component:guideModelPage10},
          ]
        },
        {path: '/mainzy',component: mainzy,
          children: [
            {path: '',component: projectManagement,meta: {title: '项目管理'}},
            {path: 'basicData',component:basicData,meta: {title: '基础数据'},
              children:[
                {path: 'basicDataUnit',component:basicDataUnit,meta: {title: '基础数据-单位'}},
                {path: 'PhysicalQuantityUnit',component:PhysicalQuantityUnit,meta: {title: '基础数据-物理量单位配置'}},
                {path: 'fluidList',component:fluidList,meta: {title: '基础数据-流体'}},
                //{path: 'fluidList',component:basicDataFluid,meta: {title: '基础数据-流体'}},
                {path: 'basicDataPipe',component:basicDataPipe,meta: {title: '基础数据-管材'}},
                {path: 'updata',component:updata,meta: {title: '基础数据-更新'}},
                {path: 'adddata',component:adddata,meta: {title: '基础数据-添加'}},
                {path: 'pumpParams',component:pumpParams,meta: {title: '编辑器-泵'}},
                {path: 'basicDataFacility',component:basicDataFacility,meta: {title: '基础数据-设备及其它'},
                  children:[

                  ]},
              ]},
            {path: 'validityCheck',component: validityCheck,meta: {title: '模型检查'},
              children: [
                {path: 'basicData1',component:basicData1,meta: {title: '基础数据-管网结构'}},
              ]},
            {path: 'steady',component: steady,meta: {title: '稳态计算'},
              children:[
                {path:'steadyBorder',component: steadyBorder,meta: {title: '稳态计算-边界条件'}},
                //   {path:'steadyCalculation',component: steadyCalculation,meta:{title: '稳态计算-运行'}}

              ]
            },
            {path: 'transient',component: transient,meta: {title: '瞬态计算'}},
          ]
        },
      ]},

  ]
})
export default router
router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start()
  if (to.meta && to.meta.title)document.title = to.meta.title
  next()
})

router.afterEach((to, from) => {
  ViewUI.LoadingBar.finish()
})
