<template>
<!-- 基础数据--设备及其他 -->
<div>
    <div class="subsubMenu">
        <el-tabs v-model="activeName" @tab-click="handleClick" >
        <el-tab-pane label="泵" name="first">
            <!-- <router-link to='/basicData/basicDataFacility/pump'></router-link> -->
            <pump></pump>
        </el-tab-pane>
        <el-tab-pane label="截断阀" name="second">
            <!-- 截断阀 -->
            <shutOffValve></shutOffValve>
        </el-tab-pane>
        <el-tab-pane label="止回阀" name="third">
            <!-- 止回阀 -->
            <checkValve></checkValve>
        </el-tab-pane>
        <el-tab-pane label="调节阀" name="fourth">
            <!-- 调节阀 -->
            <regulatingValve></regulatingValve>
        </el-tab-pane>
        <el-tab-pane label="弯头" name="fifth">
            <!-- 弯头 -->
            <bend></bend>
            </el-tab-pane>
  </el-tabs>
    </div>


</div>

</template>    
<script>
import bend from '@/components/basicData/basicDataFacility/bend.vue'
import checkValve from '@/components/basicData/basicDataFacility/checkValve.vue'
import pump from '@/components/basicData/basicDataFacility/pump.vue'
import regulatingValve from '@/components/basicData/basicDataFacility/regulatingValve.vue'
import shutOffValve from '@/components/basicData/basicDataFacility/shutOffValve.vue'

    export default {
        name:'basicDataFacility',
        components:{bend,pump,shutOffValve,checkValve,regulatingValve},
        data () {
            return { activeName: 'first'};
        },
         methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }// methods
    }//export default
</script>
<style  scoped>
.subsubMenu {
    padding-left: 15px;
    color: #909399;
}
</style>