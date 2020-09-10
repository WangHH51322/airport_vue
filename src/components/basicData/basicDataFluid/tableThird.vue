<template>
  <div>
    <div id="hotTable3" class="hotTable3">
      <!-- <HotTable ref="testHot" :settings="hotSettings"></HotTable> -->
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>列属性表单</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="unitDialogVisible" width="30%" :before-close="handleClose">
      <span>单位表单</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unitDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="unitDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialog.compositionalVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>组分表单</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.compositionalVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialog.compositionalVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { HotTable } from "@handsontable/vue";
import "handsontable/dist/handsontable.full.css";
import Handsontable from "handsontable";
export default {
  data: function () {
    return {
      root: "test-hot",
      dialogVisible: false,
      unitDialogVisible: false,
      compositionDialogVisible: false,
      row: [],
      dialog: {
        compositionalVisible: false,
      },
    };
  },

  name: "handsonTable",

  components: {
    HotTable,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      var tableContainer = document.getElementById("hotTable3");
      var settings3 = {
        data: this.realdata,
        // [
        //   //数据可以是二维数组，也可以是数组对象

        //   // ["", "kg/m3", "kg/m3"],

        //   // ["fluid1", " 975.0", "[12.0, 27.0]"],
        //   //  {
        //   //   name: "",
        //   //   densityConstant: "kg/m3",
        //   //   manualPolynomial: "",
        //   //   relativeDensity: "",
        //   //   densityString: "kg/m3",
        //   //   temperatureString: "K",
        //   //   fittingDensity: "",
        //   // },

        //   // {
        //   //   name: "fluid1",
        //   //   densityConstant: "975.0",
        //   //   manualPolynomial:" [12.0, 27.0]",
        //   //   relativeDensity: "",
        //   //   densityString: "[985.0, 986.0, 987.0, 988.0]",
        //   //   temperatureString: "[20.0, 25.0, 26.0, 28.0]",
        //   //   fittingDensity: "",
        //   // },
        // ],
        rowHeaders: true,
        colHeaders: ["属性名称", "属性值", "单位"],

        columns: [
          {
            data: "name", // 此设置标识，数组对象数据格式时的列字段
          },
          {
            data: "value", // 此设置标识，数组对象数据格式时的列字段
          },
          {
            data: "unit", // 此设置标识，数组对象数据格式时的列字段
          },
        ],
        cell: this.row,

        
        contextMenu: {
          items: {
            row_above: {
              name: "上方插入一行",
            },
            row_below: {
              name: "下方插入一行",
            },
            col_right: {
              name: "添加列",
              callback: (action) => {
                this.insertCol();
              },
            },
            edit: {
              // Own custom option
              name: function () {
                // `name` can be a string or a function
                return "<b>编辑流体</b>"; // Name can contain HTML
              },

              callback: (action) => {
                this.$router.push({ name: "basicDataFluid" });
              },
              // function (key, selection, clickEvent) {
              //   // Callback for specific option
              //   console.log()

              // },
            },
          },
        },
        afterBeginEditing: (action) => {
          this.Validation();
        },
      };
      this.hotTable = new Handsontable(tableContainer, settings3);

      this.hotTable.validateRows([1], (valid) => {
        if (valid) {
          // ... code for validated rows
        }
      });
    },
    Validation() {
      let selectedCell = this.hotTable.getSelectedRange()[0].highlight;
      let row = selectedCell.row;
      let col = selectedCell.col;
      if (col == 1) {
        //  console.log(this.table[row][3])
        if (this.table[row][3] === "dialog") {
          this.dialog[this.table[row][4]] = true;
        }
      }
      if (col == 2) {
        //  console.log(this.table[row][3])

        this.unitDialogVisible = true;
      }

      console.log(selectedCell.row);
    },
    saveData() {
      var examData = this.$refs.testHot.table.getData(); //这里要注意，如果使用this.hotSettings.data 保存表格数据，拖拽完以后数据的顺序将不会更新，因此使用 this.$refs.testHot.table.getData(); 来获取数据，获取的数据格式为二维数组。

      //console.log(examData);
    },
    insertCol() {
      // console.log("insertCol", this.hotTable.getSelectedRange());
      this.dialogVisible = true;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    //设置表格data
    setData(table) {
      let thisdata = [];
      for (let i = 0; i < table.length; i++) {
        //console.log(table);
        //渲染数据
        let o = Object();
        o.name = table[i][0];
        o.value = table[i][1];
        o.unit = table[i][2];
        thisdata[i] = o;
        //设置表格中间列render形式，如'text','numeric'等
        if (this.table[i][3] == "dropdown") {
          let renderrow = Object();
          renderrow.row = i;
          renderrow.col = 1;
          renderrow.editor = this.table[i][3];
          renderrow.source = eval('(' + this.table[i][4] + ')')
           // console.log("renderrow",this.table[i][4].replace("\"", ""))
          this.row.push(renderrow)//JSON.parse(this.table[i][4]);
        }
        console.log("row",this.row)

      }
      console.log(thisdata);
      this.realdata = thisdata;
    },
  },
  created() {
   this.table = [
      ["name", "fluid1", "", "text"],
      ["densityConstant", "975.0", "kg/m3", "text"],
      ["type", "航煤", "", "dropdown","['航煤', '汽油', '柴油', '自定义']"],
      [
        "composition",
        "['a':'组分1','b':'组分2','c':'组分3']",
        "",
        "dialog",
        "compositionalVisible",
      ],
    ],
     
    
    this.row = [];
     this.setData(this.table);
  },
};
</script>
<style scoped>
.hotTable3 {
  height: 800px;
  width: 100%;
}
</style>
// startRows: 11,//行列范围

