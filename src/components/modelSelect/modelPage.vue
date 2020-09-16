<template xmlns:el-col="http://www.w3.org/1999/html">
  <el-row :gutter="30" style="margin-top: 50px">
    <el-col :span="6" style="margin-left: 180px">
      <el-card :body-style="{ padding: '30px' }">
        <router-link to="/mainzy">
          <img src="../../assets/expertPicture.jpg" height="100%" width="100%" style="border-radius: 24px;"/>
        </router-link>
        <div style="padding: 14px;">
          <span>专家模式：所有选项开放</span>
          <div class="bottom clearfix">
            <router-link to="/mainzy">
              <el-button type="warning" class="button" icon="el-icon-setting">专家模式</el-button>
            </router-link>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card :body-style="{ padding: '30px' }">
        <router-link to="/guide">
          <img src="../../assets/guidPicture.jpg"  height="100%" width="100%" style="border-radius: 24px;"/>
        </router-link>
        <div style="padding: 14px;">
          <span>向导模式：根据引导，步步为营...</span>
          <div class="bottom clearfix">
            <el-button type="success" class="button" icon="el-icon-service" @click="toGuide">向导模式
            </el-button>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card :body-style="{ padding: '30px' }">
        <router-link to="/maintain">
          <img src="../../assets/fixPicture.jpg"  height="100%" width="100%" style="border-radius: 24px;"/>
        </router-link>
        <div style="padding: 14px;">
          <span>维护模式：增、删、改、查、复制...</span>
          <div class="bottom clearfix">
            <el-button type="primary" class="button" icon="el-icon-edit" @click="toMaintain">维护模式
            </el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "modelPage",
    methods: {
      toGuide() {
        console.info("向导模式");
        this.$router.push("/guiderModel");
      },
      toMaintain() {
        console.info("维护模式");
        this.$router.push("/maintain");
      }
    }
  }
</script>

<style scoped>

</style>
