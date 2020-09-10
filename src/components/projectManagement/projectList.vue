<template>
  <div>
    <div>
      <!--搜索/编辑区域-->
      <div>
        <el-button
          type="primary"
          icon="el-icon-folder-add"
          style="margin-bottom: 10px"
          @click="addProject">创建项目</el-button>
        <el-input placeholder="按项目名称搜索" prefix-icon="el-icon-search"
          style="width: 300px;margin-left: 62px" v-model="keyword"
          @keydown.enter.native="initProjectListSearch"
          clearable
          @clear="initProjectListSearch"
          ></el-input>
        <el-button
          icon="el-icon-search"
          circle
          @click="initProjectListSearch"
          style="margin-bottom: 10px;color: red"></el-button>
      </div>


      <el-dialog
        :visible.sync="dialogVisible"
        width="38%">
        <h2 style="margin-top: -10px;
        margin-bottom:20px;
        color:#505458">
          新建项目
        </h2>
        <el-form
          :model="project"
          :rules="projectRules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm">
          <el-form-item label="项目名称:" prop="name">
            <el-input v-model="project.name" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="创建人:" prop="author">
            <span v-model="project.author">{{user.name}}</span>
          </el-form-item>
          <el-form-item label="项目备注:" prop="remarks">
            <el-input type="textarea" v-model="project.remarks" style="width: 360px"></el-input>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">取 消</el-button>
          <el-button type="primary" @click="conformDialog">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div>
      <!--表格区域-->
      <template>
        <el-table
          :data="projectList"
          border
          max-height="500"
          style="width: 1500px">
          <el-table-column
            prop="name"
            label="项目名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="创建时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="changeDate"
            label="修改时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="author"
            label="创建人"
            width="130">
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="备注">
          </el-table-column>
          <el-table-column
            label="操作"
            width="300">
            <template slot-scope="scope">
              <el-button size="small" @click="showEditView(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              <el-button size="small" type="primary" @click="saveProjectId(scope.row)">进入项目</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <el-dialog
        :visible.sync="dialogVisible2"
        width="38%">
        <h2 style="margin-top: -10px;
        margin-bottom:20px;
        color:#505458">
          编辑项目
        </h2>
        <el-form
          :model="updateProject"
          :rules="projectRules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm">
          <el-form-item label="项目名称:" prop="name">
            <el-input v-model="updateProject.name" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="创建人:" prop="author">
            <span v-model="updateProject.author">{{user.name}}</span>
          </el-form-item>
          <el-form-item label="项目备注:" prop="remarks">
            <el-input type="textarea" v-model="updateProject.remarks" style="width: 360px"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="doUpdate">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!--分页框-->
    <div style="display: flex;justify-content: flex-start; margin-top: 10px">
      <el-pagination
        background
        @current-change="currentChange"
        @size-change="sizeChange"
        layout="sizes, prev, pager, next, jumper, ->, total, slot"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
    export default {
        name: "projectList",
      data(){
          return{
            keyword:'',
            total:0,
            page:1,
            size:10,
            user:JSON.parse(window.sessionStorage.getItem("user")), //将保存在sessionStorage里面的数据根据key值取出来
            project: {
              name: '',
              author: '',
              remarks: '',
            },
            updateProject: {
              name: '',
              author: '',
              remarks: '',
            },
            projectRules: {
              name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
              remarks: [{ required: false, message: "请填写项目描述", trigger: "blur" }],
            },
            dialogVisible: false,
            dialogVisible2:false,
            projectList:[],
            projectUnits:{
              id:'',
              projectId:'',
            },
            test:''
          }
      },
      mounted() {
        this.initProjectList();
      },
      methods:{
        currentChange(currentPage){
          this.page = currentPage;
          this.initProjectList();
        },
        sizeChange(currentSize){
          this.size = currentSize;
          this.initProjectList();
        },
        saveProjectId(row){
          window.sessionStorage.setItem("project",JSON.stringify(row));
          this.$router.push('/mainzy/basicData/basicDataUnit');
          this.$store.commit('pageStatus/changeStatus');
          console.log(this.$store.state.pageStatus.pageStatus);
        },
        doUpdate(){
          this.updateProject.author = this.user.name;
          this.putRequest("/api/management/project/", this.updateProject).then(resp => {
            if (resp) {
              this.initProjectList();
              this.dialogVisible2 = false;
            }
          })
        },
        showEditView(row){
          Object.assign(this.updateProject,row);
          this.dialogVisible2 = true;
        },
        handleDelete(index,row){
          this.$confirm('此操作将永久' + row.name + '项目, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteRequest("/api/management/project/" + row.id).then(resp => {
              if (resp) {
                this.initProjectList();
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        conformDialog(){
          if (this.project.name) {
            this.project.author = this.user.name;
            this.postRequest("/api/management/project/returnId/", this.project).then(resp => {
              if (resp) {
                this.initProjectList();
                this.dialogVisible = false;
                this.projectUnits.projectId = resp.obj;
                this.postRequest("/api/management/project/unit/", this.projectUnits).then(resp => {
                  if (resp) {
                    this.$message('这是一条消息提示');
                  }
                });
              }
            });
            this.project = {
              name: '',
              author: '',
              remarks: '',
            }
          }else {
            this.$message.error("项目名称不可以为空!");
          }
          console.log(this.id);
        },
        cancelDialog(){
          this.dialogVisible = false;
          this.project = {
            name: '',
            author: '',
            remarks: '',
          }
        },
        addProject(){
          this.dialogVisible = true;
        },
        initProjectList(){
          this.getRequest("/api/management/project/page/?page=" + this.page + "&size=" + this.size + "&keyword=" + this.keyword )
            .then(resp => {
            if (resp) {
              this.projectList = resp.data;
              this.total = resp.total;
            }
          })
        },
        initProjectListSearch(){
          this.page=1,
          this.getRequest("/api/management/project/page/?page=" + this.page + "&size=" + this.size + "&keyword=" + this.keyword )
            .then(resp => {
              if (resp) {
                this.projectList = resp.data;
                this.total = resp.total;
              }
            })
        }
      }
    }
</script>

<style>
  .dialogTitle{
    margin: 15px auto 20px auto;
    text-align: center;
    color:#505458;
  }

</style>
