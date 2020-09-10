<template>
  <div class="density">
    <div id="hotTable" class="hotTable">
      <HotTable ref="testHot" :settings="hotSettings"></HotTable>
    </div>
  </div>
</template>

<script>
import { HotTable } from "@handsontable/vue";
import "handsontable/dist/handsontable.full.css";
export default {
  data: function () {
    return {
      root: "test-hot",

      hotSettings: {
         licenseKey:'non-commercial-and-evaluation',
        data: [
          //数据可以是二维数组，也可以是数组对象
          {temperature: "℃", density:"kg/m3", },
          {temperature: 20, density:800, },
        ],

        // startRows: 11, //行列范围

        startCols: 2,

        minRows: 5, //最小行列

        // maxRows: 20, //最大行列
        fixedColumnsLeft:2, //固定左侧多少列不能水平滚动

        rowHeaders: true, //行表头，可以使布尔值（行序号），可以使字符串（左侧行表头相同显示内容，可以解析html），也可以是数组（左侧行表头单独显示内容）。

        colHeaders: [" 温度", " 密度"], //自定义列表头or 布尔值
         colWidths:[100,100],//[列宽1，列宽2，...]/列宽值

        minSpareCols: 2, //列留白

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

        columns: [
          //添加每一列的数据类型和一些配置
          {  data: 'temperature',type: "numeric" }, //数值

          { data: 'density',
            type: "numeric",

           
          }, //指定的数据格式
        ],

        afterChange: function (changes, source) {
          //数据改变时触发此方法

          console.log(this.getSourceData());
        },

        // manualColumnFreeze: true, //手动固定列

        // manualColumnMove: true, //手动移动列

        // manualRowMove: true, //手动移动行

        // manualColumnResize: true, //手工更改列距

        // manualRowResize: true, //手动更改行距

        // comments: true, //添加注释
        
        // customBorders: [], //添加边框

        // columnSorting: true, //排序

       // stretchH: "all", //根据宽度横向扩展，last:只扩展最后一列，none：默认不扩展
      },
    };
  },

  name: "handsonTable",

  components: {
    HotTable,
  },

  methods: {
    saveData() {
      var examData = this.$refs.testHot.table.getSourceData(); //这里要注意，如果使用this.hotSettings.data 保存表格数据，拖拽完以后数据的顺序将不会更新，因此使用 this.$refs.testHot.table.getData(); 来获取数据，获取的数据格式为二维数组。

      console.log(examData);
    },
  },
};
</script>
<style scoped>

</style>