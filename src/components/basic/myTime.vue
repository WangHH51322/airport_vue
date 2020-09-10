<template>
<div>
    <!-- 显示时间！ -->
    <a class="datastyle txt">{{date | formatDateTime}}</a>
</div>
</template>    

<script>
    export default {
        name:'myTime',
        data() {return {date: new Date()};
  },
  filters: {
    formatDateTime(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    }
  },
  mounted() {
    var that = this;
    this.timer = setInterval(() => {
      that.date = new Date(); //修改数据date
    }, 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); //在Vue实例销毁前，清除我们的定时器
    }
  }
    }
</script>
<style  scoped>
a {
    color: black;
}
</style>
