<template>
<!-- 五、瞬态计算 -->
<div>
    <el-container>
    <div class="headerBox">
        <!-- 标题 -->
        <span class="headerBoxLeft">
            瞬态计算
        </span>
        <span class="headerBoxRight">
            <el-button  plain class="topButton">
                <router-link to="/">边界条件</router-link>
            </el-button>
            <el-button  plain class="topButton">
                <router-link to="/">运行</router-link>
            </el-button>
        </span>
    </div>
    </el-container>

<el-row>
    <el-col :span="18">
        <div class="contentLeft">
         <!-- 左边 -->
             <div class="centerBox">
                内容
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
        name:'transient',
        data () {
            return {};
        }
    }
</script>
<style  scoped>

</style>