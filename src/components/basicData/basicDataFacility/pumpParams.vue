<!--  -->
<template>
<div>
    <div class="breadcrumbTitle">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/basicData/basicData1' }">基础数据</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/basicData/basicDataFacility'}">设备</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/basicData/pumpParams'}">泵-编辑器</el-breadcrumb-item>
    </el-breadcrumb>
    </div>

    <div class="pumpEditorBox">
        123
    </div>
    
</div>
</template>

<script>
import echarts from 'echarts';

export default {
    name: "pumpParams"
}
</script>

<style scoped>

</style>
