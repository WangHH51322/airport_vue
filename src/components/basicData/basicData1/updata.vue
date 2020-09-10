<!--  -->
<template>
<div>
    123
    <el-form style="width: 60%" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

        <el-form-item label="管段编号">
            <el-input v-model="ruleForm.code" ></el-input>
        </el-form-item>

        <el-form-item label="起点编号" prop="name">
            <el-input v-model="ruleForm.startcode"></el-input>
        </el-form-item>

        <el-form-item label="终点编号" prop="author">
            <el-input v-model="ruleForm.endcode"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

    </el-form>
</div>
</template>

<script>
export default {
    name: "updata",
    data() {
        return {
            ruleForm: {
                code: '',
                startcode: '',
                endcode: ''
            },
            rules: {
                code: [
                    { required: true, message: '管段编号不能为空', trigger: 'blur' }
                ],
                startcode: [
                    { required: true, message: '起点编号不能为空', trigger: 'blur' }
                ],
                endcode:[
                    { required: true, message: '终点编号不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        submitForm(formName) {
            const _this = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.put('http://localhost:8181/book/update',this.ruleForm).then(function(resp){
                        if(resp.data == 'success'){
                            _this.$alert('管段'+_this.ruleForm.code +'修改成功！', '消息', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    _this.$router.push('/basicData/basicData1')
                                }
                            })
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },
    created() {
        const _this = this
        this.$axios.get('http://localhost:8181/book/findById/'+this.$route.query.id).then(function(resp){
            _this.ruleForm = resp.data
        })
    }
    
}
</script>

<style scoped>

</style>
