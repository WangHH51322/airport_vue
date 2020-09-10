<template>
  <div>
    <div>
      <el-button-group class="flow-top-tool-group">
        <el-button
          class="flow-top-tool"
          type="text"
          icon="el-icon-zoom-in"
          size="small"
          @click.native="zoomIn"
        ></el-button>
        <el-button
          class="flow-top-tool"
          type="text"
          icon="el-icon-zoom-out"
          size="small"
          @click.native="zoomOut"
        ></el-button>
        <el-button
          class="flow-top-tool"
          type="text"
          icon="el-icon-back"
          size="small"
          @click.native="undo"
        ></el-button>
        <el-button
          class="flow-top-tool"
          type="text"
          icon="el-icon-right"
          size="small"
          @click.native="redo"
        ></el-button>
        <el-button
          class="flow-top-tool"
          type="text"
          icon="el-icon-delete"
          size="small"
          @click="selectCell"
        ></el-button>
        <el-button class="flow-top-tool" type="text" size="small" @click.native="zoomToFit">自适应窗口</el-button>
        <el-button
          class="flow-top-tool"
          type="text"
          size="small"
          @click.native="zoomToSelection"
        >选中部分适应窗口</el-button>
        <el-button class="flow-top-tool" type="text" size="small" @click.native="select">选择</el-button>
        <el-button class="flow-top-tool" type="text" size="small" @click.native="pan">拖拽</el-button>
        <el-button class="flow-top-tool" type="text" @click="editDialog = true;openDrawer()">编辑</el-button>
        <!-- 打开管道表单 -->
        <el-drawer
          :visible.sync="editDialog"
          direction="ltr"
          custom-class="demo-drawer"
          ref="drawer"
          style="width:75vw"
        >
          <h1 slot="title" style="text-align:center;">编辑节点参数</h1>
          <div class="demo-drawer__content">
            <!-- 设置管道表单关联的model，验证rules -->
            <el-form
              :model="form"
              :rules="rules"
              ref="form"
              label-width="140px"
              class="demo-ruleForm"
              style="padding:0px 20px 30px 20px"
            >
              <h2 style="text-align:center">在图中的基本信息：</h2>
              <br />
              <el-form-item label="节点ID：" :label-width="formLabelWidth">{{form.nodeId}}</el-form-item>
              <el-form-item label="节点类型：" :label-width="formLabelWidth">{{form.nodeType}}</el-form-item>
              <h2 style="text-align:center">节点参数：</h2>
              <br />
              <el-form-item label="节点编号：" :label-width="formLabelWidth">
                <el-input v-model="form.nodeNumber" autocomplete="off"></el-input>
              </el-form-item>

              <div v-if="showPipeForm">
                <el-form-item label="管段长度(m)：" :label-width="formLabelWidth" prop="pipeLength">
                  <el-input v-model.number="form.pipeLength" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="外径(mm)：" :label-width="formLabelWidth" prop="outsideDiameter">
                  <el-input v-model.number="form.outsideDiameter" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="壁厚(mm)：" :label-width="formLabelWidth">
                  <el-input v-model="form.wallThickness" autocomplete="off"></el-input>
                </el-form-item>
              </div>
            </el-form>

            <div class="demo-drawer__footer" style="text-align:center;padding:30px;">
              <el-button @click="cancelForm">取 消</el-button>
              <el-button
                type="primary"
                @click="$refs.drawer.closeDrawer();submitForm('form')"
                :loading="loading"
              >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
            </div>
          </div>
        </el-drawer>

        <!--上方工具栏其余按钮 -->
        <el-button class="flow-top-tool" type="text" size="small" @click.native="autoLayout">有向无环布局</el-button>
        <el-button
          class="flow-top-tool"
          :style="openOrthogonal?mapStyle:''"
          type="text"
          size="small"
          @click.native="openOrthogonal=!openOrthogonal;orthogonal(openOrthogonal)"
        >正交绘图</el-button>
        <el-button class="flow-top-tool" type="text" size="small" @click.native="saveGraph()">保存</el-button>
        <el-button
          class="flow-top-tool"
          type="text"
          size="small"
          v-show="showConnectionStations"
          @click.native="newStations();"
        >进入站场</el-button>
        <el-button
          class="flow-top-tool"
          type="text"
          size="small"
          v-show="showConnectionStations"
          @click="dialogFormVisible = true;findConnectionStations()"
        >连接站场内设备</el-button>
        <!-- 弹出框 -->
        <el-dialog title="连接站场内设备" :visible.sync="dialogFormVisible" width="400px" :center="true">
          <el-form :model="stationsConnectionForm" style="width">
            <el-form-item label="设备ID：" :label-width="stationsformLabelWidth">{{nodeId}}</el-form-item>
            <el-form-item label="设备类型：" :label-width="stationsformLabelWidth">{{nodeType}}</el-form-item>
            <el-form-item label="站场名称：" :label-width="stationsformLabelWidth">
              <el-select
                value-key="id"
                v-model="stationsConnectionForm.selectedStations"
                placeholder="请选择要连接的站场"
                @change="getDeviceInStations(stationsConnectionForm.selectedStations)"
              >
                <el-option
                  v-for="(item,k) in totalStationsCount"
                  :key="k"
                  :label="item.layerName"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备ID：" :label-width="stationsformLabelWidth">
              <el-select
                value-key="id"
                v-model="stationsConnectionForm.connectedDevice"
                placeholder="请选择站场内的设备"
              >
                <el-option
                  v-for="device in deviceInStations"
                  :key="device.id"
                  :label="device.id"
                  :value="device"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="dialogFormVisible = false;getStationsConnectionForm()"
            >确 定</el-button>
          </div>
        </el-dialog>
        <!-- 弹出框结束 -->
        <!--  -->
        <!--  -->

        <el-button
          class="flow-top-tool"
          type="text"
          size="small"
          v-show="!showConnectionStations"
          @click.native="outStations();showConnectionStations=true"
        >退出站场</el-button>
      </el-button-group>
    </div>
    <!-- 右侧绘图板区域 -->
    <div class="m_graph_container" tabindex>
      <div id="container" ref="container" />
    </div>
    <!-- 左侧图形工具栏 -->
    <div id="sidebar" class="sidebar">
      <el-collapse>
        <el-collapse-item title="常用" name="常用">
          <div id="toolbar-basic" class="toolbar-basic" />
        </el-collapse-item>
        <el-collapse-item title="其他" name="其他">
          <div id="toolbar-else" class="toolbar-else" />
        </el-collapse-item>
      </el-collapse>
      <!-- 工具栏下方导入导出按钮 -->
      <div style="display:flex;padding:5px;">
        <!-- <ElButton type="primary" size="mini" class="btns" @click.native="getTableData">导入</ElButton> -->
        <input @change="readFile" ref="importInput" class="hide" type="file" />
        <ElButton type="warning" size="mini" class="text" @click="importFile">导入XML</ElButton>
        <ElButton type="success" size="mini" class="text" @click="exportXML">导出XML</ElButton>
      </div>
      <div style="display:flex;padding:5px;">
        <input @change="readJson" ref="importJson" class="hide" type="file" />
        <ElButton type="warning" size="mini" class="text" @click="importJson">导入JSON</ElButton>
        <ElButton type="success" size="mini" class="text" @click="xmlToJson">导出JSON</ElButton>
      </div>
      <div style="display:flex;padding:5px;">
        <input @change="readJson1" ref="importJson1" class="hide" type="file" />
        <ElButton
          type="primary"
          size="mini"
          class="text"
          @click="importJson1"
          style="display:block"
        >导入节点</ElButton>
        <input @change="readJson2" ref="importJson2" class="hide" type="file" />
        <ElButton
          type="primary"
          size="mini"
          class="text"
          @click="importJson2"
          style="display:block"
        >导入连接关系</ElButton>
      </div>
      <!-- 打印选中图形 -->
      <div style="display:flex;padding:5px;">
        <ElButton type="warning" size="mini" class="text" @click="cslGraph">选中图形</ElButton>
        <ElButton type="success" size="mini" class="text" @click="cslModel">模型</ElButton>
      </div>
    </div>
  </div>
</template>
 
<script>
import FileSaver from "file-saver";
import mxgraph from "@/components/graph/index";
import { mapState } from "vuex";
import { mapMutations } from "vuex";
const {
  mxToolbar,
  mxGraphModel,
  mxGraph,
  mxCell,
  mxGeometry,
  mxEvent,
  mxUtils,
  mxCodec,
  mxUndoManager,
  mxKeyHandler,
  mxClipboard,
  mxImage,
  mxConstants,
  mxFastOrganicLayout,
  mxCompactTreeLayout,
  mxCircleLayout,
  mxParallelEdgeLayout,
  mxStackLayout,
  mxHierarchicalLayout,
  mxSwimlaneLayout,
  mxConnectionConstraint,
  mxPoint,
  mxRectangle, //
  mxRubberband,
  mxEdgeHandler,
  mxShape,
  mxCellState,
  mxCellRenderer,
  mxActor,
  mxGraphHandler,
  mxConstraintHandler,
  mxVertexHandler,
  mxConnectionHandler,
  mxGuide,
  mxDragSource,
  mxHierarchicalEdgeStyle,
  mxCoordinateAssignment,
} = mxgraph;
const path = require("path");

