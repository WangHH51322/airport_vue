<template>
<!-- 四、稳态计算 -->
<div>
    <el-container>
    <div class="headerBox">
        <!-- 标题 -->
        <span class="headerBoxLeft">
            稳态计算
        </span>
        <span class="headerBoxRight">
            <el-button  plain class="topButton">
                <router-link to="/steady/steadyBorder">边界条件</router-link>
            </el-button>
            <el-button  plain class="topButton">
                运行
            </el-button>
        </span>
    </div>
    </el-container>

<el-row>
    <el-col :span="18">
        <div class="contentLeft">
         <!-- 左边 -->
             <div class="centerBox">
               <router-view></router-view>
            </div>
            <footer class="footBox">
                进展
            </footer >
        </div>
    </el-col>
    <el-col :span="6">
        <div class="contentRight">
      <!-- 右边 设备信息 -->
      设备信息
        </div>
    </el-col>
</el-row>


</div>
</template>    
<script>

    export default {
        name:'steady',
        data () {
            return {};
        },
        components: {}
    }
</script>
<style  scoped>

</style>