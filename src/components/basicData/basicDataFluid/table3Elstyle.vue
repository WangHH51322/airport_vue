<template>
  <div>
    <el-table
      :data="tableData"
      align="center"
      style="width:510px"
      resizable="true"
      border="true"
      fit="true"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
    >
      <el-table-column label="属性名" align="center">
        <template slot-scope="scope">
          <span>{{tableSettings[scope.$index].name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="属性值" align="center" width="auto">
        <template slot-scope="scope">
          <!-- 表格配置和表格内容顺序对应 -->
          <el-input
            v-model="scope.row[tableSettings[scope.$index].variablename]"
            size="small"
            v-if="tableSettings[scope.$index].input"
          ></el-input>
          <!-- 对话框 -->
          <div v-if="tableSettings[scope.$index].dialog">
            {{scope.row[tableSettings[scope.$index].variablename]}}
            <el-button size="mini" style="float:right" @click="opendialog(scope.$index, scope.row)">
              <i class="el-icon-edit"></i>
            </el-button>
          </div>
          <!-- 普通选择器 -->
          <el-select
            v-if="tableSettings[scope.$index].selectoptions"
            v-model=" scope.row[tableSettings[scope.$index].variablename]"
            placeholder="请选择"
            size="small"
            style="radius:false"
          >
            <el-option
              v-for="item in tableSettings[scope.$index].selectoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- 级联选择器，控制表格某行显隐 -->
          <el-select
            v-if="tableSettings[scope.$index].cascadeSelectOptions"
            v-model=" scope.row[tableSettings[scope.$index].variablename]"
            placeholder="请选择"
            size="small"
            @visible-change="visibleChange($event,scope.$index,tableSettings[scope.$index].cascadeSelectOptions,scope.row[tableSettings[scope.$index].variablename])"
            @change="changeselect(scope.$index,tableSettings[scope.$index].cascadeSelectOptions,scope.row[tableSettings[scope.$index].variablename])"
          >
            <el-option
              v-for="item in tableSettings[scope.$index].cascadeSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center">
        <template slot-scope="scope">
          <el-select
            @visible-change="getUnit"
            v-if="scope.row.unit"
            v-model=" scope.row.unit"
            size="small"
            placeholder="请选择"
          >
            <el-option
              v-for="item in tableSettings[scope.$index].unitOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <div v-if="dialogcontent.inputTable">
        <div id="hotTable" class="hotTable">
          <HotTable ref="testHot" :settings="hotSettings"></HotTable>
        </div>
      </div>
      <div v-if="dialogcontent.checkbox">
        <el-checkbox-group v-model="checkboxcontent">
          <el-checkbox
            v-for="(item,i) in checkboxoptions"
            :key="i"
            :label="item"
            name="checkboxcontent"
          ></el-checkbox>
        </el-checkbox-group>
        <div style="margin-top:20px">{{checkboxcontent}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="closeNumpop()">确 定</el-button>
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
      dialogVisible: false,
      dialogcontent: {},
      checkboxcontent: [],
      checkboxoptions: [],

      SettingsData: [],
      tableSettings: [],
      tableData: [],
      backData: [ ],

      root: "test-hot",
      hotSettings: {
        licenseKey: "non-commercial-and-evaluation",
        data: [],
        //数据可以是二维数组，也可以是数组对象
        columns: [],
        startRows: 11, //行列范围

        startCols: 2,

        minRows: 5, //最小行列

        maxRows: 20, //最大行列
        fixedColumnsLeft: 2, //固定左侧多少列不能水平滚动

        rowHeaders: true, //行表头，可以使布尔值（行序号），可以使字符串（左侧行表头相同显示内容，可以解析html），也可以是数组（左侧行表头单独显示内容）。

        colHeaders: [], //自定义列表头or 布尔值
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
  created() {
    this.setSettings();
  },
  methods: {
    setSettings() {
      //后端
      let backData = [
        {
          fluidname: "流体一",
        },
        {
          fluidmodel: "const",
          const: [
            {
              densityConst: 222,
              unit: 2,
            },
          ],
          manulpoly: [
            {
              polynomial: [1, 2, 3, 4],
            },
          ],
          autopoly: [
            {
              densityCurveData: [
                [1, 2],
                [2, 3],
              ],
            },
            {
              polynomial: [1, 2, 3, 4],
            },
          ],
          relativDen: [
            {
              relativeDensity: 2,
            },
            {
              Tcoefficient: 4.5,
            },
          ],
        },
        {
          fluidx: 23,
        },
        {
          fluidmodel: "const",
          const: [
            {
              densityConst: 222,
              unit: 2,
            },
          ],
          manulpoly: [
            {
              polynomial: [1, 2, 3, 4],
            },
          ],
          autopoly: [
            {
              densityCurveData: [
                [1, 2],
                [2, 3],
              ],
            },
            {
              polynomial: [1, 2, 3, 4],
            },
          ],
          relativDen: [
            {
              relativeDensity: 2,
            },
            {
              Tcoefficient: 4.5,
            },
          ],
        },
      ];
      //
      let SettingsData = [
        { name: "流体名称", variablename: "fluidname", input: [] },
        {
          name: "密度模型",
          variablename: "fluidmodel",
          cascadeSelectOptions: [
            {
              value: "const",
              label: "常量",
              children: [
                {
                  name: "密度常量值",
                  variablename: "densityConst",
                  unitSettingsId: 1,
                  unitOptions: [
                    {
                      value: 1,
                      label: "kg/m3",
                    },
                    {
                      value: 2,
                      label: "lb/ft3",
                    },
                    {
                      value: 3,
                      label: "slug/ft3",
                    },
                  ],
                  input: [],
                },
              ],
            },
            {
              value: "manulpoly",
              label: "多项式(手动输入)",
              children: [
                {
                  name: "密温曲线系数",
                  variablename: "polynomial",
                  //Options: [" manulpoly", "autopoly"],
                  dialog: [],
                },
              ],
            },
            {
              value: "autopoly",
              label: "多项式(在线拟合)",
              children: [
                {
                  name: "密温曲线拟合数据",
                  variablename: "densityCurveData",
                  //Options: ["autopoly"],
                  dialog: [],
                },
                {
                  name: "密温曲线系数",
                  variablename: "polynomial",
                  //Options: [" manulpoly", "autopoly"],
                  dialog: [],
                },
              ],
            },
            {
              value: "relativDen",
              label: "相对密度公式",
              children: [
                {
                  name: "油品相对密度",
                  variablename: "relativeDensity",
                  input: [],
                  //Options: ["relativDen"],
                },
                {
                  name: "温度系数",
                  variablename: "Tcoefficient",
                  input: [],
                  //Options: ["relativDen"],
                },
              ],
            },
          ],
        },
        { name: "流体**", variablename: "fluidx", input: [] },
        {
          name: "密度模型",
          variablename: "fluidmodel",
          cascadeSelectOptions: [
            {
              value: "const",
              label: "常量",
              children: [
                {
                  name: "密度常量值",
                  variablename: "densityConst",
                  unitSettingsId: 1,
                  unitOptions: [
                    {
                      value: 1,
                      label: "kg/m3",
                    },
                    {
                      value: 2,
                      label: "lb/ft3",
                    },
                    {
                      value: 3,
                      label: "slug/ft3",
                    },
                  ],
                  input: [],
                },
              ],
            },
            {
              value: "manulpoly",
              label: "多项式(手动输入)",
              children: [
                {
                  name: "密温曲线系数",
                  variablename: "polynomial",
                  //Options: [" manulpoly", "autopoly"],
                  dialog: [],
                },
              ],
            },
            {
              value: "autopoly",
              label: "多项式(在线拟合)",
              children: [
                {
                  name: "密温曲线拟合数据",
                  variablename: "densityCurveData",
                  Options: ["autopoly"],
                  dialog: [],
                },
                {
                  name: "密温曲线系数",
                  variablename: "polynomial",
                  Options: [" manulpoly", "autopoly"],
                  dialog: [],
                },
              ],
            },
            {
              value: "relativDen",
              label: "相对密度公式",
              children: [
                {
                  name: "油品相对密度",
                  variablename: "relativeDensity",
                  input: [],
                  Options: ["relativDen"],
                },
                {
                  name: "温度系数",
                  variablename: "Tcoefficient",
                  input: [],
                  Options: ["relativDen"],
                },
              ],
            },
          ],
        },
      ];
      this.setTable(backData, SettingsData);
      //console.log("backData", backData,SettingsData);
    },
    setTable(backData, SettingsData) {
      //设置动态表格数据，把级联框里的选项加进去
      //渲染配置
      let settingsArr = [];
      let tableDataArr = [];
      for (let i = 0; i < SettingsData.length; i++) {
        if (!SettingsData[i].cascadeSelectOptions) {
          //添加配置
          settingsArr.push(SettingsData[i]);
          //添加数据
          tableDataArr.push(backData[i]);
        } else {
          settingsArr.push(SettingsData[i]);
          tableDataArr.push(backData[i]);
          let value = backData[i][SettingsData[i].variablename];
          for (let m = 0; m < backData[i][value].length; m++) {
            tableDataArr.push(backData[i][value][m]);
          }
          for (
            let j = 0;
            j < SettingsData[i].cascadeSelectOptions.length;
            j++
          ) {
            if (SettingsData[i].cascadeSelectOptions[j].value == value) {
              //放入配置
              for (
                let k = 0;
                k < SettingsData[i].cascadeSelectOptions[j].children.length;
                k++
              ) {
                settingsArr.push(
                  SettingsData[i].cascadeSelectOptions[j].children[k]
                );
              }
            }
          }
        }
      }
      //console.log("arr,",settingsArr)
      //console.log("tableDataArr,",tableDataArr)
      this.tableSettings = settingsArr;
      this.tableData = tableDataArr;
      this.SettingsData = SettingsData;
      this.backData = backData;
    },
    getUnit() {
      //console.log("this.tableData", this.tableData);
    },
    visibleChange(callback, index, value, select) {
      //console.log("visibleChange", callback, index, value, select);
      //计算当前级联框子选项长度
      if (callback) {
        let nowL = 0;
        for (let n = 0; n < value.length; n++) {
          if (value[n].value == select) {
            nowL = value[n].children.length;
            console.log("nowL", nowL);
            this.nowL = nowL;
          }
        }
      }
    },
    changeselect(index, value, select) {
      console.log("index", index);
      console.log("select", select);
      console.log("value", value);
      /********************** */

      //动态表格中使用的settings
      let settings = this.tableSettings;
      //后端传来的settings
      let data = this.SettingsData;
     // console.log("data", data);
      //动态表格中的data
      let tdata = this.tableData;
      //所有的data
      let bkdata = this.backData;

     // console.log("bkdata", bkdata);
      let childlength = 0;
      //新表格配置数组
      let arr = [];
      //新表格数据数组
      let backarr = [];

      let children = [];

      for (let i = 0; i < tdata.length; i++) {
        if (i < index) {
          arr.push(settings[i]);
          backarr.push(tdata[i]);
        }
        if (i == index) {
          // console.log(data[i], bkdata[i]);
          //console.log(data[i])
          //先把选择器放入数组
          arr.push(settings[i]);
          backarr.push(tdata[i]);
          //console.log("i==index", arr, backarr);
          //从配置信息中抽出选择器对应的children放入数组arr
          for (let j = 0; j < data[i].cascadeSelectOptions.length; j++) {
            if (data[i].cascadeSelectOptions[j].value === select) {
              children = data[i].cascadeSelectOptions[j].children;
              childlength = children.length;
              for (let k = 0; k < children.length; k++) {
                arr.push(children[k]);
                // console.log("children[k]", children[k].variablename);
              }
              //从后端数据中取出select对应的数据数组，放入backarr数组
              for (let m = 0; m < bkdata[i][select].length; m++) {
                backarr.push(bkdata[i][select][m]);
                //
                // console.log("children[k]",children[k].variablename)
                // console.log("bkdata",bkdata[i][select])
              }
            }
            //  console.log("children", children);
          }
        }
        if (i > index + this.nowL) {
          console.log("this.nowL", this.nowL);
          console.log("i > index", i, index, settings[i], tdata[i]);
          arr.push(settings[i]);
          backarr.push(tdata[i]);
        }
        console.log("newdata", data);
        console.log("newarr", arr);
        console.log("newbackarr", backarr);
      }
      this.tableSettings = arr;
      this.tableData = backarr;
    },
    //*************css******************/
    //表头css
    headerCellStyle() {
      return "text-align:center;";
    },
    //每个小表格css
    cellStyle() {
      return "text-align:center;padding:4px ";
    },
    /*****表格css结束**** */
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    opendialog(index, row) {
      this.row = index;
      this.dialogcontent = row;
      //数字数组
      if (row.inputTable) {
        this.hotSettings.colHeaders = row.inputTable.colHeaders;
        this.hotSettings.columns = row.inputTable.columns;
        this.transformArr(row.value, row.inputTable.colHeaders);
      }
      if (row.checkbox) {
        this.checkboxcontent = row.value;
        this.checkboxoptions = row.checkbox;
      }
      this.dialogVisible = true;
    },
    closeNumpop() {
      if (this.dialogcontent.inputTable) {
        this.transformObj(this.hotSettings.data);
        this.dialogVisible = false;
      }
      if (this.dialogcontent.checkbox) {
        // console.log("this.dialogcontent", this.dialogcontent.value);
        // console.log("this.checkboxcontent", this.checkboxcontent);
        this.dialogcontent.value = this.checkboxcontent;
        this.dialogVisible = false;
      }
    },
    transformObj() {
      let tablearray = Array();
      // let k=this.hotSettings.minSpareRows
      let headers = this.hotSettings.colHeaders;
      let hansondata = this.hotSettings.data;
      console.log("handsontable中数组", this.hotSettings.data);
      for (let index = 0; index < hansondata.length; index++) {
        let obj = hansondata[index];
        let k = true;
        for (let j = 0; j < headers.length; j++) {
          if (obj[headers[j]] == null) {
            k = false;
          }
        }
        if (k) {
          let arr = Array();
          for (let j = 0; j < headers.length; j++) {
            arr[j] = obj[headers[j]];
          }

          tablearray.push(arr);
          console.log(index, this.hotSettings.data[index]);
        }
      }
      //console.log("总表中数组", tablearray);
      this.tableData[this.row].value = tablearray.slice();
      //console.log("总表中数组", this.tableData[this.row].arraydataNum);
    },
    transformArr(value, headers) {
      let handsondata = Array();
      let obj = {};
      //先给数组赋值，再把数组push进handsondata
      for (let index = 0; index < value.length; index++) {
        obj = {};
        for (let i = 0; i < headers.length; i++) {
          obj[headers[i]] = value[index][i];
        }
        handsondata.push(obj);
        //console.log("handsondata[index]", handsondata[index]);
      }
      // console.log("handsondata", handsondata);
      this.hotSettings.data = handsondata.slice();
    },
  },
};
</script>
