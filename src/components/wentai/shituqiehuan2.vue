<template>
<div>
    <span class="shitu-box bgcolor1">
        <el-button type="text" @click="dialogPingmianVisible = true">
        平面视图
        </el-button>
    </span>
    <span class="shitu-box bgcolor2" >
    <!-- 图表视图 -->
        <el-button type="text" @click="dialogTableVisible = true">
        图表视图
        </el-button>
        <el-dialog title="表格视图" :visible.sync="dialogTableVisible">
            <el-table :data="gridData">
            <el-table-column property="num" label="设备/管段编号" width="250"></el-table-column>
            <el-table-column property="result" label="计算结果" width="500"></el-table-column>
            </el-table>
        </el-dialog>
    </span>
</div>
</template>
<script>
export default {
    name:'shituqiehuan2',
    data() {
        return {
        gridData: [
            {num: '2016-05-02',result: '王小虎',}, 
            {num: '2016-05-04',result: '王小虎',}, 
            {num: '2016-05-01',result: '王小虎',}, 
            {num: '2016-05-03',result: '王小虎',}
            ],
        dialogTableVisible: false,
            }//return
        }//data
}//export default
</script>
<style scoped>

</style>