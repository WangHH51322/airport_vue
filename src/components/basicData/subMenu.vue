<template>
  <!-- 二级目录组件 -->
  <div>
    <el-container>
      <div class="headerBox">
        <!-- 标题 -->
        <span class="headerBoxLeft">基础数据</span>
        <span class="headerBoxRight">
          <el-button plain class="topButton" @click="inPipeStructure()">管网结构</el-button>
          <el-button plain class="topButton" @click="inFluid()">流体</el-button>
          <el-button plain class="topButton">
            <router-link to="/basicData/basicDataPipe">管材</router-link>
          </el-button>
          <el-button plain class="topButton">
            <router-link to="/basicData/basicDataFacility">设备及其他</router-link>
          </el-button>
        </span>
      </div>
    </el-container>
  </div>
</template>    
<script>
import { mapState } from "vuex";
export default {
  name: "subMenu",
  data() {
    return {};
  },
  methods: {
    inPipeStructure() {
      this.$router.push({
        name: "basicData1",
        params: {
          projectName: this.name,
          id: this.id,
        },
      });
    },
    inFluid() {
      this.$router.push({
        name: "fluidList",
        params: {
          projectName: this.name,
          id: this.id,
        },
      });
    },
  },
  computed: {
    ...mapState("projectList", ["projectName", "projectId"]),
    name() {
      return this.projectName;
    },
    id() {
      return this.projectId;
    },
  },
};
</script>
<style  scoped>
</style>