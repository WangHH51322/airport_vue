<template>
<!-- stateParameter2 -->
<div>
    <span class="stateParameter-box ">
<el-row>
  <el-col :span="6">
    <div class="stateParameter-content bg-purple-light">
      建模阶段
      <div><i class="el-icon-check checkIcon "></i></div>
    </div>
    </el-col>
  <el-col :span="6"><div class="stateParameter-content bg-purple ">
      稳态计算
            <div><i class="el-icon-check checkIcon selectedIcon"></i></div>
            </div></el-col>
  <el-col :span="6"><div class="stateParameter-content bg-purple-light">
      条件瞬态
            <div><i class="el-icon-check checkIcon"></i></div>
      </div></el-col>
  <el-col :span="6"><div class="stateParameter-content bg-purple">
        <!-- 显示时间 -->
    <div class="timeBox">
        <myTime></myTime>
        <div class="timeText">Ready</div>
    </div>  

    </div></el-col>
</el-row>
    </span>
</div>
</template>
<script>
import myTime from '@/components/basic/myTime'
export default {
    name:'stateParameter2',
    components: {myTime},
    data() {
        return {
            }//return
        }//data
}//export default
</script>
<style scoped>


</style>