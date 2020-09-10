<template>
  <!-- 一级目录组件 -->
  <div class="asiseMenu">
    <!-- <Sider hide-trigger :style="{background: '#fff'}"> -->
    <span class="logo asideTop">logo</span>
    <span class="appName asideTop">软件名称</span>
      <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose">
      <el-menu-item index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span @click="changeStatus">
            <router-link to="/mainzy">项目管理</router-link>
          </span>
        </template>
     </el-menu-item>
     <!-- 基础数据 -->
      <el-submenu index="1" :disabled="this.$store.state.pageStatus.pageStatus">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>基础数据</span>
        </template>
        <el-menu-item-group>
          <router-link to="/mainzy/basicData/basicDataUnit"><el-menu-item index="1-2">单位配置</el-menu-item></router-link>
          <router-link to="/mainzy/basicData/fluidList"><el-menu-item index="1-2">流体</el-menu-item></router-link>
          <router-link to="/mainzy/basicData/basicDataPipe"><el-menu-item index="1-2">管材</el-menu-item></router-link>
          <router-link to="/mainzy/basicData/basicDataFacility"><el-menu-item index="1-2">设备</el-menu-item></router-link>
           <el-menu-item index="1-2">其他</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!-- 模型检查 -->
       <el-submenu index="2" :disabled="this.$store.state.pageStatus.pageStatus">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>模型检查</span>
        </template>
        <el-menu-item-group>
          <router-link to="/mainzy/validityCheck/basicData1"><el-menu-item index="1-2">管网列表</el-menu-item></router-link>
          <router-link to="/mainzy/validityCheck"><el-menu-item index="1-2">管网拓补结构</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu >
      <el-menu-item index="1" :disabled="this.$store.state.pageStatus.pageStatus">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>
            <router-link to="/mainzy/steady">稳态计算</router-link>
          </span>
        </template>
     </el-menu-item>
     <el-menu-item index="1" :disabled="this.$store.state.pageStatus.pageStatus">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>
            <router-link to="/mainzy/transient">瞬态计算</router-link>
          </span>
        </template>
     </el-menu-item>
     <el-menu-item index="1" :disabled="this.$store.state.pageStatus.pageStatus">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>
      <router-link to="/">计算结果</router-link>
    </span>
        </template>
     </el-menu-item>
</el-menu>

    <!-- <el-button class="headerBtns" plain @click="inBasicData()">基础数据</el-button>

    <el-button class="headerBtns" plain>
      <router-link to="/validityCheck">模型检查</router-link>
    </el-button>
    <el-button class="headerBtns" plain>
      <router-link to="/steady">稳态计算</router-link>
    </el-button>
    <el-button class="headerBtns" plain>
      <router-link to="/transient">瞬态计算</router-link>
    </el-button>
    <el-button class="headerBtns" plain>
      <router-link to="/validityCheck">计算结果</router-link>
    </el-button> -->

    <div class="asideButtom">
      <span class="username">
        <el-button plain>{{user.name}}</el-button>
      </span>
      <span class="quit">
        <el-button plain @click="logout">退出</el-button>
      </span>
    </div>
    <!-- </Sider> -->
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "myMenu",
  data() {
    return {
      /*ifDisabled:this.$store.state.pageStatus.pageStatus,*/
      user:JSON.parse(window.sessionStorage.getItem("user")) //将保存在sessionStorage里面的数据根据key值取出来
    };
  },
  methods: {
    changeStatus(){
      //this.ifDisabled = true
    },
    logout(){
      this.$confirm('此操作将注销登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.getRequest("/api/logout"); /*确认退出后，获取后端的数据*/
        window.sessionStorage.removeItem("user") /*删除登录用户的缓存数据*/
        this.$store.commit('initRoutes',[]) /*删除登录用户的缓存数据*/
        this.$router.replace("/") /*退出后回到登录页*/
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    // inBasicData() {
    //   this.$router.push({
    //     name: "basicData1",
    //     params: {
    //       projectName: this.name,
    //       id: this.id,
    //     },
    //   });
    // },
     inFluid() {
      this.$router.push({
        name: "fluidList",
        params: {
          projectName: this.name,
          id: this.id,
        },
      });
    },
     inPipeStructure() {
      this.$router.push({
        name: "basicData1",
        params: {
          projectName: this.name,
          id: this.id,
        },
      });
     },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
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
.asideTop {
  display: inline-flex;
  width: 70px;
  height: 60px;
  border: 1px solid black;
  margin: 10px 5px 10px 15px;
  /* margin: 10px auto; */
}

.headerBtns {
  width: 160px;
  margin: 10px 15px;
  color: #000;
  /* margin: 10px auto; */
}

/* 底部 */
.asideButtom {
  height: 40px;
  margin: 50px 0px 10px 15px;
}
.username {
  width: 90px;
}
.quit {
  width: 50px;
}
</style>
