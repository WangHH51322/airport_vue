<template>
<!-- 基础数据--管网结构 -->
<div>
    <subMenu></subMenu>
    <router-view></router-view>
</div>

</template>    
<script>
    import subMenu from '@/components/basicData/subMenu.vue'

    export default {
        name:'basicData',
        components:{subMenu},
        data () {
            return {};
        }
    }
</script>
<style  scoped>

</style>