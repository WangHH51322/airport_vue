<template class="header">
  <div>
    <el-form :rules="rules" :model="loginForm" ref="loginForm" class="loginContainer">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" pleaseholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="text" v-model="loginForm.password" auto-complete="off" pleaseholder="请输入密码" @keydown.enter.native="submitLogin"></el-input>
      </el-form-item>
      <el-checkbox class="loginRemember" v-model="checked"></el-checkbox>
      <el-button type="primary" style="width:100%" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
  //import {postKeyValueRequest} from "../utils/api";

  export default {
    name: 'Login',
    data(){
      return{
        loginForm:{
          username:'admin',
          password:'123'
        },
        checked:true,
        rules:{
          username:[{required:true,message:'请输入用户名',trigger:'blur'}],
          password:[{required:true,message:'请输入密码',trigger:'blur'}],
        }
      }
    },
    methods:{
      submitLogin(){
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.postKeyValueRequest('/api/doLogin',this.loginForm).then(resp=>{
              if(resp){
                window.sessionStorage.setItem("user",JSON.stringify(resp.obj)); //将后端传过来的数据放到sessionStorage里面，可以随着页面关闭删除数据
                this.$router.replace('/pageHeaderAndFooter')
              }
            })
            //alert('submit!');
          } else {
            this.$message.error('请输入所有信息');
            return false;
          }
        });
      }
    }
  }
</script>

<style>
  /*.header{*/
  /*  background-image: url("../assets/bgp1.jpg");*/
  /*}*/
  .loginContainer{
    border-radius: 15px;
    background-clip: padding-box;
    background-image: url("../assets/bgp1.jpg");
    margin:180px auto;
    width: 350px;
    padding: 15px 35px 15px 35px;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .loginTitle{
    margin: 15px auto 20px auto;
    text-align: center;
    color:#505458;
  }
  .loginRemember{
    text-align: left;
    margin: 0px 0px 15px 0px
  }
</style>
