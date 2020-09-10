<template>
  <div>
    <div style="display:flex">
      <el-button @click="selectcol()" size="mini" style="margin-bottom:10px">全选</el-button>
      <el-checkbox v-model="visible.name" label="名称" style="margin-left:20px"></el-checkbox>
      <el-checkbox v-model="visible.select" label="下拉框"></el-checkbox>
      <el-checkbox v-model="visible.hover" label="划过弹出按钮(数组数字)"></el-checkbox>
      <el-checkbox v-model="visible.click" label="点击按钮弹出表单(数组文本)"></el-checkbox>
    </div>

    <el-table :data="tableData" style="width: 100%" align="center" resizable="true" border="true">
      <el-table-column
        :label="item.name"
        width="180"
        align="center"
        v-for="(item,index) in tables"
        :key="index"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row[item.variablename]" v-if="item.input"></el-input>
          <el-select
            v-model="scope.row[item.variablename]"
            placeholder="请选择"
            v-if="item.selectOptions"
          >
            <el-option
              v-for="x in item.selectOptions"
              :key="x.value"
              :label="x.label"
              :value="x.value"
            ></el-option>
          </el-select>
          <div v-if="item.dialog">
            {{scope.row[item.variablename]}}
            <el-button size="mini" @click="popDialog(scope.$index, scope.row)" style="float:right">
              <i class="el-icon-edit"></i>
            </el-button>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 数组文本表单 -->
    <el-dialog title="提示" :visible.sync="arrStrdialogVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动性质">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="字符串1" name="type"></el-checkbox>
            <el-checkbox label="字符串2" name="type"></el-checkbox>
            <el-checkbox label="字符串3" name="type"></el-checkbox>
            <el-checkbox label="字符串4" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="arrStrdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="arrStrdialogVisible = false;closepop()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 数字数组表单 -->
    <el-dialog title="提示" :visible.sync="arrNumdialogVisible" width="30%">
      <div id="hotTable" class="hotTable">
        <HotTable ref="testHot" :settings="hotSettings"></HotTable>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="arrNumdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="closeNumpop()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 显示/隐藏表单 -->
    <el-dialog title="提示" :visible.sync="showcolvisible" width="30%">
      <el-checkbox v-model="visible.name" label="名称"></el-checkbox>
      <el-checkbox v-model="visible.select" label="下拉框"></el-checkbox>
      <el-checkbox v-model="visible.hover" label="划过弹出按钮(数组数字)"></el-checkbox>
      <el-checkbox v-model="visible.click" label="点击按钮弹出表单(数组文本)"></el-checkbox>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showcolvisible = false">取 消</el-button>
        <el-button type="primary" @click="showcolvisible = false;">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { HotTable } from "@handsontable/vue";
