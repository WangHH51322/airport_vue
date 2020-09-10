<template>
  <!-- 基础数据--管网结构 -->
  <div style="display:flex">
    <!-- <el-row> -->
    <!-- <el-col :span="3"> -->
    <div class="dataBoxLeft">
      <!-- 左边按钮区域 -->
      <!--limit:最大上传数，on-exceed：超过最大上传数量时的操作  -->
      <el-upload
        class="upload-demo"
        action
        :on-change="handleChange"
        :on-remove="handleRemove"
        :on-exceed="handleExceed"
        :limit="limitUpload"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        :auto-upload="false"
      >
        <el-button size="small" type="primary" class="demoUp">EXCEL文件导入</el-button>
        <!-- <div slot="tip" class="el-upload__tip">只 能 上 传 xlsx / xls 文 件</div> -->
        <el-button size="small" type="primary" class="demoUp">CAD文件导入</el-button>
      </el-upload>
      <el-button size="small" type="primary" class="demoUp">手动输入</el-button>

      <!-- 左边按钮区域结束 -->
    </div>
    <!-- </el-col>
    <el-col :span="21">-->

    <!-- 右边显示区域 -->
    <div class="ex-table">
      <div class="right_main">
        <el-table :data="tableData">
          <el-table-column highlight-current-row="true" prop="id" label="管段编号"></el-table-column>
          <el-table-column prop="startcode" label="起点编号"></el-table-column>
          <el-table-column prop="endcode" label="终点编号"></el-table-column>
          <el-table-column prop="length" label="管长"></el-table-column>
          <el-table-column prop="dia" label="管径"></el-table-column>
          <el-table-column prop="guancai" label="管材"></el-table-column>
          <el-table-column prop="height" label="沿线高程"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="deleteBook(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="total"
          @current-change="page"
        ></el-pagination>
        <!-- <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    fixed
                    prop="id"
                    label="序号"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="code"
                    label="管段编号"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="startcode"
                    label="起点编号"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="endcode"
                    label="终点编号"
                    width="120">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
                    <el-button @click="deleteBook(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-button round @click="addBook" type="text" >添加数据</el-button>

        <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="total"
                @current-change="page">
        </el-pagination>-->
      </div>
    </div>
    <!-- 右边显示区域结束 -->

    <!-- </el-col>
    </el-row>-->
  </div>
</template>
<script>
export default {
  name: "basicData1",
  data() {
    return {
      limitUpload: 1,
      fileTemp: null,
      file: null,
      da: [],
      dalen: 0,

      pageSize: 1,
      total: 11,
      tableData: [],
    };
  }, //data

  created() {
    // const _this = this;
    // this.$axios
    //   .get("http://localhost:8181/book/findAll/0/6")
    //   .then(function (resp) {
    //     console.log(resp);
    //     _this.tableData = resp.data.content;
    //     _this.pageSize = resp.data.size;
    //     _this.total = resp.data.totalElements;
    //   });
  },

  methods: {
    handleChange(file, fileList) {
      this.fileTemp = file.raw;
      if (this.fileTemp) {
        if (
          this.fileTemp.type ==
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          this.fileTemp.type == "application/vnd.ms-excel"
        ) {
          this.importfxx(this.fileTemp);
        } else {
          this.$message({
            type: "warning",
            message: "附件格式错误，请删除后重新上传！",
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "请上传附件！",
        });
      }
    },
    handleExceed() {
      this.$message({
        type: "warning",
        message: "超出最大上传文件数量的限制！",
      });
      return;
    },
    handleRemove(file, fileList) {
      this.fileTemp = null;
    },
    importfxx(obj) {
      let _this = this;
      let inputDOM = this.$refs.inputer;
      // 通过DOM取文件数据

      this.file = event.currentTarget.files[0];

      var rABS = false; //是否将文件读取为二进制字符串
      var f = this.file;

      var reader = new FileReader();
      //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function (f) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var pt = this;
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        reader.onload = function (e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require("xlsx");
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化
              type: "base64",
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary",
            });
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
          console.log("未处理的原始数据如下：");
          console.log(outdata);
          //此处可对数据进行处理
          let arr = [];
          outdata.map((v) => {
            let obj = {};
            // obj.code = v['Code']
            obj.height = v["沿线高程"];
            obj.guancai = v["管材"];
            obj.dia = v["管径"];
            obj.length = v["管长"];
            obj.id = v["管段编号"];
            obj.startcode = v["起点编号"];
            obj.endcode = v["终点编号"];
            arr.push(obj);
          });
          _this.da = arr;
          _this.dalen = arr.length;

          _this.tableData = arr;
          return arr;
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },

    deleteBook(row) {
      const _this = this;
      this.$axios
        .delete("http://localhost:8181/book/deleteById/" + row.id)
        .then(function (resp) {
          _this.$alert("管段" + row.code + "删除成功！", "消息", {
            confirmButtonText: "确定",
            callback: (action) => {
              window.location.reload();
            },
          });
        });
    },
    edit(row) {
      this.$router.push({
        path: "/basicData/updata",
        query: {
          id: row.id,
        },
      });
    },
    addBook() {
      this.$router.push({
        path: "/basicData/adddata",
      });
    },
    page(currentPage) {
      //   const _this = this;
      //   this.$axios
      //     .get("http://localhost:8181/book/findAll/" + (currentPage - 1) + "/6")
      //     .then(function (resp) {
      //       console.log(resp);
      //       _this.tableData = resp.data.content;
      //       _this.pageSize = resp.data.size;
      //       _this.total = resp.data.totalElements;
      //     });
    },
  }, //methods
};
</script>
<style  scoped>
.dataBoxLeft {
  border-right: 1px solid #dcdfe6;
  height: 600px;
  width: 200px;
}
.demoUp {
  height: 50px;
  width: 120px;
  margin: 40px 40px;
  background-color: #e4edf7;
  color: black;
}
.ex-table {
  /* 100%容器宽度减左侧导入按钮区宽度200px */
  width: calc(100% - 200px);
}
.right_main {
  /* 上右下左 */
  padding: 30px 30px 0 30px;
}
</style>
