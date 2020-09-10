<template>
  <div class="thiscontent">
    <div class="inner">
      <div class="innercontent">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>基础数据</el-breadcrumb-item>
          <el-breadcrumb-item>流体列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="innercontents">
        <fluid-table></fluid-table>
        <!-- <fluid-list></fluid-list> -->
      </div>
      <div class="innercontents">
        <table-third></table-third>
      </div>
      <div >
        <table-elstyle></table-elstyle>
        
</div>
<div style="margin-top:30px"><table3-elstyle></table3-elstyle></div>
</div>
  </div>
</template>

<script>
import qs from "qs";
import fluidList from "@/components/basicData/basicDataFluid/fluidList";
import fluidTable from "@/components/basicData/basicDataFluid/fluidTable";
import tableThird from "@/components/basicData/basicDataFluid/tableThird";
import tableElstyle from "@/components/basicData/basicDataFluid/tableElstyle";
import table3Elstyle from "@/components/basicData/basicDataFluid/table3Elstyle";
export default {
  name: "fluidTable",
  components: {
    "fluid-table": fluidTable,
    "fluid-list": fluidList,
    "table-third": tableThird,
    "table-elstyle": tableElstyle,
    "table3-elstyle": table3Elstyle,
  },
};
</script>

<style scoped>
.thiscontent{
  height:calc(100vh - 100px);
overflow:auto;
}
.inner{
  padding:20px
}
.innercontents {
  padding: 20px;
  height: 200px;
  overflow: hidden;
  margin-top: 20px;
}
</style>