// startCols: 6,

// minRows: 5,  //最小行列

// minCols: 5,

// maxRows: 20,  //最大行列

// maxCols: 20,

// rowHeaders: true,//行表头，可以使布尔值（行序号），可以使字符串（左侧行表头相同显示内容，可以解析html），也可以是数组（左侧行表头单独显示内容）。

// colHeaders: true,//自定义列表头or 布尔值

// minSpareCols: 2, //列留白

// minSpareRows: 2,//行留白

// currentRowClassName: 'currentRow', //为选中行添加类名，可以更改样式

// currentColClassName: 'currentCol',//为选中列添加类名

// autoWrapRow: true, //自动换行

// contextMenu: {   //自定义右键菜单，可汉化，默认布尔值

//   items: {

//     "row_above": {

//       name:'上方插入一行'

//     },

//     "row_below": {

//       name:'下方插入一行'

//     },

//     "col_left": {

//       name:'左方插入列'

//     },

//     "col_right": {

//       name:'右方插入列'

//     },

//     "hsep1": "---------", //提供分隔线

//     "remove_row": {

//       name: '删除行',

//     },

//     "remove_col": {

//       name: '删除列',

//     },

//     "make_read_only": {

//       name: '只读',

//     },

//     "borders": {

//       name: '表格线',

//     },

//     "commentsAddEdit": {

//       name: '添加备注',

//     },

//     "commentsRemove": {

//       name: '取消备注',

//     },

//     "freeze_column": {

//       name: '固定列',

//     },

//     "unfreeze_column": {

//       name: '取消列固定',

//     },

//     "hsep2": "---------",

//   }

// },//右键效果

// fillHandle: true, //选中拖拽复制 possible values: true, false, "horizontal", "vertical"

// fixedColumnsLeft: 0,//固定左边列数

// fixedRowsTop: 0,//固定上边列数

// mergeCells: [   //合并

//   {row: 1, col: 1, rowspan: 3, colspan: 3},  //指定合并，从（1,1）开始行3列3合并成一格

//   {row: 3, col: 4, rowspan: 2, colspan: 2}

// ],

// columns: [     //添加每一列的数据类型和一些配置

//   {

//     //data: 'title', 此设置标识，数组对象数据格式时的列字段

//     type: 'date',   //时间格式

//     dateFormat: 'YYYYMMDD',

//     correctFormat: true,

//     defaultDate: '19000101'

//   },

//   {

//     type: 'dropdown', //下拉选择

