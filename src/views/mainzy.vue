<template>
<div class='allContainer'>
<el-container>
    <el-aside width="200px">
    <myMenu>
    </myMenu>  
    </el-aside>
    <div class="containBox">
      <!-- 路由 -->
    <router-view></router-view>
    </div>
</el-container>
</div>
</template>
<script>
// 通用组件
import myMenu from '@/components/basic/myMenu.vue'
    export default {
        name:'mainzy',
        components: {myMenu},
        data () {
            return {
            };
        }
    }
</script>
<style scoped>
</style>
<style>
/* 全局 */
.allContainer {
  border: 1px solid #DCDFE6;
  width:100vw
}
/* 侧边栏 */
.asiseMenu {
  background-color: #F5F7FA;
  height: 100vh;
}
/* 右边 */
.containBox {
  border-left: 1px solid #DCDFE6;
  width: calc(100vw - 200px);
}
/* 顶部盒子 */
.headerBox {
  background-color: 	#F5F7FA;
  border-bottom: 1px solid #DCDFE6;
  width: 100vw;
  height: 70px;
}
/* 顶部左边 */
.headerBoxLeft {
  display:inline-flex;
  width: 200px;
  height: 70px;
  border-right: 1px solid #DCDFE6;
  font-size: 30px;
  padding: 14px 36px;
  text-align: center;
}
/* 顶部右边 */
.headerBoxRight {
  text-align: center;
}
.content{
  
}
.topButton {
  text-align: center;
  font-size: 20px;
  width: 140px;
  height: 40px;
  margin-left: 30px;
}


/* 中心盒子左边的中间 */
.centerBox {
  height: 500px;
  border-bottom: 1px solid #DCDFE6;

}
/* 中心盒子左边的下面 */
.footBox {
  height: calc(100vh - 570px);
}
/* 中心盒子的左边 */
.contentLeft {
  height: 100vh;
  border-right: 1px solid #DCDFE6;

}
/* 面包屑顶部 */
.breadcrumbTitle{
    padding: 10px;
    font-size: 14px;
}

</style>