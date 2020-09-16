<template>
  <el-container direction="vertical">
    <el-row style="height: 60px">
      <el-col :span="2">
        <el-button @click="next" type="success" style="margin-top: -8px">下一步</el-button>
        <el-button @click="before" type="primary" style="margin-top: 2px;margin-left: 0px" >上一步</el-button>
      </el-col>
      <el-col :span="22">
        <el-steps :active="active" finish-status="success">
          <el-step title="创建工程"></el-step>
          <el-step title="拓扑结构"></el-step>
          <el-step title="元素属性"></el-step>
          <el-step title="边界条件"></el-step>
          <el-step title="初始条件"></el-step>
          <el-step title="事件列表"></el-step>
          <el-step title="系统设置"></el-step>
          <el-step title="运行"></el-step>
          <el-step title="报告"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <el-row>
      <el-divider></el-divider>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-card>
          这里显示菜单
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-card>
          这里是主显示区
        </el-card>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
  export default {
    name: "modelGuide",
    data() {
      return {active: 0}
    },
    methods: {
      next() {
        if (this.active < 9) {
          console.log('下一步')
          this.active++
        } else {
          alert('已经完成最后一步!!!');
        }
      },
      before() {
        if (this.active > 0){
          console.log('上一步')
          this.active--
        }else {
          alert('已经回到第一步!!!');
        }
      }
    }
  }
</script>

<style scoped>

</style>