//     source: ['BMW', 'Chrysler', 'Nissan', 'Suzuki', 'Toyota', 'Volvo'],

//     strict: false   //是否严格匹配

//   },

//   {type: 'numeric'},  //数值

//   {type: 'numeric',

//     readOnly: true  //设置只读

//   },

//   { type: 'numeric',

//     format: '$ 0,0.00'},  //指定的数据格式

//   {type: 'checkbox'},  //多选框

// ],

// afterChange: function (changes, source) { //数据改变时触发此方法

//   console.log(this.getData())

// },

// manualColumnFreeze: true, //手动固定列

// manualColumnMove: true, //手动移动列

// manualRowMove: true,   //手动移动行

// manualColumnResize: true,//手工更改列距

// manualRowResize: true,//手动更改行距

// comments: true, //添加注释

// cell: [

//   {row: 1, col: 1, comment: {value: 'this is test'}},

// ],

// customBorders:[],//添加边框

// columnSorting: true,//排序

// stretchH: 'all',//根据宽度横向扩展，last:只扩展最后一列，none：默认不扩展

// export default {
//   name: "handsonTable",
//   components: {
//     HotTable,
//   },
//   data() {
//     return {
//       root: "test-hot",

//       hotSettings: {
//          licenseKey:'non-commercial-and-evaluation',
//         data: [

//          // 数据可以是二维数组，也可以是数组对象
//             ['20080101', 10, 11, 12, 13,true],
//             ['20090101', 20, 11, 14, 13,true],
//             ['20010101', 30, 15, 12, 13,true],
//             ['20010101', 32, 213, 21, 312,true],
//             ['20010201', 32, 213, 21, 312,true],
//             ['20010301', 32, 213, 21, 312,true],
//             ['20010401', 32, 213, 21, 312,true],
//             ['20010501', 32, 213, 21, 312,true],
//             ['20010601', 32, 213, 21, 312,true]
//         ],

//         // startRows: 11, //行列范围

//         // startCols: 6,

//         // minRows: 5, //最小行列

//         // minCols: 5,

//         // maxRows: 20, //最大行列

//         // maxCols: 20,

//         rowHeaders: true, //行表头，可以使布尔值（行序号），可以使字符串（左侧行表头相同显示内容，可以解析html），也可以是数组（左侧行表头单独显示内容）。
//         contextMenu: true,
//         // colHeaders: [
//         //   "名称",
//         //   "类别",
//         //   "密度",
//         //   "温度",
//         //   "密度多项式系数",
//         //   "相对密度公式系数",
//         // ], //自定义列表头or 布尔值

//          minSpareCols: 2, //列留白

//          minSpareRows: 2, //行留白

//         currentRowClassName: "currentRow", //为选中行添加类名，可以更改样式

//         currentColClassName: "currentCol", //为选中列添加类名

//         autoWrapRow: true, //自动换行
//         // contextMenu: {
//         //   //自定义右键菜单，可汉化，默认布尔值

//         //   items: {
//         //     row_above: {
//         //       name: "上方插入一行",
//         //     },

//         //     row_below: {
//         //       name: "下方插入一行",
//         //     },

//         //     col_left: {
//         //       name: "左方插入列",
//         //     },

//         //     col_right: {
//         //       name: "右方插入列",
//         //     },

//         //     hsep1: "---------", //提供分隔线

//         //     remove_row: {
//         //       name: "删除行",
//         //     },

//         //     remove_col: {
//         //       name: "删除列",
//         //     },

//         //     make_read_only: {
//         //       name: "只读",
//         //     },

//         //     borders: {
//         //       name: "表格线",
//         //     },

//         //     commentsAddEdit: {
//         //       name: "添加备注",
//         //     },

//         //     commentsRemove: {
//         //       name: "取消备注",
//         //     },

//         //     freeze_column: {
//         //       name: "固定列",
//         //     },

//         //     unfreeze_column: {
//         //       name: "取消列固定",
//         //     },

//         //     hsep2: "---------",
//         //   },
//         // }, //右键效果

//         fillHandle: true, //选中拖拽复制 possible values: true, false, "horizontal", "vertical"

