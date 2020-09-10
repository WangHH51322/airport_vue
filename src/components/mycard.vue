<template>
 <Card style="width:320px;" :padding='10' class="no-selected">
<!-- <div style="display: flex;align-items: center"> -->
  <div class="flex">
     <div class="flex a-center j-center" style="width:60px;height:80px" :style="{'background-color':bgcolor}">
<i class="iconfont" v-html="icon"></i>
    </div>
    <div class="flex a-center  j-center flex-1 flex-col">
         <!-- style="text-align:center" -->
        <h1>{{mycount}}</h1>
         <div>{{title}}</div>
    </div>
  </div>
     </Card>
</template>
<script>
export default {
  //  传参
  props: ['icon', 'bgcolor', 'count', 'title'],
  data () {
    return {
      mycount: 0
    }
  },
  mounted () {
    var timer = setInterval(() => {
      if (this.mycount < this.count) this.mycount++
      else clearInterval(timer)
    }, 10)
  }
}
</script>
<style>
  .iconfont {
    color: #fff;
    font-size: 30px;
  }
</style>
