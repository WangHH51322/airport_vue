<template>
  <!-- 三、模型检查 -->
  <div style="width:100vw;height:100vh">
    <el-container>
      <div class="headerBox">
        <!-- 标题 -->
        <span class="headerBoxLeft">模型检查</span>
        <span class="headerBoxRight">
          <el-button plain class="topButton">
            <!-- <router-link to="/basicData/basicData1">管网结构</router-link> -->
          </el-button>
        </span>
      </div>
    </el-container>

    <el-row>
      <el-col :span="18">
        <div class="contentLeft">
          <!-- 左边 -->
          <div class="centerBox">
          <editor class="editor"></editor>
          </div>
          <footer class="footBox">进展</footer>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="contentRight">
          <!-- 右边 设备信息 -->
          设备信息
          <facility-info></facility-info>
        </div>
      </el-col>
    </el-row>
  </div>
</template>    
<script>
import editor from "@/components/editor/editor";
import facilityInfo from "@/components/info/facilityInfo"

// import editor from "@/components/editor(2)";//维嘉写的
// import editor from "@/components/editor(3)";//自定义布局

export default {
  name: "validityCheck",
  data() {
    return {};
  },
  methods: {
    
  },
  components: { editor,'facility-info':facilityInfo }
};
</script>
<style  scoped>
.editor {
  height: 400px;
}
</style>