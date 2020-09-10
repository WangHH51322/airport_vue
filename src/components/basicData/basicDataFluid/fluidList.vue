<!--  -->
<template>
  <div>
    <!-- 搜索框 -->
    <el-row>
      <el-col :span="4">
        <!-- 新建项目按钮 -->
        <div class="createButton">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            style="margin-left:20px"
            @click.native="setFormName();"
          >新建流体</el-button>
        </div>

        <!--新建项目表单  -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="流体名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="流体类型" prop="type">
              <el-radio-group v-model="ruleForm.type">
                <el-radio label="牛顿流体"></el-radio>
                <el-radio label="非牛顿流体"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="others">
              <el-input type="textarea" v-model="ruleForm.others"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm','create');">创建</el-button>

              <el-button @click="resetForm('ruleForm')">重置</el-button>
              <el-button @click="dialogFormVisible = false">取 消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 表单结束 -->
      </el-col>
      <el-col :span="20">
        <!-- 搜索表单 -->
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="项目名称：" label-width="90px">
            <el-input size="small" v-model="searchForm.name"></el-input>
          </el-form-item>
          <el-form-item label="时间：" label-width="70px">
            <el-input
              size="small"
              v-model="searchForm.firstDate"
              placeholder="2020-07-26"
              :maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="至">
            <el-input size="small" v-model="searchForm.secondDate" placeholder="2020-07-28"></el-input>
          </el-form-item>
          <el-form-item label="状态：" label-width="70px">
            <el-select v-model="searchForm.states" size="small">
              <el-option label="牛顿流体" value="牛顿流体"></el-option>
              <el-option label="非牛顿流体" value="非牛顿流体"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" label-width="90px">
            <el-input size="small" v-model="searchForm.others"></el-input>
          </el-form-item>
          <div style="float:right">
            <el-form-item>
              <el-button type="primary" @click.native="searchForms()" size="small">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click.native="cancelSearch()" size="small">取消</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <!-- 搜索表单结束 -->

    <!-- 表格 -->
    <div class="tableStyle">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :fit="true"
        :border="true"
        height="350"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
      >
        <el-table-column v-if="false" prop="id" label="编号" width="80"></el-table-column>
        <el-table-column prop="name" label="流体名称"></el-table-column>
        <el-table-column prop="housedate" label="修改时间" width="180"></el-table-column>
        <el-table-column label="流体类型" width="180" prop="type">
          <template slot-scope="scope">
            <el-tag size="medium">{{scope.row.type}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="others" label="备注"></el-table-column>

        <el-table-column prop="actions" label="操作" width="250">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row);">编辑</el-button>
            <el-button size="mini" type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[8, 16, 24, 32]"
        :page-size="8"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "fluidList",
  data() {
    return {
      /****搜索表单**/
      searchForm: {
        name: "",
        states: "",
        firstDate: "",
        secondDate: "",
        others: "",
      },
      /******表格************** */
      tableData: [
        {
          id: 1,
          name: "航煤",
          housedate: "2020-08-05",
          type: "牛顿流体",
          others: "",
        },
      ],
      /******分页 ************/
      showState: true,
      searchState: false,
      currentPage: 1,
      total: 0,
      page: 1,
      size: 8,
      /****输入框 *************/
      input1: "",
      input2: "",
      input3: "",
      select: "",
      /***表单 */
      dialogTitle: "",
      dialogFormVisible: false,
      editFormVisible: false,
      rowindex: 0,
      ruleForm: {
        name: "",
        others: "",
      },
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],

        others: [
          { required: false, message: "请填写活动形式", trigger: "blur" },
        ],
        /*****表单结束**** */
      },
    };
  },

  //生命周期 - 创建完成（访问当前this实例）
  methods: {
    /***
     *
     * **搜索请求
     *
     */

    searchForms() {
      //将表单对象拷贝给sendData对象，改变sendData对象的值，表单searchForm对象值不受影响
      let sendForm = Object.assign({}, this.searchForm);

      if (
        this.searchForm.firstDate !== "" &&
        this.searchForm.firstDate !== ""
      ) {
        let time1 = new Date(this.searchForm.firstDate);
        let time2 = new Date(this.searchForm.secondDate);
        var localTime1 = time1.getTime();
        var localOffset1 = time1.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数
        var firstDate = localTime1 + localOffset1; //utc即GMT时间
        var localTime2 = time2.getTime();
        var localOffset2 = time2.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数
        var day = 24 * 60 * 60000;
        var secondDate = localTime2 + localOffset2 + day; //utc即GMT时间
        firstDate = this.formateTimeStamp(firstDate);
        secondDate = this.formateTimeStamp(secondDate);
        // console.log("firstDate", firstDate);
        // console.log("secondDate", secondDate);
        sendForm.firstDate = firstDate;
        sendForm.secondDate = secondDate;
        // console.log(" sendForm.firstDate", firstDate);
        // console.log("sendForm.secondDate ", secondDate);
      }

      sendForm.currentpage = this.page;
      sendForm.size = this.size;
      this.showState = false;
      this.searchState = true;
      //   this.postKeyValueRequest("/Book/searchforms", sendForm).then((resp) => {
      //     if (resp) {
      //       console.log("searchresp", resp);
      //       this.tableData = resp.data.list;
      //       this.total = resp.data.bookCount;
      //     }
      //   });
    },

    /**
     *
     * *取消搜索
     *
     */
    cancelSearch() {
      //清空searchForm属性的值
      Object.keys(this.searchForm).forEach(
        (key) => (this.searchForm[key] = "")
      );
      this.searchState = false;
      this.showState = true;
      //   this.getRequest("/Book").then((resp) => {
      //     if (resp) {
      //       console.log(resp);
      //       this.tableData = resp.data.list;
      //       this.total = resp.data.total;
      //     }
      //   });
    },
    /*****分页 */
    handleSizeChange(pageSize) {
      this.size = pageSize;
      console.log(`每页 ${pageSize} 条`);
      if (this.showState) {
        this.changePageorSize();
      }
      if (this.searchState) {
        this.searchForms();
      }
    },
    handleCurrentChange(currentPage) {
      console.log(`第 ${currentPage} 页`);
      this.page = currentPage;
      if (this.showState) {
        this.changePageorSize();
      }
      if (this.searchState) {
        this.searchForms();
      }
    },
    changePageorSize() {
      //   this.getRequest(
      //     "/Book?currentpage=" + this.page + "&size=" + this.size
      //   ).then((resp) => {
      //     if (resp) {
      //       console.log(resp);
      //       this.tableData = resp.data.list;
      //       this.total = resp.data.total;
      //     }
      //   });
    },
    /****表格 */
    //编辑&删除操作
    handleEdit(index, row) {
      console.log(index, row);
      this.rowindex = index;
      this.$router.push({
        name: "basicDataFluid",
        params: {
          projectName: row.name,
          id: row.id,
        },
      });
    },
    
    handleDelete(index, row) {
      this.deleteRow(row.id);

      console.log(index, row);
    },
    deleteRow(id) {
      const _this = this;
      var params = String(id);
      console.log(typeof params);
      //   _this.deleteRequest("/Book/delete?id=" + params).then((resp) => {
      //     if (resp) {
      //       console.log(resp);
      //       this.tableData = resp.data.list;
      //       this.total = resp.data.total;
      //     }
      //   });
    },
    getTable(response) {
      this.tableData = response;
    },

    //*************css******************/
    //表头css
    headerCellStyle() {
      return "text-align:center;border-color: black; color: black; ";
    },
    //每个小表格css
    cellStyle() {
      return "text-align:center;border-color: black; ";
    },
    /*****表格css结束**** */

    /****新建项目表单 *******************/
    setFormName() {
      this.dialogTitle = "创建项目";
      //清空ruleform属性的值
      Object.keys(this.ruleForm).forEach((key) => (this.ruleForm[key] = ""));
      this.dialogFormVisible = true;
    },
    submitForm(formName, action) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (action == "create") {
            this.createProject(this.ruleForm);
            this.dialogFormVisible = false;
          }
          if (action == "edit") {
            this.saveProject(this.tableData[this.rowindex]);
            this.editFormVisible = false;
          }
          console.log(this.rowindex);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**********新建项目请求********** */
    createProject(formName) {
      const _this = this;
      formName.states = "基础数据";
      var params = formName;
      //   _this.postKeyValueRequest("/Book/save", params).then((resp) => {
      //     if (resp) {
      //       console.log(resp);
      //       this.tableData = resp.data.list;
      //       this.total = resp.data.total;
      //     }
      //   });
    },
    /************修改项目请求******** */
    saveProject(formName) {
      console.log(formName);
      let sendData = Object();
      sendData.id = formName.id;
      sendData.name = this.ruleForm.name;
      sendData.others = this.ruleForm.others;
      sendData.states = formName.states;
      var timestamp3 = new Date().getTime();
      //时间戳转换为固定格式传给后台
      var time = this.formateTimeStamp(timestamp3);
      console.log(time);
      sendData.housedate = time;
      console.log(sendData);
      const _this = this;
      var params = sendData;
      //   _this.putKeyValueRequest("/Book/update/", params).then((resp) => {
      //     if (resp) {
      //       console.log(resp);
      //       this.tableData = resp.data.list;
      //       this.total = resp.data.total;
      //     }
      //   });
    },
    /****时间戳 转为yyyy-MM-dd HH:mm:ss****/
    formateTimeStamp(time) {
      var date = new Date();
      date.setTime(time);
      var year = date.getFullYear();
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minute =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var second =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /***新建/修改项目表单结束 */

    /**
     *
     *点击进入项目，跳转路由
     *
     */
    ...mapMutations("projectList", ["PROJECT_INFO"]),
    inProject(index, row) {
      if (this.ls.getItem("project")) {
        this.ls.removeItem("project");
      }
      //将项目名称和ID存入sessionStorage和vuex
      let project = {
        name: row.name,
        id: row.id,
      };
      this.ls.setItem("project", project);
      this.PROJECT_INFO({ project });
      console.log(index, row);

      this.$router.push({
        name: "basicData1",
        params: {
          projectName: row.name,
          id: row.id,
        },
      });
    },
  },

  /****
   * ***
   *
   */

  //页面加载前请求数据
  created() {
    /***第一种post方式 */
    //  var formData=new FormData();
    //  formData.append('username','admin');
    // formData.append('password','admin123');
    // console.log(formData)
    /***第二种post方式 */
    // var data={'username':'admin','password':'admin123'}
    //             this.$axios.post('http://localhost:8082/user/login',qs.stringify(data)).then(function(resp){
    //                 console.log(resp)
    //             })
    /*****第三种post键值对方式****** */
    // var params={'username':'admin','password':'admin123'}
    // _this.postKeyValueRequest("/user/login", params).then(resp => {
    //   if (resp) {
    //     console.log(resp)
    //   }
    // });
    /*********grails************** */
    // this.getRequest("/Book").then((resp) => {
    //   if (resp) {
    //     console.log("Book,", resp);
    //     this.tableData = resp.data.list;
    //     this.total = resp.data.total;
    //   }
    // });
    /**********请求数据结束*********** */
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 */
/****分页 */
.createButton {
  padding: 40px;
  border-right: 1px solid #dcdfe6;
}
.block {
  margin-top: 20px;
  float: right;
}
/**输入框 */
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
/****表格 */
.tableStyle {
  margin-top: 15px;
}
</style>