//         fixedColumnsLeft: 0, //固定左边列数

//         fixedRowsTop: 0, //固定上边列数

//         columns: [
//           //添加每一列的数据类型和一些配置

//           { type: "numeric" },

//           {
//             data: "type",
//             type: "dropdown", //下拉选择

//             source: ["汽油", "柴油", "航煤", "原油"],

//             strict: false, //是否严格匹配
//           }, { type: "numeric" },

//           { type: "numeric" }, //数值

//           {
//             type: "numeric",

//             readOnly: true, //设置只读
//           },

//           {
//             type: "numeric",

//             format: "$ 0,0.00",
//           }, //指定的数据格式

//         ],
//         //两层标题
//         // nestedHeaders: [
//         //   [
//         //     "名称",
//         //     "类别",
//         //     "密度",
//         //     "温度",
//         //     "密度多项式系数",
//         //     "相对密度公式系数",
//         //   ],
//         // ],
//         //
//         beforeChange: function (changes) {
//           //   //alert(0)
//           //   var instance = this;
//           //   var ilen = changes.length;
//           //   var clen = instance.countCols();
//           //   var rowColumnSeen = {};
//           //   var rowsToFill = {};
//           //   console.log("changes", changes);
//           //   for (let i = 0; i < ilen; i++) {
//           //     // if oldVal is empty
//           //     alert(1)
//           //     console.log("i", changes[i]);
//           //     console.log(changes[i][2]);
//           //     if (changes[i][2] === null && changes[i][3] !== null) {
//           //         alert(2)
//           //       if (this.isEmptyRow(instance, changes[i][0])) {
//           //         console.log("isEmptyRow", isEmptyRow);
//           //         // add this row/col combination to cache so it will not be overwritten by template
//           //         rowColumnSeen[changes[i][0] + "/" + changes[i][1]] = true;
//           //         rowsToFill[changes[i][0]] = true;
//           //       }
//           //     }
//           //   }
//           //   for (var r in rowsToFill) {
//           //     if (rowsToFill.hasOwnProperty(r)) {
//           //       for (let c = 0; c < clen; c++) {
//           //         // if it is not provided by user in this change set, take value from template
//           //         if (!rowColumnSeen[r + "/" + c]) {
//           //           changes.push([r, c, null, this.tpl[c]]);
//           //         }
//           //       }
//           //     }
//           //   }
//         },
//         afterChange: function (changes, source) {
//           //数据改变时触发此方法
//           //console.log("this.getData()", this);
//         },

//         manualColumnFreeze: true, //手动固定列

//         manualColumnMove: true, //手动移动列

//         manualRowMove: true, //手动移动行

//         manualColumnResize: true, //手工更改列距

//         manualRowResize: true, //手动更改行距

//         comments: true, //添加注释

//         cell: [{ row: 1, col: 1, comment: { value: "this is test" } }],

//         customBorders: [], //添加边框

//         columnSorting: true, //排序

//         stretchH: "all", //根据宽度横向扩展，last:只扩展最后一列，none：默认不扩展
//       },
//     };
//   },

//   methods: {
//     saveData() {
//       var examData = this.$refs.testHot.table.getData(); //这里要注意，如果使用this.hotSettings.data 保存表格数据，拖拽完以后数据的顺序将不会更新，因此使用 this.$refs.testHot.table.getData(); 来获取数据，获取的数据格式为二维数组。

//       //console.log(examData);
//     },
//     isEmptyRow(instance, row) {
//       var rowData = instance.countRows();
//       console.log("rowData", rowData);
//       for (var i = 0, ilen = rowData.length; i < ilen; i++) {
//         if (rowData[i] !== null) {
//           return false;
//         }
//       }

//       return true;
//     },
//     defaultValueRenderer(instance, td, row, col, prop, value, cellProperties) {
//       var args = arguments;

//       if (args[5] === null && isEmptyRow(instance, row)) {
//         args[5] = this.tpl[col];
//         td.style.color = "#999";
//       } else {
//         td.style.color = "";
//       }
//       Handsontable.renderers.TextRenderer.apply(this, args);
//     },
//   },
// };