export default {
  name: "editor",
  data() {
    var checkAge = (rule, value, callback) => {
      setTimeout(() => {
        if (value != null && !Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value != null && value <= 0) {
            callback(new Error("请输入正数"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      model: null,
      graph: null,
      toolbar: null,
      color: "",
      requestInfo: {},
      garageEdit: {},
      excelFlag: false,
      uploadVisible: false,
      sidebar: null,
      palettes: {},
      rubberBand: null,
      valveURL: require("@/images/tools/valve.gif"),
      reliefValveURL: require("@/images/tools/reliefValve.gif"),

      regulatorValveURL: require("@/images/tools/regulatorValve.gif"),
      checkValveURL: require("@/images/tools/checkValve.gif"),
      GenericCompressorURL: require("@/images/tools/GenericCompressor.gif"),
      c_compressorURL: require("@/images/tools/c-compressor.gif"),
      oil_tankURL: require("@/images/tools/oil tank.gif"),
      junctionURL: require("@/images/tools/junction.gif"),
      supplyURL: require("@/images/tools/supply.gif"),
      deliveryURL: require("@/images/tools/delivery.gif"),
      pipeURL: require("@/images/tools/pipe.gif"),
      pumpURL: require("@/images/tools/pump.gif"),
      cpumpURL: require("@/images/tools/c-pump.gif"),
      rpumpURL: require("@/images/tools/r-pump.gif"),
      leakURL: require("@/images/tools/leak.gif"),
      connectNodeUrl: require("../../../public/mxgraph/images/dot.gif"),
      knotJson: [],
      knotType: [],
      junctionNum: 0,
      sinkNum: 0,
      flowJson: [],
      graphPipe: [],
      graphPipeType: "",
      x1: "",
      x2: "",
      x0: "",
      y0: "",
      x12: "",
      y12: "",
      startNum: "",
      endNum: "",
      graphVertex: [],
      knotState: 0,
      flowState: 0,

      /**************正交绘图************* */
      openOrthogonal: false,
      //正交按钮颜色
      mapStyle: "background:rgba(255,97,44,1);color:rgba(255,255,255,1);",
      /***************各种节点参数******************* */
      //管道
      pipeParameters: {
        pipe_length: {
          name: "管段长度",
          value: null,
          unit: "m",
        },
        outside_diameter: {
          name: "管段外径",
          value: null,
          unit: "mm",
        },
        wall_thickness: {
          name: "壁厚",
          value: null,
          unit: "mm",
        },
      },
      //普通阀
      valveParameters: {
        node_number: null,
        CRV_O: null,
        CRV_C: null,
        CVC: null,
        CVO: null,
      },
      //站场
      stationParameters: {},
      /*******表单********* */
      table: false,
      editDialog: false,
      loading: false,
      showPipeForm: false,
      showStationForm: false,
      /****管道表单**** */
      form: {
        nodeId: "",
        nodeType: "",
        nodeNumber: "",
        pipeLength: null,
        outsideDiameter: null,
        wallThickness: null,
      },
      //管道需要验证的表单
      rules: {
        pipeLength: [
          { type: "number", message: "请输入数字", trigger: "blur" },
        ],
        outsideDiameter: [{ validator: checkAge, trigger: "blur" }],
      },

      /***************** */
      formLabelWidth: "120px",
      timer: null,
      /**********站场图层************ */
      stationsLayer: [],
      layers: [],
      showConnectionStations: true,
      /*************站场连接点表单************** */
      dialogFormVisible: false,
      stationsConnectionForm: {
        //选中的设备
        selectedCells: {},
        //要连接的站场
        selectedStations: {},
        //选中的设备
        connectedDevice: {},
      },
      stationsformLabelWidth: "120px",
      //所有站场
      totalStationsCount: [],
      //要连接站场内的所有设备
      deviceInStations: [],
      /**************************** */
    };
  },
  // created() {
  //   this.$axios({
  //     method: "get",
  //     url: "/validityCheck/editor",
  //     data: { name: "editor" },
  //   }).then(function (response) {
  //     this.preloadData = response.data;
  //   });
  // },
  computed: {
    ...mapState("graphInfo", ["nodeData"]),
    nodeId() {
      return this.nodeData.id;
    },
    nodeType() {
      return this.nodeData.type;
    },
    nodeNumber() {
      return this.nodeData.nodeNumber;
    },
    source() {
      return this.nodeData.source;
    },
    target() {
      return this.nodeData.target;
    },
    parameters() {
      return this.nodeData.parameters;
    },
  },
  watch: {
    knotState(val) {
      //alert("knotStateChange");
      if (this.knotState != 0 && this.flowState != 0) {
        alert("正在生成graph");
        this.getTableData();
        alert("graph完成！");
        this.knotState = 0;
        this.flowState = 0;
      }
    },
    flowState(val) {
      //alert("flowStateChange");
      if (this.knotState != 0 && this.flowState != 0) {
        alert("正在生成graph");
        alert(0);
        this.getTableData();
        alert("graph完成！");
        alert(1);
        this.knotState = 0;
        this.flowState = 0;
      }
    },
  },
  mounted() {
    this.init();
    this.preload();
  },
  beforeDestroy() {
    this.graph.destroy();
  },
  methods: {
    saveGraph() {
      var xml = this.getXML();
      this.$axios({
        method: "put",
        url: "/editor/saveGraph",
        data: { xml },
      })
        .then(function (response) {
          if (response.data.message == "success") {
            alert("保存成功");
          }
        })
        .catch(function (error) {
          console.log(error);
          alert("信息保存失败");
        });
    },
    preload() {
      var xml = this.preloadData;
      this.graph.getModel().beginUpdate();
      try {
        const doc = mxUtils.parseXml(xml);
        const dec = new mxCodec(doc);
        var node = doc.documentElement;
        dec.decode(node, this.graph.getModel());
      } finally {
        this.graph.getModel().endUpdate();
      }
    },

    /*********************设置进站/出站连接点**************************** */
    //选择站场
    findConnectionStations() {
      this.stationsConnectionForm.connectedDevice = {};
      this.stationsConnectionForm.selectedStations = [];
      let selectedCell = this.graph.getSelectionCells()[0];
      this.totalStationsCount = [];
      let totalStationsCount = [];
      for (let i = 0; i < this.stationsLayer.length; i++) {
        if (this.stationsLayer[i] != null) {
          totalStationsCount.push(this.stationsLayer[i]);
        }
      }
      this.totalStationsCount = totalStationsCount;
      this.stationsConnectionForm.selectedCells = selectedCell;
      //console.log(this.totalStationsCount)
    },
    //查找站场内的设备
    getDeviceInStations(selectedStations) {
      this.deviceInStations = [];
      let deviceInStations = [];
      if (selectedStations.children) {
        if (selectedStations.children.length > 0) {
          for (let i = 0; i < selectedStations.children.length; i++) {
            deviceInStations.push(selectedStations.children[i]);
          }
          this.deviceInStations = deviceInStations;
          console.log(this.deviceInStations);
        }
      }

      // console.log(deviceInStations)
    },
    //表单提交后，打印表单
    getStationsConnectionForm() {
      // console.log(this.stationsConnectionForm);
      const parent = this.graph.getDefaultParent();
      this.graph.getModel().beginUpdate();
      try {
        var e1 = this.graph.insertEdge(
          parent,
          null,
          "",
          this.stationsConnectionForm.connectedDevice,
          this.stationsConnectionForm.selectedCells,
          "strokeColor=#0C0C0C"
        );
      } finally {
        this.graph.getModel().endUpdate();
      }
    },
    /******************退出站场********************************* */
    outStations() {
      var currentLayer = this.graph.getDefaultParent();
      //console.log("currentLayer", currentLayer);
      this.showLayerInfo(this.fontLayer);
      //console.log("退出站场this.fontLayer", this.fontLayer);
      this.model.setVisible(currentLayer, false);
      this.graph.setDefaultParent(this.fontLayer);
      this.model.setVisible(this.fontLayer, true);
    },
    /******************进入站场************************* */
    newStations() {
      if (
        this.graph.getSelectionCells()[0] != null &&
        this.graph.getSelectionCells()[0].info.typeName === "站场"
      ) {
        this.showConnectionStations = false;
        this.fontLayer = this.graph.getDefaultParent();
        //console.log("进入站场前", this.fontLayer);
        //顺序很重要！
        this.stationsCell = this.graph.getSelectionCells()[0];
        //console.log(id)
        //如果该站场的图层已经被创建，就直接进入图层
        if (this.stationsLayer[this.stationsCell.id] != null) {
          //如果在上一层给了或者改了站场的名字，就随时把名字赋给当前图层
          if (this.stationsCell.value != null) {
            this.stationsLayer[
              this.stationsCell.id
            ].layerName = this.stationsCell.value;
            //将当前图层的信息传给vuex在右侧展示
            this.showLayerInfo(this.stationsLayer[this.stationsCell.id]);
          }
          //将当前图层父节点换成进入的站场图层，拖拽的图形会自动到这个图层
          this.graph.setDefaultParent(this.stationsLayer[this.stationsCell.id]);
          //当前站场图层设为可见
          this.model.setVisible(this.stationsLayer[this.stationsCell.id], true);
          //前一图层不可见
          this.model.setVisible(this.fontLayer, false);
          //如果图层没被创建，就新建图层
        } else if (this.stationsLayer[this.stationsCell.id] == null) {
          this.stationsLayer[this.stationsCell.id] = this.graph.addCell(
            new mxCell(),
            this.graph.model.root
          );
          //将当前图层id,父图层存入站场图层数列？？
          this.stationsLayer[
            this.stationsCell.id
          ].layerId = this.stationsCell.id;
          this.stationsLayer[this.stationsCell.id].parentLayer = this.fontLayer;
          //如果站场图形有值，将值赋给站场图层对象的一个变量
          // if (this.stationsCell.value != null) {
          this.stationsLayer[
            this.stationsCell.id
          ].layerName = this.stationsCell.value;
          //将当前图层设置为父图层
          this.graph.setDefaultParent(this.stationsLayer[this.stationsCell.id]);
          // }
          //将新建图层的信息传给vuex
          this.showLayerInfo(this.stationsLayer[this.stationsCell.id]);
          //最前图层不可见，当前站场图层可见
          this.model.setVisible(this.fontLayer, false);
          this.model.setVisible(this.stationsLayer[this.stationsCell.id], true);

          //console.log("进入站场后", this.stationsLayer[this.stationsCell.id]);
        }
      }
    },

    //传入vuex graphInfo中的["SEL_NODEINFO"]，
    ...mapMutations("graphInfo", ["SEL_NODEINFO", "LAYER_INFO"]),
    setNodeInfo(nodeType, nodeId, source, target, parameters, nodeNumber) {
      console.log(nodeNumber);
      this.SEL_NODEINFO({
        nodeType,
        nodeId,
        source,
        target,
        parameters,
        nodeNumber,
      });
    },
    //展示图层信息
    showLayerInfo(layer) {
      this.LAYER_INFO({
        layer,
      });
    },

    /****************打开表单******************** */
    openDrawer() {
      if (this.graph.getSelectionCells().length != 0) {
        let cells = this.graph.getSelectionCells()[0];
        this.form.nodeId = cells.id;
        this.form.nodeType = cells.info.typeName;

        this.form.nodeNumber = cells.info.nodeNumber;

        if (cells.info.typeName === "管道") {
          this.showPipeForm = true;
          this.form.pipeLength = cells.info.parameters.pipe_length.value;
          this.form.outsideDiameter =
            cells.info.parameters.outside_diameter.value;
          this.form.wallThickness = cells.info.parameters.wall_thickness.value;
        } else {
          this.showPipeForm = false;
        }
      }
    },
    /******************提交表单******************* */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
          let cells = this.graph.getSelectionCells()[0];
          cells.info.nodeNumber = this.form.nodeNumber;
          cells.setValue(cells.info.nodeNumber);

          if (cells.info.typeName === "管道") {
            cells.info.parameters.pipe_length.value = this.form.pipeLength;
            cells.info.parameters.outside_diameter.value = this.form.outsideDiameter;
            cells.info.parameters.wall_thickness.value = this.form.wallThickness;
          }
        } else {
          alert("error submit!!");
          return false;
        }
      });
    },

    /************表单动画**************** */
    handleClose(done) {
      if (this.loading) {
        return;
      }
      this.$confirm("确定要提交表单吗？")
        .then((_) => {
          this.loading = true;
          this.timer = setTimeout(() => {
            done();
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false;
            }, 400);
          }, 2000);
        })
        .catch((_) => {});
    },
    cancelForm() {
      this.loading = false;
      this.editDialog = false;
      clearTimeout(this.timer);
    },
    /*************自动布局***************** */
    autoLayout() {
      //设置自动布局形式
      var layout = new mxHierarchicalLayout(
        this.graph,
        mxConstants.DIRECTION_WEST
      );
      layout.edgeStyle = 3;
      layout.resizeParent = true;
      layout.parentBorder = 100;
      layout.moveParent = true;
      // Moves stuff wider apart than usual
      //layout.forceConstant = 240;
      const parent = this.graph.getDefaultParent();
      //console.log(parent);
      layout.execute(parent);
    },
    orthogonal(openOrthogonal) {
      /***************************************************** */
      mxConnectionHandler.prototype.orthogonal = openOrthogonal;
      // console.log(mxConnectionHandler.prototype.orthogonal)
      // 重写
      var mxConnectionHandlermouseMove =
        mxConnectionHandler.prototype.mouseMove;
      mxConnectionHandler.prototype.mouseMove = function (sender, me) {
        if (
          !me.isConsumed() &&
          (this.ignoreMouseDown ||
            this.first != null ||
            !this.graph.isMouseDown)
        ) {
          // Handles special case when handler is disabled during highlight
          if (!this.isEnabled() && this.currentState != null) {
            this.destroyIcons();
            this.currentState = null;
          }

          var view = this.graph.getView();
          var scale = view.scale;
          var tr = view.translate;
          var point = new mxPoint(me.getGraphX(), me.getGraphY());
          this.error = null;

          if (this.graph.isGridEnabledEvent(me.getEvent())) {
            point = new mxPoint(
              (this.graph.snap(point.x / scale - tr.x) + tr.x) * scale,
              (this.graph.snap(point.y / scale - tr.y) + tr.y) * scale
            );
          }

          this.snapToPreview(me, point);
          this.currentPoint = point;

          if (
            (this.first != null ||
              (this.isEnabled() && this.graph.isEnabled())) &&
            (this.shape != null ||
              this.first == null ||
              Math.abs(me.getGraphX() - this.first.x) > this.graph.tolerance ||
              Math.abs(me.getGraphY() - this.first.y) > this.graph.tolerance)
          ) {
            this.updateCurrentState(me, point);
          }

          if (this.first != null) {
            var constraint = null;
            var current = point;
            if (this.orthogonal) {
              if (
                Math.abs(this.previous.getCenterX() - point.x) <
                Math.abs(this.previous.getCenterY() - point.y)
              ) {
                point.x = this.first.x;
              } else {
                point.y = this.first.y;
              }
            }

            // Uses the current point from the constraint handler if available
            //改动shift
            if (
              this.constraintHandler.currentConstraint != null &&
              this.constraintHandler.currentFocus != null &&
              this.constraintHandler.currentPoint != null
            ) {
              constraint = this.constraintHandler.currentConstraint;
              current = this.constraintHandler.currentPoint.clone();
            } else if (
              this.previous != null &&
              !this.graph.isIgnoreTerminalEvent(me.getEvent()) &&
              mxEvent.isShiftDown(me.getEvent())
            ) {
              // console.log('this.first', 'this.previous')
              // console.log(this.first)
              // console.log(this.previous)
              if (
                Math.abs(this.first.x - point.x) <
                Math.abs(this.first.y - point.y)
              ) {
                point.x = this.first.x;
              } else {
                point.y = this.first.y;
              }
            }

            var pt2 = this.first;

            // Moves the connect icon with the mouse
            if (this.selectedIcon != null) {
              var w = this.selectedIcon.bounds.width;
              var h = this.selectedIcon.bounds.height;

              if (this.currentState != null && this.targetConnectImage) {
                var pos = this.getIconPosition(
                  this.selectedIcon,
                  this.currentState
                );
                this.selectedIcon.bounds.x = pos.x;
                this.selectedIcon.bounds.y = pos.y;
              } else {
                var bounds = new mxRectangle(
                  me.getGraphX() + this.connectIconOffset.x,
                  me.getGraphY() + this.connectIconOffset.y,
                  w,
                  h
                );
                this.selectedIcon.bounds = bounds;
              }

              this.selectedIcon.redraw();
            }

            // Uses edge state to compute the terminal points
            if (this.edgeState != null) {
              this.updateEdgeState(current, constraint);
              current = this.edgeState.absolutePoints[
                this.edgeState.absolutePoints.length - 1
              ];
              pt2 = this.edgeState.absolutePoints[0];
            } else {
              if (this.currentState != null) {
                if (this.constraintHandler.currentConstraint == null) {
                  var tmp = this.getTargetPerimeterPoint(this.currentState, me);

                  if (tmp != null) {
                    current = tmp;
                  }
                }
              }

              // Computes the source perimeter point
              if (this.sourceConstraint == null && this.previous != null) {
                var next =
                  this.waypoints != null && this.waypoints.length > 0
                    ? this.waypoints[0]
                    : current;
                var tmp = this.getSourcePerimeterPoint(this.previous, next, me);

                if (tmp != null) {
                  pt2 = tmp;
                }
              }
            }

            // Makes sure the cell under the mousepointer can be detected
            // by moving the preview shape away from the mouse. This
            // makes sure the preview shape does not prevent the detection
            // of the cell under the mousepointer even for slow gestures.
            if (this.currentState == null && this.movePreviewAway) {
              var tmp = pt2;

              if (
                this.edgeState != null &&
                this.edgeState.absolutePoints.length >= 2
              ) {
                var tmp2 = this.edgeState.absolutePoints[
                  this.edgeState.absolutePoints.length - 2
                ];

                if (tmp2 != null) {
                  tmp = tmp2;
                }
              }

              var dx = current.x - tmp.x;
              var dy = current.y - tmp.y;

              var len = Math.sqrt(dx * dx + dy * dy);

              if (len == 0) {
                return;
              }

              // Stores old point to reuse when creating edge
              this.originalPoint = current.clone();
              current.x -= (dx * 4) / len;
              current.y -= (dy * 4) / len;
            } else {
              this.originalPoint = null;
            }

            // Creates the preview shape (lazy)
            if (this.shape == null) {
              var dx = Math.abs(me.getGraphX() - this.first.x);
              var dy = Math.abs(me.getGraphY() - this.first.y);

              if (dx > this.graph.tolerance || dy > this.graph.tolerance) {
                this.shape = this.createShape();

                if (this.edgeState != null) {
                  this.shape.apply(this.edgeState);
                }

                // Revalidates current connection
                this.updateCurrentState(me, point);
              }
            }

            // Updates the points in the preview edge
            if (this.shape != null) {
              if (this.edgeState != null) {
                this.shape.points = this.edgeState.absolutePoints;
              } else {
                var pts = [pt2];

                if (this.waypoints != null) {
                  pts = pts.concat(this.waypoints);
                }

                pts.push(current);
                this.shape.points = pts;
              }

              this.drawPreview();
            }

            // Makes sure endpoint of edge is visible during connect
            if (this.cursor != null) {
              this.graph.container.style.cursor = this.cursor;
            }

            mxEvent.consume(me.getEvent());
            me.consume();
          } else if (!this.isEnabled() || !this.graph.isEnabled()) {
            this.constraintHandler.reset();
          } else if (
            this.previous != this.currentState &&
            this.edgeState == null
          ) {
            this.destroyIcons();

            // Sets the cursor on the current shape
            if (
              this.currentState != null &&
              this.error == null &&
              this.constraintHandler.currentConstraint == null
            ) {
              this.icons = this.createIcons(this.currentState);

              if (this.icons == null) {
                this.currentState.setCursor(mxConstants.CURSOR_CONNECT);
                me.consume();
              }
            }

            this.previous = this.currentState;
          } else if (
            this.previous == this.currentState &&
            this.currentState != null &&
            this.icons == null &&
            !this.graph.isMouseDown
          ) {
            // Makes sure that no cursors are changed
            me.consume();
          }

          if (
            !this.graph.isMouseDown &&
            this.currentState != null &&
            this.icons != null
          ) {
            var hitsIcon = false;
            var target = me.getSource();

            for (var i = 0; i < this.icons.length && !hitsIcon; i++) {
              hitsIcon =
                target == this.icons[i].node ||
                target.parentNode == this.icons[i].node;
            }

            if (!hitsIcon) {
              this.updateIcons(this.currentState, this.icons, me);
            }
          }
        } else {
          this.constraintHandler.reset();
        }
      };
      var mxCoordinateAssignmentSetCellLocations =
        mxCoordinateAssignment.prototype.setCellLocations;
      mxCoordinateAssignment.prototype.setCellLocations = function (
        graph,
        model
      ) {
        this.rankTopY = [];
        this.rankBottomY = [];

        for (var i = 0; i < model.ranks.length; i++) {
          this.rankTopY[i] = Number.MAX_VALUE;
          this.rankBottomY[i] = -Number.MAX_VALUE;
        }

        var vertices = model.vertexMapper.getValues();
        //console.log('this.vertices[i]', vertices)
        // Process vertices all first, since they define the lower and
        // limits of each rank. Between these limits lie the channels
        // where the edges can be routed across the graph

        for (var i = 0; i < vertices.length; i++) {
          if (
            vertices[i].cell.info.typeName === "供应点" ||
            vertices[i].cell.info.typeName === "终点"
          ) {
            vertices[i].x[0] += 22.5;
            vertices[i].y[0] += 50;
          } else {
            vertices[i].x[0] += 50;
            vertices[i].y[0] += 50;
          }

          this.setVertexLocation(vertices[i]);
        }

        // Post process edge styles. Needs the vertex locations set for initial
        // values of the top and bottoms of each rank
        // console.log('this.layout.edgeStyle ', this.layout.edgeStyle)
        if (
          this.layout.edgeStyle == mxHierarchicalEdgeStyle.ORTHOGONAL ||
          this.layout.edgeStyle == mxHierarchicalEdgeStyle.POLYLINE ||
          this.layout.edgeStyle == mxHierarchicalEdgeStyle.CURVE
        ) {
          this.localEdgeProcessing(model);
        }

        var edges = model.edgeMapper.getValues();

        for (var i = 0; i < edges.length; i++) {
          this.setEdgePosition(edges[i]);
        }
      };
    },

    /************************ */
    cslGraph() {
      //for (let i = 0; i < this.graph.getSelectionCells().length; i++) {}
      let cell = this.graph.getSelectionCells()[0];
      console.log(cell);
    },
    cslModel() {
      console.log(this.graph.getSelectionModel());
    },

    selectCell() {
      this.deleteCells({
        cells: this.graph.getSelectionCells(),
        includeEdges: true,
      });
    },
    /******************************************************* */
    //操作栏
    zoomToSelection() {
      var bounds = this.graph.getBoundingBox(this.graph.getSelectionCells());
      var t = this.graph.view.translate;
      var s = this.graph.view.scale;
      console.log("s:" + s);
      bounds.width /= s;
      bounds.height /= s;
      bounds.x = bounds.x / s - t.x;
      bounds.y = bounds.y / s - t.y;

      var cw = this.graph.container.clientWidth - 10;
      var ch = this.graph.container.clientHeight - 10;
      var scale = Math.min(cw / bounds.width, ch / bounds.height);
      this.graph.zoomTo(scale);

      if (mxUtils.hasScrollbars(this.graph.container)) {
        this.graph.container.scrollTop =
          (bounds.y + t.y) * scale -
          Math.max((ch - bounds.height * scale) / 2 + 5, 0);
        // console.log("scrollTop:" + this.graph.container.scrollTop);
        this.graph.container.scrollLeft =
          (bounds.x + t.x) * scale -
          Math.max((cw - bounds.width * scale) / 2 + 5, 0);
        console.log("scrollLeft:" + this.graph.container.scrollLeft);
      }
    },
    select() {
      this.graph.setCellsMovable(true);
      this.graph.setAutoSizeCells(false);
      this.graph.setPanning(false);
      this.graph.panningHandler.useLeftButtonForPanning = false;
    },

    pan() {
      //可以点击背景进行平移流程图 鼠标左右键都可以
      this.graph.setCellsMovable(false);
      this.graph.setAutoSizeCells(true);
      this.graph.setPanning(true);
      this.graph.panningHandler.useLeftButtonForPanning = true;
    },

    zoomIn() {
      this.graph.zoomIn();
    },
    zoomOut() {
      this.graph.zoomOut();
    },
    zoomToFit() {
      var margin = 2;
      var max = 3;

      var bounds = this.graph.getGraphBounds();
      var cw = this.graph.container.clientWidth - margin;
      var ch = this.graph.container.clientHeight - margin;
      var w = bounds.width / this.graph.view.scale;
      var h = bounds.height / this.graph.view.scale;
      var s = Math.min(max, Math.min(cw / w, ch / h));

      this.graph.view.scaleAndTranslate(
        s,
        (margin + cw - w * s) / (2 * s) - bounds.x / this.graph.view.scale,
        (margin + ch - h * s) / (2 * s) - bounds.y / this.graph.view.scale
      );
    },
    /************************************************************************ */
    //导入json
    getTableData() {
      // json字符串转成对象
      // this.$http.get("static/node.json").then(res => {
      //   this.knotJson = res.body;

      //   this.$http.get("static/pipe.json").then(res => {
      //     this.flowJson = res.body;
      //   });
      // });

      let m = this.knotJson.length;
      let x_min = this.knotJson[0]["坐标x"];
      let x_max = this.knotJson[0]["坐标x"];
      let y_min = this.knotJson[0]["坐标y"];
      let y_max = this.knotJson[0]["坐标y"];

      for (let j = 0; j <= m - 1; j++) {
        let x = this.knotJson[j]["坐标x"];
        let y = this.knotJson[j]["坐标y"];
        if (x < x_min) {
          x_min = x;
        }
        if (x > x_max) {
          x_max = x;
        }
        if (y < y_min) {
          y_min = y;
        }
        if (y > y_max) {
          y_max = y;
        }
      }
      /******************************************************* */
      //坐标变换
      let coordinateBounds = {
        width: (x_max - x_min) * 6,
        height: (y_max - y_min) * 6,
        x: 0,
        y: 0,
      };

      var margin = 2;
      var max = 3;
      var cw = this.graph.container.clientWidth - margin - 16;
      var ch = this.graph.container.clientHeight - margin - 16;
      var w = coordinateBounds.width / this.graph.view.scale;
      var h = coordinateBounds.height / this.graph.view.scale;
      var s = Math.min(max, Math.min(cw / w, ch / h));

      this.graph.view.scaleAndTranslate(
        s,
        (margin + cw - w * s) / (2 * s) -
          coordinateBounds.x / this.graph.view.scale,
        (margin + ch - h * s) / (2 * s) -
          coordinateBounds.y / this.graph.view.scale
      );

      // /******************************************************** */

      for (let j = 0; j <= m - 1; j++) {
        let x = this.knotJson[j]["坐标x"] * 6 - (x_min - 50) * 6;
        let y = this.knotJson[j]["坐标y"] * 6 - (y_min - 50) * 6;

        if (this.knotJson[j]["节点类型"] === "弯头") {
          this.graphVertex[j] = this.createVertexJunction(
            j,
            x,
            y,
            this.knotJson[j]["节点类型"]
          );
        } else if (this.knotJson[j]["节点类型"] === "三通") {
          this.graphVertex[j] = this.createVertexJunction(
            j,
            x,
            y,
            this.knotJson[j]["节点类型"]
          );
        } else {
          this.graphVertex[j] = this.createVertexJunction(
            j,
            x,
            y,
            this.knotJson[j]["节点类型"]
          );
        }
      }

      for (let k = 0; k < this.flowJson.length; k++) {
        // 起点
        let startNum = this.flowJson[k]["起点编号"] - 1;
        // 终点
        let endNum = this.flowJson[k]["终点编号"] - 1;
        let source = Object();
        let target = Object();
        source.x = this.flowJson[k]["起点x"];
        source.y = this.flowJson[k]["起点y"];
        target.x = this.flowJson[k]["终点x"];
        target.y = this.flowJson[k]["终点y"];
        let length = this.flowJson[k]["管长"];
        let pipe = this.createPipe(
          this.graphVertex[startNum],
          this.graphVertex[endNum],
          source,
          target,
          length
        );
        this.createEdge(
          this.graphVertex[startNum],
          this.graphVertex[endNum],
          pipe
        );
      }

      // Creates a layout algorithm to be used
      // with the graph
    },

    //创建junction
    createVertexJunction(i, x, y, typeName) {
      const parent = this.graph.getDefaultParent();
      this.graph.getModel().beginUpdate();
      try {
        const cell = this.graph.insertVertex(
          parent,
          null,
          "",
          x,
          y,
          5,
          5,
          "shape=junction;strokeColor=blue;verticalLabelPosition=top;"
        );
        cell.info = Object();
        cell.info.typeName = typeName;
        return cell;
      } finally {
        this.graph.getModel().endUpdate();
      }
    },
    createPipe(v1, v2, source, target, length) {
      //console.log("v1=", v1.geometry);
      //console.log("v2=", v2.geometry);
      let geoV1 = v1.geometry;
      let geoV2 = v2.geometry;
      let dx = geoV1.x - geoV2.x;
      let dy = geoV1.y - geoV2.y;
      let width = 0.5 * Math.sqrt(dx * dx + dy * dy);
      let height = 5;
      let pipeX = (geoV1.x + geoV2.x) / 2;
      let pipeY = (geoV1.y + geoV2.y) / 2 - height / 2;

      let angle = Number;
      if (dx == 0) {
        angle = 90;
        console.log(1);
        pipeX = (geoV1.x + geoV2.x) / 2+ height;
        pipeY = (geoV1.y + geoV2.y) / 2 - width / 2 ;
      } else if (dx != 0 && dy != 0) {
        // if (dx < 0) {
        //   angle = (Math.atan(dy / dx) * 180) / Math.PI;
        //   pipeX =(geoV1.x + geoV2.x) / 2 +(width * dx * 0.5) / Math.sqrt(dx * dx + dy * dy);
        //   pipeY =(geoV1.y + geoV2.y) / 2 +(width * dy * 0.5) / Math.sqrt(dx * dx + dy * dy);
        // }
        // if (dx > 0) {
        //   pipeX =(geoV1.x + geoV2.x) / 2 -(width * dx * 0.5) / Math.sqrt(dx * dx + dy * dy);
        //   pipeY =(geoV1.y + geoV2.y) / 2 -(width * dy * 0.5) / Math.sqrt(dx * dx + dy * dy);
        // }
        
        angle = (Math.atan(dy / dx) * 180) / Math.PI;
          pipeX =(geoV1.x + geoV2.x) / 2 -width*Math.cos(angle*2*Math.PI/360)/2;
          pipeY =(geoV1.y + geoV2.y) / 2 -width*Math.sin(angle*2*Math.PI/360)/2;
        
        console.log(2);
      } else {
        console.log(3);
        pipeX = (geoV1.x + geoV2.x) / 2 - width / 2;
        pipeY = (geoV1.y + geoV2.y) / 2 ;
        angle = 0;
      }
      let cx = new mxPoint(pipeX, pipeY);
      console.log(angle);
      //创建管道节点
      const parent = this.graph.getDefaultParent();
      this.graph.getModel().beginUpdate();
      try {
        const cell = this.graph.insertVertex(
          parent,
          null,
          "",
          pipeX,
          pipeY,
          width,
          height,
          "shape=pipe;strokeColor=red;fillColor=red;rotation=" +
            angle.toString()
        );
        cell.info = Object();
        cell.info.typeName = "管道";
        cell.info.parameters = this.pipeParameters;
        cell.geometry.rotate(angle, cx);
        return cell;
      } finally {
        this.graph.getModel().endUpdate();
      }
    },

    createEdge(v1, v2, pipe) {
      //建立连线
      const parent = this.graph.getDefaultParent();
      this.graph.getModel().beginUpdate();
      try {
        var e1 = this.graph.insertEdge(
          parent,
          null,
          null,
          v1,
          pipe,
          "strokeWidth=0.5;labelBackgroundColor=white;fontStyle=1"
        );
        var e2 = this.graph.insertEdge(
          parent,
          null,
          null,
          pipe,
          v2,
          "strokeWidth=1;labelBackgroundColor=white;fontStyle=1"
        );
      } finally {
        this.graph.getModel().endUpdate();
      }
    },

    //根据 shapeName设置锚点
    getConstraints(shapeName, style, w, h) {
      var constr = [];
      if (
        shapeName === "delivery" ||
        shapeName === "supply" ||
        shapeName === "leak"
      ) {
        constr.push(new mxConnectionConstraint(new mxPoint(0.5, 1), true));
        constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), true));
      } else if (shapeName === "junction" || shapeName === "station") {
        constr.push(new mxConnectionConstraint(new mxPoint(0, 0.5), true));
        constr.push(new mxConnectionConstraint(new mxPoint(1, 0.5), true));
        constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), true));
        constr.push(new mxConnectionConstraint(new mxPoint(0.5, 1), true));
      } else if (shapeName === "connector") {
        constr = [];
      } else {
        constr.push(new mxConnectionConstraint(new mxPoint(0, 0.5), true));
        constr.push(new mxConnectionConstraint(new mxPoint(1, 0.5), true));
      }
      return constr;
    },

    // //创建管段（横管）
    // createPipeX(i, x, y, w) {
    //   const parent = this.graph.getDefaultParent();
    //   // console.log('这是新建横管');
    //   this.graph.getModel().beginUpdate();
    //   try {
    //     //顶点样式
    //     // let num = this.flowJson[i]['名称'].replace(/[^0-9]/ig,"");
    //     // console.log('该设备名称是：'+this.flowJson[i]['名称']+'该设备序号是：'+num);
    //     const cell = this.graph.insertVertex(
    //       parent,
    //       null,
    //       this.flowJson[i]["名称"],
    //       x,
    //       y,
    //       w,
    //       5,
    //       "shape=pipe;fillColor=red;strokeColor=red;verticalLabelPosition=top;"
    //     );
    //     return cell;
    //   } finally {
    //     this.graph.getModel().endUpdate();
    //   }
    // },
    // //创建管段（竖管）
    // createPipeY(i, x, y, h) {
    //   const parent = this.graph.getDefaultParent();
    //   this.graph.getModel().beginUpdate();
    //   try {
    //     const cell = this.graph.insertVertex(
    //       parent,
    //       null,
    //       this.flowJson[i]["名称"],
    //       x,
    //       y,
    //       5,
    //       h,
    //       "shape=pipe;fillColor=red;strokeColor=red;labelPosition=right;"
    //     );
    //     return cell;
    //   } finally {
    //     this.graph.getModel().endUpdate();
    //   }
    // },

    init() {
      // this.root = new mxCell();

      // eslint-disable-next-line new-cap
      this.model = new mxGraphModel();
      this.graph = new mxGraph(this.$refs.container, this.model);

      //在图中，启用新的连接
      this.graph.setConnectable(true); // 设置这个属性后节点之间才可以连接
      this.graph.setCellsLocked(false); //设置元素可编辑,不然无法自动布局
      this.graph.setMultigraph(true); //设置两个节点是否可以建立多个连接
      // Enables tooltips for the overlays
      this.graph.setTooltips(true);

      mxGraphHandler.prototype.guidesEnabled = true; //显示细胞位置标尺
      this.graph.setDropEnabled(true); // 从工具栏拖动到目标细胞时细胞边界是否产生光圈
      this.graph.setSplitEnabled(true);
      mxConnectionHandler.prototype.outlineConnect = true;

      mxConnectionHandler.prototype.livePreview = true;
      mxGraphHandler.prototype.maxLivePreview = 100;
      mxDragSource.prototype.guidesEnabled = true;
      // Adds rotation handle and live preview
      mxVertexHandler.prototype.rotationEnabled = true;

      mxVertexHandler.prototype.livePreview = true;

      mxEdgeHandler.prototype.snapToTerminals = true;

      //mxConstants.DEFAULT_HOTSPOT = 1;;

      //是否以图形的中心进行放大，否则以元素为中心放大
      this.graph.centerZoom = false;
      this.graph.zoomFactor = 3;

      /***********************图层变化时触发函数***************************************** */

      /***********************选中图形时触发的函数***************************************** */

      this.graph.getSelectionModel().addListener(mxEvent.CHANGE, () => {
        let selectionModel = this.graph.getSelectionModel();
        let cells = selectionModel.cells;
        let source = [];
        let target = [];
        if (cells.length == 1 && cells[0].edge == false) {
          if (cells[0].edges) {
            let edgeInfo = cells[0].edges;
            for (let i = 0; i < edgeInfo.length; i++) {
              if (edgeInfo[i].source.id == cells[0].id) {
                let targetId = edgeInfo[i].target.id;
                let targetCell = this.graph.model.cells[targetId];
                target.push(targetCell);
              } else if (edgeInfo[i].target.id == cells[0].id) {
                let sourceId = edgeInfo[i].source.id;
                let sourceCell = this.graph.model.cells[sourceId];
                source.push(sourceCell);
              }
            }
          }

          let name = cells[0].info.typeName;
          let id = cells[0].id;
          let parameters = cells[0].info.parameters;
          let nodeNumber = "";

          cells[0].info.nodeNumber = cells[0].value;
          nodeNumber = cells[0].info.nodeNumber;

          this.setNodeInfo(name, id, source, target, parameters, nodeNumber);
        }
      });
      /***********************有向无环布局**************************** */
      mxCoordinateAssignment.prototype.setCellLocations = function (
        graph,
        model
      ) {
        this.rankTopY = [];
        this.rankBottomY = [];

        for (var i = 0; i < model.ranks.length; i++) {
          this.rankTopY[i] = Number.MAX_VALUE;
          this.rankBottomY[i] = -Number.MAX_VALUE;
        }

        var vertices = model.vertexMapper.getValues();
        //console.log('this.vertices[i]', vertices)
        // Process vertices all first, since they define the lower and
        // limits of each rank. Between these limits lie the channels
        // where the edges can be routed across the graph

        for (var i = 0; i < vertices.length; i++) {
          if (
            vertices[i].cell.info.typeName === "供应点" ||
            vertices[i].cell.info.typeName === "终点"
          ) {
            vertices[i].x[0] += 22.5;
            vertices[i].y[0] += 50;
          } else {
            vertices[i].x[0] += 50;
            vertices[i].y[0] += 50;
          }

          this.setVertexLocation(vertices[i]);
        }

        // Post process edge styles. Needs the vertex locations set for initial
        // values of the top and bottoms of each rank
        // console.log('this.layout.edgeStyle ', this.layout.edgeStyle)
        if (
          this.layout.edgeStyle == mxHierarchicalEdgeStyle.ORTHOGONAL ||
          this.layout.edgeStyle == mxHierarchicalEdgeStyle.POLYLINE ||
          this.layout.edgeStyle == mxHierarchicalEdgeStyle.CURVE
        ) {
          this.localEdgeProcessing(model);
        }

        var edges = model.edgeMapper.getValues();

        for (var i = 0; i < edges.length; i++) {
          this.setEdgePosition(edges[i]);
        }
      };
      /**************************创建图形********************************** */

      //站场
      function mxStation(bounds, fill, stroke, strokewidth) {
        mxActor.call(this);
        this.bounds = bounds;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = strokewidth != null ? strokewidth : 1;
      }
      mxUtils.extend(mxStation, mxActor);
      mxStation.prototype.redrawPath = function (path, x, y, w, h) {
        var x1 = 0;
        var y1 = 0;
        path.moveTo(x1 + w * (1 / 3), y1);
        path.lineTo(x1, y1 + h / 3);
        path.lineTo(x1 + w * (1 / 6), y1 + h / 3);
        path.lineTo(x1 + w * (1 / 6), y1 + h);
        path.lineTo(x1 + w * (5 / 6), y1 + h);
        path.lineTo(x1 + w * (5 / 6), y1 + h / 3);
        path.lineTo(x1 + w, y1 + h / 3);
        path.lineTo(x1 + w * (2 / 3), y1);
        path.lineTo(x1 + w * (1 / 3), y1);
        path.end();
      };
      mxCellRenderer.registerShape("station", mxStation);

      //阀门
      function mxValve(bounds, fill, stroke, strokewidth) {
        mxActor.call(this);
        this.bounds = bounds;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = strokewidth != null ? strokewidth : 1;
      }
      mxUtils.extend(mxValve, mxActor);
      mxValve.prototype.redrawPath = function (path, x, y, w, h) {
        var x1 = 0;
        var y1 = 0;
        path.moveTo(x1, y1);
        path.lineTo(x1 + w, y1 + h);
        path.lineTo(x1 + w, y1);
        path.lineTo(x1, y1 + h);
        path.lineTo(x1, y1);
        path.end();
      };
      mxCellRenderer.registerShape("valve", mxValve);

      //安全阀
      function mxReliefValve(bounds, fill, stroke, strokewidth) {
        mxActor.call(this);
        this.bounds = bounds;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = strokewidth != null ? strokewidth : 1;
      }
      mxUtils.extend(mxReliefValve, mxActor);
      mxReliefValve.prototype.redrawPath = function (path, x, y, w, h) {
        //安全阀
        var x1 = 0;
        var y1 = 0;
        path.moveTo(x1, y1 + h);
        path.lineTo(x1, y1 + h / 3);
        path.lineTo(x1 + w, y1 + h);
        path.lineTo(x1 + w, y1 + h / 3);
        path.lineTo(x1, y1 + h);

        path.moveTo(x1 + w / 2, y1 + (h / 3) * 2);
        path.lineTo(x1 + w / 2, y1 + h / 2);
        path.lineTo(x1 + (w / 8) * 3, y1 + h / 3);
        path.lineTo(x1 + w / 2, y1 + h / 3);
        path.lineTo(x1 + (w / 8) * 3, y1);
        path.end();
      };
      mxCellRenderer.registerShape("reliefValve", mxReliefValve);

      //调节阀
      function mxRegulatorValve(bounds, fill, stroke, strokewidth) {
        mxActor.call(this);
        this.bounds = bounds;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = strokewidth != null ? strokewidth : 1;
      }
      mxUtils.extend(mxRegulatorValve, mxActor);
      mxRegulatorValve.prototype.redrawPath = function (path, x, y, w, h) {
        var x1 = 0;
        var y1 = 0;
        path.moveTo(x1, y1 + h);
        path.lineTo(x1, y1 + h / 3);
        path.lineTo(x1 + w, y1 + h);
        path.lineTo(x1 + w, y1 + h / 3);
        path.lineTo(x1, y1 + h);

        path.moveTo(x1 + w / 2, y1 + (h / 3) * 2);
        path.lineTo(x1 + w / 2, y1 + h / 3);
        path.lineTo(x1 + w / 4, y1 + h / 3);
        path.lineTo(x1 + w / 2, y1);
        path.lineTo(x1 + (w / 4) * 3, y1 + h / 3);
        path.lineTo(x1 + w / 2, y1 + h / 3);
        path.end();
      };
      mxCellRenderer.registerShape("regulatorValve", mxRegulatorValve);

      //压缩机
      function mxCompressor(bounds, fill, stroke, strokewidth) {
        mxActor.call(this);
        this.bounds = bounds;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = strokewidth != null ? strokewidth : 1;
      }
      mxUtils.extend(mxCompressor, mxActor);
      mxCompressor.prototype.redrawPath = function (path, x, y, w, h) {
        //梯形 压缩机
        var x1 = 0;
        var y1 = 0;
        path.moveTo(x1, y1);
        path.lineTo(x1 + w, y1 + h / 3);
        path.lineTo(x1 + w, y1 + (2 * h) / 3);
        path.lineTo(x1, y1 + h);
        path.lineTo(x1, y1);
        path.end();
      };

      mxCellRenderer.registerShape("compressor", mxCompressor);

      function mxPump(bounds, fill, stroke, strokewidth) {
        mxActor.call(this);
        this.bounds = bounds;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = strokewidth != null ? strokewidth : 1;
      }
      mxUtils.extend(mxPump, mxActor);
      mxPump.prototype.redrawPath = function (path, x, y, w, h) {
        //梯形 泵（30,40）
        var x1 = 0;
        var y1 = 0;
        path.moveTo(x1 + w / 6, y1);
        path.lineTo(x1 + w, y1);
        path.lineTo(x1 + w, y1 + h / 4);
        path.lineTo(x1 + (w / 3) * 2, y1 + h / 4);
        path.lineTo(x1 + (w / 6) * 5, y1 + (h / 8) * 3);
        path.lineTo(x1 + (w / 6) * 5, y1 + (h / 8) * 7);
        path.lineTo(x1 + (w / 3) * 2, y1 + h);
        path.lineTo(x1 + w / 6, y1 + h);
        path.lineTo(x1, y1 + (h / 8) * 7);
        path.lineTo(x1, y1 + h / 8);
        path.lineTo(x1 + w / 6, y1);
        path.end();
      };
      mxCellRenderer.registerShape("pump", mxPump);

      //节连接点
      function mxJunction(bounds, fill, stroke, strokewidth) {
        mxActor.call(this);
        this.bounds = bounds;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = strokewidth != null ? strokewidth : 1;
      }

      mxUtils.extend(mxJunction, mxActor);
      //节连接点
      mxJunction.prototype.redrawPath = function (path, x, y, w, h) {
        path.moveTo(0.5 * w, 0);
        path.arcTo(0.5 * w, 0.5 * h, Math.PI, 0, 0, 0.5 * w, h);
        path.arcTo(0.5 * w, 0.5 * h, Math.PI, 0, 0, 0.5 * w, 0);
        path.close();
        var x1 = 0;
        var y1 = 0;
        path.moveTo(x1, y1 + h / 2);
        path.lineTo(x1 + w, y1 + h / 2);
        path.moveTo(x1 + w / 2, y1);
        path.lineTo(x1 + w / 2, y1 + h);
        path.end();
      };
      mxCellRenderer.registerShape("junction", mxJunction);

      //供应点Supply
      function mxSupply(bounds, fill, stroke, strokewidth) {
        mxActor.call(this);
        this.bounds = bounds;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = strokewidth != null ? strokewidth : 1;
      }
      mxUtils.extend(mxSupply, mxActor);
      mxSupply.prototype.redrawPath = function (path, x, y, w, h) {
        var x1 = 0;
        var y1 = 0;
        // path.moveTo(0.5 * w, 0);
        // path.arcTo(0.5 * w, 0.5 * h, Math.PI, 0, 0, 0.5 * w, h);
        // path.arcTo(0.5 * w, 0.5 * h, Math.PI, 0, 0, 0.5 * w, 0);
        // path.close();
        // path.moveTo(x1 + w / 2, y1 + h / 2 + h / 8);
        // path.lineTo(x1 + w / 4, y1 + h / 4 + h / 8);
        // path.lineTo(x1 + w / 4, y1 + h / 8);
        // path.lineTo(x1 + w - w / 4, y1 + h / 8);
        // path.lineTo(x1 + w - w / 4, y1 + h / 4 + h / 8);
        // path.lineTo(x1 + w / 2, y1 + h / 2 + h / 8);
        // path.lineTo(x1 + w / 2, y1 + h - h / 8);
        // path.end();
        path.moveTo(x1 + w / 2, y1 + h / 4 + h / 8);
        path.lineTo(x1 + w / 4, y1 + h / 15 + h / 8);
        path.lineTo(x1 + w / 4, y1);
        path.lineTo(x1 + w - w / 4, y1);
        path.lineTo(x1 + w - w / 4, y1 + h / 15 + h / 8);
        path.lineTo(x1 + w / 2, y1 + h / 4 + h / 8);
        path.lineTo(x1 + w / 2, y1 + h);
        path.end();
      };
      mxCellRenderer.registerShape("supply", mxSupply);

      //delivery
      function mxDelivery(bounds, fill, stroke, strokewidth) {
        mxActor.call(this);
        this.bounds = bounds;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = strokewidth != null ? strokewidth : 1;
      }
      mxUtils.extend(mxDelivery, mxActor);
      mxDelivery.prototype.redrawPath = function (path, x, y, w, h) {
        var x1 = 0;
        var y1 = 0;
        // path.moveTo(0.5 * w, 0);
        // path.arcTo(0.5 * w, 0.5 * h, Math.PI, 0, 0, 0.5 * w, h);
        // path.arcTo(0.5 * w, 0.5 * h, Math.PI, 0, 0, 0.5 * w, 0);
        // path.close();
        // path.moveTo(x1 + w / 2, y1 + h / 2 + h / 8);
        // path.lineTo(x1 + w / 4, y1 + h / 2 + h / 8);
        // path.lineTo(x1 + w / 4, y1 + h / 4 + h / 8);
        // path.lineTo(x1 + w / 2, y1 + h / 8);
        // path.lineTo(x1 + w - w / 4, y1 + h / 4 + h / 8);
        // path.lineTo(x1 + w - w / 4, y1 + h / 2 + h / 8);
        // path.lineTo(x1 + w / 2, y1 + h / 2 + h / 8);
        // path.lineTo(x1 + w / 2, y1 + h - h / 8);
        // path.end();
        path.moveTo(x1 + w / 2, y1 + h / 4 + h / 8);
        path.lineTo(x1 + w / 4, y1 + h / 4 + h / 8);
        path.lineTo(x1 + w / 4, y1 + h / 15 + h / 8);

        path.lineTo(x1 + w / 2, y1);
        path.lineTo(x1 + w - w / 4, y1 + h / 15 + h / 8);
        path.lineTo(x1 + w - w / 4, y1 + h / 4 + h / 8);
        path.lineTo(x1 + w / 2, y1 + h / 4 + h / 8);
        path.lineTo(x1 + w / 2, y1 + h);
        path.end();
      };
      mxCellRenderer.registerShape("delivery", mxDelivery);

      //管段
      function mxPipe(bounds, fill, stroke, strokewidth) {
        mxActor.call(this);
        this.bounds = bounds;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = strokewidth != null ? strokewidth : 1;
      }
      mxUtils.extend(mxPipe, mxActor);
      mxPipe.prototype.redrawPath = function (path, x, y, w, h) {
        var x1 = 0;
        var y1 = 0;
        path.moveTo(x1, y1);
        path.lineTo(x1, y1 + h);
        path.lineTo(x1 + w, y1 + h);
        path.lineTo(x1 + w, y1);
        path.lineTo(x1, y1);
        path.moveTo(x1, y1);
        path.end();
      };
      mxCellRenderer.registerShape("pipe", mxPipe);

      //止回阀
      function mxCheckValve(bounds, fill, stroke, strokewidth) {
        mxActor.call(this);
        this.bounds = bounds;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = strokewidth != null ? strokewidth : 1;
      }
      mxUtils.extend(mxCheckValve, mxActor);
      mxCheckValve.prototype.redrawPath = function (path, x, y, w, h) {
        var x1 = 0;
        var y1 = 0;
        path.moveTo(x1 + w, y1);
        path.lineTo(x1 + w, y1 + h);
        path.lineTo(x1 + (w / 6) * 5, y1 + h);
        path.lineTo(x1 + w, y1 + (h / 6) * 5);
        path.moveTo(x1 + (w / 12) * 11, y1 + (h / 12) * 11);
        path.lineTo(x1, y1);
        path.lineTo(x1 + w, y1 + h);
        path.moveTo(x1, y1);
        path.lineTo(x1, y1 + h);
        path.end();
      };
      mxCellRenderer.registerShape("checkValve", mxCheckValve);

      //泄漏点
      function mxLeak(bounds, fill, stroke, strokewidth) {
        mxActor.call(this);
        this.bounds = bounds;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = strokewidth != null ? strokewidth : 1;
      }
      mxUtils.extend(mxLeak, mxActor);
      mxLeak.prototype.redrawPath = function (path, x, y, w, h) {
        var x1 = 0;
        var y1 = 0;
        path.moveTo(x1 + w / 2, y1 + h);
        path.lineTo(x1 + w / 2, y1 + h / 4);
        path.lineTo(x1, y1 + h / 4);
        path.lineTo(x1 + w / 2, y1);
        path.lineTo(x1 + w, y1 + h / 4);
        path.lineTo(x1 + w / 2, y1 + h / 4);
        path.end();
      };
      mxCellRenderer.registerShape("leak", mxLeak);

      // var style = [];

      // style[mxConstants.STYLE_ENDSIZE] = "0.5";
      // this.graph.getStylesheet().putDefaultVertexStyle(style);

      //禁止从节点中心拖拽出线条
      this.graph.connectionHandler.isConnectableCell = () => false;
      mxEdgeHandler.isConnectableCell = () => false;
      //重写锚点
      this.graph.getAllConnectionConstraints = (terminal) => {
        //获取图形名称
        var shapeName = terminal.shape.style.shape;
        //console.log(shapeName);
        //调用getConstraints函数，根据【图形名称】设置锚点
        var constraints = this.getConstraints(shapeName, terminal.style);
        if (constraints != null) {
          return constraints;
        }

        if (terminal != null && terminal.shape != null) {
          if (terminal.shape.stencil != null) {
            if (terminal.shape.stencil != null) {
              //alert(2)
              return terminal.shape.stencil.constraints;
            }
          } else if (terminal.shape.constraints != null) {
            //alert(3)
            return terminal.shape.constraints;
          }
        }

        return null;
      };
      // Enables rubberband selection
      new mxRubberband(this.graph);

      this.graph.connectionHandler.createEdgeState = function (me) {
        var edge = this.graph.createEdge(null, null, null, null, null);

        return new mxCellState(
          this.graph.view,
          edge,
          this.graph.getCellStyle(edge)
        );
      };
      /**************************************************** */

      mxGraph.prototype.splitEdge = function (
        edge,
        cells,
        newEdge,
        dx,
        dy,
        x,
        y,
        parent
      ) {
        dx = dx || 0;
        dy = dy || 0;
        //console.log("dx", dx);
        //console.log("dy", dy);
        var terminal = new mxCellState(
          this.view,
          cells[0],
          this.getCellStyle(cells[0])
        );
        var shapeName = terminal.style.shape;
        //console.log(shapeName);
        //调用getConstraints函数，根据【图形名称】设置锚点

        parent = parent != null ? parent : this.model.getParent(edge);
        var source = this.model.getTerminal(edge, true);
        //计算连线起点坐标
        var sourcePointX = source.geometry.getCenterX();
        var sourcePointY = source.geometry.getCenterY();
        //判断水平还是竖直
        var tx = sourcePointX - edge.geometry.targetPoint.x;
        var ty = sourcePointY - edge.geometry.targetPoint.y;

        this.model.beginUpdate();
        try {
          dx = edge.geometry.targetPoint.x - cells[0].geometry.x;
          dy =
            edge.geometry.targetPoint.y -
            cells[0].geometry.y -
            cells[0].geometry.height / 2;
          //如果图形是向上的箭头，限制连接点在底部，其他图形限制连接点在左边中点
          if (
            cells[0].info.typeName === "供应点" ||
            cells[0].info.typeName === "终点" ||
            cells[0].info.typeName === "泄露点"
          ) {
            dy = dy - cells[0].geometry.height / 2;
            this.cellsMoved(cells, dx, dy, false, false);
            this.cellConnected(
              edge,
              cells[0],
              false,
              new mxConnectionConstraint(new mxPoint(0.5, 1), true)
            );
          } else if (cells[0].info.typeName === "站场") {
            //水平方向
            if (Math.abs(tx) > Math.abs(ty)) {
              //向右
              if (tx < 0) {
                this.cellsMoved(cells, dx, dy, false, false);
                this.cellConnected(
                  edge,
                  cells[0],
                  false,
                  new mxConnectionConstraint(new mxPoint(0, 0.5), true)
                );
              } else if (tx > 0) {
                dx = dx - cells[0].geometry.width;
                this.cellsMoved(cells, dx, dy, false, false);
                this.cellConnected(
                  edge,
                  cells[0],
                  false,
                  new mxConnectionConstraint(new mxPoint(1, 0.5), true)
                );
              }
            }
            //竖直方向
            else if (Math.abs(tx) < Math.abs(ty)) {
              //向下
              if (ty < 0) {
                dy = dy + cells[0].geometry.height;
                dx = dx - cells[0].geometry.width / 2;
                this.cellsMoved(cells, dx, dy, false, false);
                this.cellConnected(
                  edge,
                  cells[0],
                  false,
                  new mxConnectionConstraint(new mxPoint(0.5, 0), true)
                );
              }
              //向上
              else if (ty > 0) {
                dy = dy - cells[0].geometry.height / 2;
                dx = dx - cells[0].geometry.width / 2;
                this.cellsMoved(cells, dx, dy, false, false);
                this.cellConnected(
                  edge,
                  cells[0],
                  false,
                  new mxConnectionConstraint(new mxPoint(0.5, 1), true)
                );
              }
            }
          } else {
            this.cellsMoved(cells, dx, dy, false, false);
            this.cellConnected(
              edge,
              cells[0],
              false,
              new mxConnectionConstraint(new mxPoint(0, 0.5), true)
            );
          }
        } finally {
          this.model.endUpdate();
        }

        return newEdge;
      };

      var style = this.graph.getStylesheet().getDefaultEdgeStyle();
      style[mxConstants.STYLE_ROUNDED] = false; //圆角连线
      this.graph.gridSize = 1;

      // 禁用鼠标右键
      mxEvent.disableContextMenu(this.$refs.container);
      this.initContentMenu(); // 初始化上下文菜单
      this.initUndoManager(); // 初始化undo/redo
      this.initKeyHandler(); // 初始化键盘事件
      this.$nextTick(() => {
        this.initToolBar();
      });
    },

    initToolBar() {
      var containerBasic = document.getElementById("toolbar-basic");
      // eslint-disable-next-line new-cap
      var toolbarBasic = new mxToolbar(containerBasic);
      toolbarBasic.enabled = false;

      var containerElse = document.getElementById("toolbar-else");
      // eslint-disable-next-line new-cap
      var toolbarElse = new mxToolbar(containerElse);
      toolbarElse.enabled = false;

      // toolbar 自带shape
      //站场
      this.addVertex(
        this.pipeURL,
        70,
        40,
        "shape=station;fillColor=rgb(0,245 ,255);strokeColor=rgb(0, 245, 255)",
        toolbarBasic,
        "站场",
        this.stationParameters
      );
      //基本
      this.addVertex(
        this.pipeURL,
        80,
        5,
        "shape=pipe;fillColor=red;strokeColor=red",
        toolbarBasic,
        "管道",
        this.pipeParameters
      ); //管段
      this.addVertex(
        this.supplyURL,
        29,
        55,
        "shape=supply;fillColor=red;strokeColor=red",
        toolbarBasic,
        "供应点"
      ); //供应点
      this.addVertex(
        this.deliveryURL,
        29,
        55,
        "shape=delivery;fillColor=rgb(100, 255, 0);strokeColor=rgb(100, 255, 0)",
        toolbarBasic,
        "终点"
      ); //终点
      this.addVertex(
        this.valveURL,
        20,
        20,
        "shape=valve;fillColor=red;strokeColor=red",
        toolbarBasic,
        "普通阀",
        this.valveParameters
      ); //阀门
      this.addVertex(
        this.regulatorValveURL,
        20,
        20,
        "shape=regulatorValve;fillColor=red;strokeColor=red",
        toolbarBasic,
        "调节阀"
      ); //调节阀
      this.addVertex(
        this.checkValveURL,
        20,
        20,
        "shape=checkValve;fillColor=red;strokeColor=red",
        toolbarBasic,
        "截断阀"
      ); //截断阀
      this.addVertex(
        this.reliefValveURL,
        20,
        20,
        "shape=reliefValve;fillColor=red;strokeColor=red",
        toolbarBasic,
        "安全阀"
      ); //安全阀

      //泵
      this.addVertex(
        this.pumpURL,
        30,
        30,
        "shape=pump;fillColor=blue;strokeColor=blue",
        toolbarBasic,
        "普通泵"
      ); //普通泵
      this.addVertex(
        this.cpumpURL,
        30,
        30,
        "shape=pump;fillColor=rgb(100, 255, 0);strokeColorrgb(100, 255, 0)",
        toolbarBasic,
        "离心泵"
      ); //离心泵
      this.addVertex(
        this.rpumpURL,
        30,
        30,
        "shape=pump;fillColor=red;strokeColor=red",
        toolbarBasic,
        "往复泵"
      ); //往复泵

      //其他
      this.addVertex(
        this.GenericCompressorURL,
        25,
        20,
        "shape=compressor;fillColor=blue;strokeColor=blue",
        toolbarElse,
        "普通压缩机"
      );
      this.addVertex(
        this.c_compressorURL,
        25,
        20,
        "shape=compressor;fillColor=rgb(100, 255, 0);strokeColorrgb(100, 255, 0)",
        toolbarElse,
        "离心式压缩机"
      );
      this.addVertex(
        this.oil_tankURL,
        30,
        30,
        "shape=cylinder;fillColor=lightgrey;strokeColor=black",
        toolbarElse,
        "油罐"
      ); //油罐
      this.addVertex(
        this.junctionURL,
        20,
        20,
        "shape=junction;strokeColor=blue",
        toolbarElse,
        "连接点"
      ); //连接点

      this.addVertex(
        this.leakURL,
        15,
        60,
        "shape=leak;fillColor=rgb(0, 255, 255);strokeColor=rgb(0, 255, 255)",
        toolbarElse,
        "泄漏点"
      ); //泄漏点

      // 箭头
      const domArray = this.$refs.dragItem;
      if (!(domArray instanceof Array) || domArray.length <= 0) {
        return;
      }
      domArray.forEach((dom) => {
        const shapeIndex = dom.getAttribute("shapeIndex");
        const paletteIndex = dom.getAttribute("paletteIndex");
        const shapeItem = Object.values(this.palettes)[paletteIndex]["shapes"][
          shapeIndex
        ];
        const width = shapeItem["width"];
        const height = shapeItem["height"];
        const dragHandler = (graph, evt, cell, x, y) => {
          this.instanceGraph(this.graph, shapeItem, x, y, width, height);
        };
        const createDragPreview = () => {
          const elt = document.createElement("div");
          elt.style.border = "1px solid black";
          elt.style.width = `${width}px`;
          elt.style.height = `${height}px`;
          return elt;
        };
        dom.appendChild(this.createThumb(shapeItem, width, height));

        mxUtils.makeDraggable(
          dom,
          this.graph,
          dragHandler,
          createDragPreview(),
          0,
          0,
          false,
          true
        );
      });
    },

    addVertex(icon, w, h, style, toolbar, typeName, parameters) {
      // eslint-disable-next-line new-cap
      const vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
      vertex.info = Object();
      vertex.info.typeName = typeName;
      vertex.info.nodeNumber = "";
      vertex.info.parameters = parameters;

      vertex.setVertex(true);

      const img = this.addToolbarItem(this.graph, toolbar, vertex, icon);

      img.enabled = true;
      this.graph.getSelectionModel().addListener(mxEvent.CHANGE, () => {
        const tmp = this.graph.isSelectionEmpty();
        mxUtils.setOpacity(img, tmp ? 100 : 20);
        img.enabled = tmp;
      });
    },

    addToolbarItem(graph, toolbar, prototype, image) {
      const funct = function (graph, evt, cell, x, y) {
        graph.stopEditing(false);
        const vertex = graph.getModel().cloneCell(prototype);

        vertex.geometry.x = x;
        vertex.geometry.y = y;

        graph.addCell(vertex);
        graph.setSelectionCell(vertex);
      };
      const img = toolbar.addMode(null, image, function (evt, cell) {
        const pt = this.graph.getPointForEvent(evt);

        funct(graph, evt, cell, pt.x, pt.y);
      });

      mxEvent.addListener(img, "mousedown", function (evt) {
        if (img.enabled === false) {
          mxEvent.consume(evt);
        }
      });

      mxEvent.addListener(img, "mouseenter", function (evt) {
        if (img.enabled === false) {
          mxEvent.consume(evt);
        }
      });

      mxEvent.addListener(img, "mouseleave", function (evt) {
        if (img.enabled === false) {
          mxEvent.consume(evt);
        }
        img.style = "background: white";
      });
      mxUtils.makeDraggable(img, graph, funct);
      return img;
    },

    deleteCells({ cells = [], includeEdges = false, multilevel = true }) {
      if (!cells || !(cells instanceof Array)) {
        throw new Error("cells 必须是一个数组");
      }
      const tmpSet = new Set(cells);

      if (multilevel) {
        cells.forEach((cell) => {
          this.findDeleteCell(cell, tmpSet);
        });
      }
      this.graph.removeCells(Array.from(tmpSet), includeEdges);
    },
    findDeleteCell(cell, deleteSet) {
      deleteSet.add(cell);
      if (cell.edges) {
        cell.edges.forEach((tmpEdge) => {
          if (tmpEdge.target !== cell) {
            deleteSet.add(tmpEdge.target);
            this.findDeleteCell(tmpEdge.target, deleteSet);
          }
        });
      }
    },
    cut() {
      var cells = [];
      cells = this.graph.getSelectionCells();
      mxClipboard.cut(this.graph, cells);
    },
    copy() {
      var cells = [];
      cells = this.graph.getSelectionCells();
      mxClipboard.copy(this.graph, cells);
    },
    paste() {
      mxClipboard.paste(this.graph);
    },
    undo() {
      if (!this.undoMng) {
        throw new Error("mxUndoManager 没有初始化");
      }
      this.undoMng.undo();
    },
    redo() {
      if (!this.undoMng) {
        throw new Error("mxUndoManager 没有初始化");
      }
      this.undoMng.redo();
    },
    initContentMenu() {
      this.graph.popupMenuHandler.factoryMethod = (menu /*, cell*/) => {
        menu.addItem("删除", null, () => {
          this.deleteCells({
            cells: this.graph.getSelectionCells(),
            includeEdges: true,
          });
        });
        menu.addSeparator();
        menu.addItem("剪切", null, () => {
          this.cut();
        });
        menu.addItem("复制", null, () => {
          this.copy();
        });
        menu.addItem("粘贴", null, () => {
          this.paste();
        });
        menu.addSeparator();
        menu.addItem("恢复", null, () => {
          this.redo();
        });
        menu.addItem("撤销", null, () => {
          this.undo();
        });
      };
    },
    initUndoManager() {
      // eslint-disable-next-line new-cap
      this.undoMng = new mxUndoManager();

      const listen = (sender, evt) => {
        this.undoMng.undoableEditHappened(evt.getProperty("edit"));
      };

      this.graph.getModel().addListener(mxEvent.UNDO, listen);
      this.graph.getView().addListener(mxEvent.UNDO, listen);
    },
    initKeyHandler() {
      if (!this.graph) {
        throw new Error("graph 没有初始化");
      }
      // eslint-disable-next-line new-cap
      this.keyHandler = new mxKeyHandler(this.graph);

      this.keyHandler.bindControlKey(67, () => {
        this.copy();
      });
      this.keyHandler.bindKey(46, () => {
        this.deleteCells({
          cells: this.graph.getSelectionCells(),
          includeEdges: true,
        });
      });
      this.keyHandler.bindControlKey(67, () => {
        this.copy();
      });
      this.keyHandler.bindControlKey(88, () => {
        this.cut();
      });
      this.keyHandler.bindControlKey(86, () => {
        this.paste();
      });
      this.keyHandler.bindControlKey(89, () => {
        this.redo();
      });
      this.keyHandler.bindControlKey(90, () => {
        this.undo();
      });
    },

    // 读取XML
    getXML() {
      console.log(this.graph);
      var encoder = new mxCodec();
      var node = encoder.encode(this.graph.getModel());
      //console.log(node);
      var xml = mxUtils.getXml(node);
      return xml;
    },
    //导出XML
    exportXML() {
      var xml = this.getXML();
      const blob = new Blob([xml], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, "管网连接图.xml");
    },
    //将得到的xml格式转为json
    xmlToJson() {
      var xml = this.getXML(); //此xml可由js对象转化而来
      var jsonObj = this.$x2js.xml2js(xml);
      //console.log("这是jsonObj");
      //console.log(jsonObj);

      //JSON.stringify()作用：JavaScript 对象转换为 JSON 字符串
      //JSON.parse()可以将JSON字符串转为一个对象
      var xmltojsonObj = JSON.stringify(jsonObj); //json字符串

      //console.log("这是xmltojsonObj 字符串");
      //console.log(xmltojsonObj); //json数据格式
      // console.log(jsonObj.mxGraphModel.root.mxCell);//json数据格式
      var mxCellJson = JSON.stringify(jsonObj.mxGraphModel.root.mxCell); //只显示节点信息
      const blob = new Blob([xmltojsonObj], { type: "" });
      // const textStr = 'aaaaa,bbbbbbb,cccccc'
      FileSaver.saveAs(blob, "json格式.json");

      var jsObj = JSON.parse(xmltojsonObj);
      // console.log("这是jsObj对象");
      // console.log(jsObj);
      var xmlObj = this.$x2js.js2xml(jsObj);
      // console.log("======   对比  ===");
      // console.log(xmlObj);
      // console.log(xml); //两者结果一样
    },

    // 导入XML代码
    readFile(evt) {
      const file = evt.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        var xml = e.target.result;
        // console.log("这是readfile的xml");
        // console.log(xml);
        this.graph.getModel().beginUpdate();
        try {
          const doc = mxUtils.parseXml(xml);
          // eslint-disable-next-line new-cap
          const dec = new mxCodec(doc);
          var node = doc.documentElement;
          dec.decode(node, this.graph.getModel());
        } finally {
          this.graph.getModel().endUpdate();
        }
      };
      reader.readAsText(file);
    },
    importFile() {
      this.$refs.importInput.click();
    },

    importJson() {
      this.$refs.importJson.click();
    },
    importJson1() {
      this.$refs.importJson1.click();
    },
    importJson2() {
      this.$refs.importJson2.click();
    },

    //Json转为xml并显示流程图代码
    readJson(evt) {
      const file = evt.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        var jsonStr = e.target.result; //json字符串
        // console.log('json字符串');
        //console.log(jsonStr);
        var jsObj = JSON.parse(jsonStr);
        // console.log("js对象");
        // console.log(jsObj);
        var xml = this.$x2js.js2xml(jsObj);
        // console.log('这是readJson的xml');
        // console.log(xml);
        this.graph.getModel().beginUpdate();
        try {
          const doc = mxUtils.parseXml(xml);
          // eslint-disable-next-line new-cap
          const dec = new mxCodec(doc);
          var node = doc.documentElement;
          dec.decode(node, this.graph.getModel());
        } finally {
          this.graph.getModel().endUpdate();
        }
      };
      reader.readAsText(file);
    },

    /**************************** */
    readJson1(evt) {
      alert("开始【导入节点】");
      // console.log(
      //   "knotState0=" + this.knotState,
      //   "flowState0=" + this.flowState
      // );
      // console.log("knotJson0=" + this.knotJson);
      // console.log("flowJson0=" + this.flowJson);
      this.knotJson = [];
      const file = evt.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        var jsonStr = e.target.result; //json字符串
        // console.log(jsonStr);
        var jsObj = JSON.parse(jsonStr);
        this.knotJson = jsObj;
        if (this.knotJson != null) {
          this.knotState = 1;
        }
        // console.log(
        //   "knotState1=" + this.knotState,
        //   "flowState1=" + this.flowState
        // );
        // console.log("knotJson1=" + this.knotJson);
        // console.log("flowJson1=" + this.flowJson);
        // console.log("js对象");
        // console.log(this.knotJson);
      };
      reader.readAsText(file);
      alert("【节点】导入完成");
    },
    readJson2(evt) {
      alert("开始导入【节点连接关系】");
      // console.log(
      //   "knotState0=" + this.knotState,
      //   "flowState0=" + this.flowState
      // );
      // console.log("knotJson0=" + this.knotJson);
      // console.log("flowJson0=" + this.flowJson);
      this.flowJson = [];
      const file = evt.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        var jsonStr = e.target.result; //json字符串
        //console.log(jsonStr);
        var jsObj = JSON.parse(jsonStr);
        this.flowJson = jsObj;
        if (this.flowJson != null) {
          this.flowState = 1;
        }
        // console.log(
        //   "knotState1=" + this.knotState,
        //   "flowState1=" + this.flowState
        // );
        // console.log("knotJson1=" + this.knotJson);
        // console.log("flowJson1=" + this.flowJson);
      };
      reader.readAsText(file);
      alert("【节点连接关系】导入完成");
    },
  },
};
</script>
 
