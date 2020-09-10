<template>
<!-- 泵 -->
<div class="pumpBox">
    <el-table :data="tableData" style="width: 100%;margin-top:20px">
        <el-table-column prop="id" label="序号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="泵名称" width="180">
        </el-table-column>

        <el-table-column label="操作">
            <template slot-scope="scope">
                <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"> -->
                <el-button size="mini">
                    <router-link to="/basicData/pumpParams">编辑</router-link>
                    <!-- 编辑 -->
                </el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

</div>
</template>    
<script>

    export default {
        name:'pump',
        data () {
            return {
            tableData: [
                {id: '1',name: '泵1'}, 
                {id: '2', name: '泵2'}, 
                {id: '3', name: '泵3'}, 
                {id: '4',name: '泵4',}]
        }
        },//data
        methods: {
            handleEdit(index, row) {
            
                console.log('成功了1！！！'+index, row);

                console.log('成功了2！！！'+row.name);
                // this.$route  代表当前路由对象
                // this.$router 代表所有路由对象，可理解为routes,用于页面间跳转
            // this.$router.push({path:'/pumpParams'}
            // )
        },
            handleDelete(index, row) {
                console.log(index, row);
        }
    }
}
</script>
<style  scoped>

</style>