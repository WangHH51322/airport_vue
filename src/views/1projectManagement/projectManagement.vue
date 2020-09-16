<template>
  <div>
    <el-container>
      <!-- 顶部盒子 -->
<!--      <div class="headerBox">-->
<!--        &lt;!&ndash; 标题 &ndash;&gt;-->
<!--        <span class="headerBoxLeft">项目管理</span>-->
<!--        &lt;!&ndash; <span class="headerBoxRight">-->
<!--                <el-button  plain class="topButton">添加项目</el-button>-->
<!--                <el-button  plain class="topButton">删除项目</el-button>-->
<!--        </span>&ndash;&gt;-->
<!--      </div>-->
    </el-container>
    <div class="content">
      <div class="innercontent">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/mainzy' }">项目管理</el-breadcrumb-item>
          <el-breadcrumb-item>项目列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="innercontent">
        <project-list></project-list>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import projectList from "@/components/projectManagement/projectList";
export default {
  name: "projectManagement",
  components: { "project-list": projectList },

};
</script>

<style scoped>
.innercontent {
  padding: 20px;
}
</style>
