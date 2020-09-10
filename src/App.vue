<template>
<!--  只能写一个根节点 div-->
  <div id="app">
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
// import './assets/css/common.css'
export default {
  name: 'App',
   mounted () {
     if(this.ls.getItem("project")){
        window.addEventListener('load', this.saveState)
     }

  },
  methods: {

    ...mapMutations("projectList", ["PROJECT_INFO"]),
    saveState () {
      let project=this.ls.getItem("project")
       console.log("project",project)
      this.PROJECT_INFO({project})

    }
  }
}
</script>

<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  /*text-align: center;*/
  /* color: #2c3e50; */
  /*margin-top: 60px;*/
}
</style>