<style  lang="scss">
.m_graph_container {
  position: absolute;
  width: 940px;
  height: 455px;
  margin-left: 200px;
  overflow: auto;
  cursor: default;
  #container {
    position: absolute;
    overflow: auto;
    width: 940px;
    left: 0px;
    top: 0;
    right: 0px;
    bottom: 0;
    border-left: 1px solid #dcdfe6;
    cursor: pointer;
    //background-image: url("../../../public/mxgraph/images/grid.gif");
  }
}
.sidebar {
  width: 200px;

  .el-collapse-item__header {
    padding-left: 10px;
  }
  .el-collapse-item__content {
    padding-left: 10px;
    padding-bottom: 0;
  }
}
.topbar {
  display: flex;
  align-items: center;
  padding: 10px;
  .topbar-left {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
  .topbar-right {
    display: flex;
    align-items: center;
  }
}
.btns {
  margin-top: 10px;
  width: 80px;
}
.flow-top-tool-group {
  .flow-top-tool {
    display: inline;
    padding: 10px;
    // height: 34px;
    // width:34px;
    // border-left: 1px solid #e0e0e0;
    // border-right: 1px solid #e0e0e0;
    background: fff;
    font-size: 15px;
  }
}
.btns2 {
  margin-top: 5px;
  width: 80px;
}
.hide {
  display: none !important;
}
</style>