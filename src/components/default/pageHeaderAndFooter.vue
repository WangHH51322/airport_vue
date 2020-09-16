<template>

  <el-container>
    <!--页面顶端-->
    <el-header class="homeHeader" >

      <el-col :span="1">
        <el-image :src="require('@/assets/img.jpg')" @click="changeModel"></el-image>
      </el-col>
      <el-col :span="22" >
        <div class="title">
          机场水力计算
        </div>
      </el-col>
      <el-col :span="3">
        <el-dropdown class="userInfo" @command="commandHandler"
        ><!--@command连接下面的各个command方法，根据传给commandHandler的值不同，调用不同的方法-->
          <span class="el-dropdown-link">
              <i><img :src="require('@/assets/img.jpg')" alt="" style="margin-right: 10px"></i>{{user.name}}
            </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userInfo">个人中心</el-dropdown-item> <!--common表示点击事件-->
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-header>
    <el-container style="margin-top: -5px">
      <!--这里是主显示区-->
      <el-main :style="defaultHeight">
          <router-view></router-view>
      </el-main>
    </el-container>
    <el-footer align="right" class="homeFooter">
      中国石油大学（北京） 2020~copyright©
    </el-footer>
  </el-container>

</template>

<script>
  export default {
    name: "pageHeaderAndFooter",
    data(){
      return{
        defaultHeight:{
          height: ""
        },
        user:JSON.parse(window.sessionStorage.getItem("user")), //将保存在sessionStorage里面的数据根据key值取出来
        note: {
          backgroundImage: "url(" + require("../../assets/bgp1.jpg") + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "25px auto",
          marginTop: "5px",
        },

      }
    },
    methods:{
      getHeight() {
        this.defaultHeight.height = window.innerHeight - 130 + "px";
      },
      changeModel(){
        this.$router.push("/pageHeaderAndFooter")
      },
      commandHandler(cmd){
        if (cmd == 'logout'){
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
        }
      },
    },
    created() {
      window.addEventListener("resize", this.getHeight);
      this.getHeight();
    }
  }
</script>

<style>

.homeWelCome{
  text-align: center;
  font-size: 30px;
  font-family: 微软雅黑;
  color: #3be515;
  padding-bottom: 25px;
}

.homeFooter{
  margin-right: 20px;
  font-size: 18px;
  font-family: 微软雅黑;
  color: #000000;
  line-height: 60px;
}

.homeHeader{
  /*background-image: url("../../assets/bgp3.jpg");*/
  text-align: left;
  background-color: #fdfdff;
  display: flex;
  align-items:center;
  /*justify-content: space-between;*/
  padding: 0px 15px;
  box-sizing: border-box;
  border: 1px solid #eee
}

.homeHeader .title{
  /*margin-left: -1120px;*/
  align: left;
  font-size: 30px;
  font-family: 微软雅黑;
  color: #000000;
}

.homeHeader .userInfo{
  cursor: pointer; /* 当鼠标移到上面时变为手指形状*/
  color: black;
}

.homeHeader img{
  width: 50px;
  height: 50px;
  border-radius: 24px;
  margin-left: 8px;
  margin-right: 8px;
  margin-top: 4px;
  cursor: pointer;
}

.el-dropdown-link img{
  width: 30px;
  height: 30px;
  border-radius: 24px;
  margin-left: 8px;
}

.el-dropdown-link{
  display: flex;
  align-items: center;
}

</style>