import "handsontable/dist/handsontable.full.css";
export default {
  data() {
    return {
      arrStrdialogVisible: false,
      arrNumdialogVisible: false,
      showcolvisible: false,
      form: {
        type: [],
      },
      tables: [
        {
          name: "名称",
          input: [],
          variablename: "name",

        },
        {
          name: "下拉框",
          variablename: "type",
          selectOptions: [
            {
              value: "选项1",
              label: "航煤",
            },
            {
              value: "选项2",
              label: "汽油",
            },
            {
              value: "选项3",
              label: "柴油",
            },
            {
              value: "选项4",
              label: "自定义1",
            },
          ],
        },
        {
          name: "划过弹出按钮(数组数字)",

          variablename: "arraydataNum",
          dialog: [
            {
              handsontable: {
                returnVariableName:"densityCurve",
                colHeaders: ["x", "y"],
                columns: [
                  {
                    data: "x",
                    type: "numeric",
                  },
                  {
                    data: "y",
                    type: "numeric",
                  },
                ],
              },
            },
            {
              returnVariableName:"order",
              checkbox: ["字符串1", "字符串2", "字符串3", "字符串4"],
            },
          ],
        },
        {
          name: "点击按钮弹出表单(数组文本)",
          dialog: [
            {
              checkbox: ["字符串1", "字符串2", "字符串3", "字符串4"],
            },
          ],
          variablename: "arraydataString",
          
        },
      ],
      tableData: [
        {
          type: "航煤",
          name: "王小一",
          arraydataNum: [
            [1, 2],
            [2, 3],
          ],
          arraydataString: ["字符串1", "字符串2", "字符串3"],
          dialog: [],
        },
        {
          type: "汽油",
          name: "王小二",
          arraydataNum: [],
          arraydataString: [],
          dialog: [],
        },
        {
          type: "柴油",
          name: "王小三",
          arraydataNum: [],
          arraydataString: [],
          dialog: [],
        },
        {
          type: "自定义1",
          name: "王小虎",
          arraydataNum: [],
          arraydataString: [],
          dialog: [],
        },
      ],
      checkAll: false,
      checkedCities: [],

      isIndeterminate: true,
      showcolform: {
        type: [],
      },
      visible: {
        name: true,
        select: true,
        hover: true,
        click: true,
      },
      options: [
        {
          value: "选项1",
          label: "航煤",
        },
        {
          value: "选项2",
          label: "汽油",
        },
        {
          value: "选项3",
          label: "柴油",
        },
        {
          value: "选项4",
          label: "自定义1",
        },
      ],
      value: "",
      root: "test-hot",
      hotSettings: {
        licenseKey: "non-commercial-and-evaluation",
        data: [],
        //数据可以是二维数组，也可以是数组对象
        columns: [
          {
            data: "x",
            type: "numeric",
          },
          {
            data: "y",
            type: "numeric",
          },
        ],
        startRows: 11, //行列范围

        startCols: 2,

        minRows: 5, //最小行列

        maxRows: 20, //最大行列
        fixedColumnsLeft: 2, //固定左侧多少列不能水平滚动

        rowHeaders: true, //行表头，可以使布尔值（行序号），可以使字符串（左侧行表头相同显示内容，可以解析html），也可以是数组（左侧行表头单独显示内容）。

        colHeaders: ["x", "y"], //自定义列表头or 布尔值
        // colWidths:120, //[列宽1，列宽2，...]/列宽值

        minSpareRows: 2, //行留白

        currentRowClassName: "currentRow", //为选中行添加类名，可以更改样式

        currentColClassName: "currentCol", //为选中列添加类名

        autoWrapRow: true, //自动换行

        contextMenu: {
          //自定义右键菜单，可汉化，默认布尔值

          items: {
            row_above: {
              name: "上方插入一行",
            },

            row_below: {
              name: "下方插入一行",
            },

            hsep1: "---------", //提供分隔线

            remove_row: {
              name: "删除行",
            },
          },
        }, //右键效果

        fillHandle: true, //选中拖拽复制 possible values: true, false, "horizontal", "vertical"

        fixedColumnsLeft: 0, //固定左边列数

        fixedRowsTop: 0, //固定上边列数

        manualColumnFreeze: true, //手动固定列

        manualColumnMove: true, //手动移动列

        manualRowMove: true, //手动移动行

        manualColumnResize: true, //手工更改列距

        manualRowResize: true, //手动更改行距

        // comments: true, //添加注释

        customBorders: [], //添加边框

        // columnSorting: true, //排序

        //stretchH: "all", //根据宽度横向扩展，last:只扩展最后一列，none：默认不扩展
      },
    };
  },
  name: "handsonTable",

  components: {
    HotTable,
  },
  methods: {
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    handleEdit(index, row) {
      this.$router.push({ name: "basicDataFluid" });
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    popDialog(index, row) {
      this.row = index;
      this.form.type = row.arraydataString;
      this.arrStrdialogVisible = true;
    },
    closepop() {
      console.log(this.row, this.tableData[0]);
      this.tableData[this.row].arraydataString = this.form.type;
    },
    openNumDialog(index, row) {
      this.row = index;
      let handsondata = Array();
      // console.log(row.arraydataNum)
      for (let index = 0; index < row.arraydataNum.length; index++) {
        handsondata[index] = Object();
        handsondata[index].x = row.arraydataNum[index][0];
        handsondata[index].y = row.arraydataNum[index][1];
      }
      console.log(handsondata);
      this.hotSettings.data = handsondata.slice();
      //  alert( this.hotSettings.data)
      this.arrNumdialogVisible = true;
    },
    closeNumpop() {
      let tablearray = Array();
      // let k=this.hotSettings.minSpareRows
      console.log("handsontable中数组", this.hotSettings.data);
      for (let index = 0; index < this.hotSettings.data.length; index++) {
        if (
          this.hotSettings.data[index].x != null &&
          this.hotSettings.data[index].y != null
        ) {
          let arr = Array();
          arr[0] = this.hotSettings.data[index].x;
          arr[1] = this.hotSettings.data[index].y;
          tablearray.push(arr);
          console.log(index, this.hotSettings.data[index]);
        }
      }
      //console.log("总表中数组", tablearray);
      this.tableData[this.row].arraydataNum = tablearray.slice();
      console.log("总表中数组", this.tableData[this.row].arraydataNum);
      this.arrNumdialogVisible = false;
    },
    showcol() {
      this.showcolvisible = true;
    },
    closecol() {
      let arr = Array();
      for (let i = 0; i < this.checkedCities.length; i++) {
        this.visible[this.checkedCities[i]] = true;
        console.log(this.checkedCities);
      }
    },
    selectcol() {
      let objs = this.visible;
      for (var i in objs) {
        objs[i] = true;
      }
    },
  },
};
</script>
<style scoped>
.hotTable {
  width: 200px;
  height: 300px;
  overflow: hidden;
}
</style>