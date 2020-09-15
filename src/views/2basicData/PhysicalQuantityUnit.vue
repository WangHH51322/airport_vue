<!-- 物理量单位配置 -->
<template>
  <div style="padding: 20px">
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>基础数据</el-breadcrumb-item>
        <el-breadcrumb-item>单位配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="margin-top: 20px">
      <el-form size="small" :inline="true" class="demo-form-inline" width="auto">
        <el-form-item label="单位系统:" label-width="80px" width="auto">
          <el-select
            v-model="switchValue"
            placeholder="请选择"
            @change="switchChange()"
            style="width:100px"
          >
            <el-option
              v-for="item in unitSystem"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-top: 20px">
      <el-table
        :data="PhysicalQuantityUnits"
        border
        max-height="500"
        style="width:20%;"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
      >
        <el-table-column prop="name" label="物理量名称"></el-table-column>
        <el-table-column label="单位" width="100">
          <template slot-scope="scope">
            <!-- 普通选择器 -->
            <el-select
              v-model="scope.row.unit"
              placeholder="请选择"
              size="small"
              style="radius:false"
              @visible-change="getunit($event,scope.$index,scope.row)"
               @change="changeunit($event,scope.$index,scope.row)"
            >
            <!-- $event:回调参数_改变后的值，scope.$index：行号，scope.row：这一行数据 -->
              <el-option
                v-for="item in selectoptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      PhysicalQuantityUnits: [
        {
          name:"管道内径",
          unit:"m"
        },
        {
          name:"管道内径",
          unit:"m"
        },
        {
          name:"管道内径",
          unit:"m"
        },
        {
          name:"管道内径",
          unit:"m"
        },


        
      ],
      selectoptions:[

      ],
      unitSystem: [
        {
          id: "1",
          name: "公制",
        },
        {
          id: "2",
          name: "英制",
        },
      ],
      switchValue: "1",
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  methods: {
    //表头css
    headerCellStyle() {
      return "text-align:center;padding:8px";
    },
    //每个小表格css
    cellStyle() {
      return "text-align:center;padding:1px;height:50px";
    },
    getunit(callback){
      if(callback){
        alert("请求物理量所有单位")
        //示例数据
        let unit=[
          {
          id: "1",
          name: "m",
        },
        {
          id: "2",
          name: "cm",
        },
        {
          id: "3",
          name: "mm",
        },
        ]
        this.selectoptions=unit
      }
      
    },
    changeunit(callback,index,row){
      //回调参数为选项的key值
      alert("下拉框选中的值:"+JSON.stringify(this.selectoptions[callback-1]))
      alert("表格中这一行的数据PhysicalQuantityUnits:"+JSON.stringify(this.PhysicalQuantityUnits[index]));

    }
  },
};
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>