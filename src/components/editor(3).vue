<template>
  <div>
    <div class="m_graph_container" tabindex>
      <div id="container" ref="container" />
    </div>
    <div id="sidebar" class="sidebar">
      <el-collapse>
        <el-collapse-item title="常用" name="常用">
          <div id="toolbar-basic" class="toolbar-basic" />
        </el-collapse-item>
        <el-collapse-item title="其他" name="其他">
          <div id="toolbar-else" class="toolbar-else" />
        </el-collapse-item>
        <el-collapse-item title="设置" name="设置">
          <div id="toolbar-set" class="toolbar-set" />
          <!-- 按钮区域 -->
        </el-collapse-item>
      </el-collapse>
      <el-collapse>
        <el-collapse-item
          v-for="(palette, paletteIndex) in Object.values(palettes)"
          :key="paletteIndex"
          :title="palette['title']"
          :name="palette['name']"
        >
          <a
            v-for="(_, shapeIndex) in palette['shapes']"
            ref="dragItem"
            :key="shapeIndex"
            :shapeIndex="shapeIndex"
            :paletteIndex="paletteIndex"
          />
        </el-collapse-item>
      </el-collapse>
      <div class="buttonDiv">
        <ElButton type="primary" size="mini" class="btns" @click.native="getTableData">导入</ElButton>
        <ElButton type="success" size="mini" class="btns">导出</ElButton>
      </div>
      <div class="buttonDiv">
        <ElButton type="info" size="mini" class="btns">输出XML</ElButton>
        <ElButton type="warning" size="mini" class="btns">导出图片</ElButton>
      </div>
    </div>
  </div>
</template>
 
<script>
import mxgraph from "@/components/graph/index";
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
  mxCellTracker,
  mxStencil,
  mxStencilRegistry,
  mxConstants,
  mxEdgeStyle,

  mxFastOrganicLayout,
  mxCompactTreeLayout,
  mxWindow ,
  mxCircleLayout,
  mxParallelEdgeLayout,
  mxStackLayout,
  mxHierarchicalLayout,
  mxSwimlaneLayout,
  mxConnectionConstraint,
  mxPoint
} = mxgraph;
const path = require("path");

export default {
  name: "editor",
  data() {
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
      knotJson: [],
      knotType: [],
      // sx =['顺序']
      junctionNum:0,
      sinkNum:0,
      flowJson: [],
      graphPipe:[],

      graphVertex: []
    };
  },
  computed: {
    headers() {
      return {
        Authorization: "Bearer " + this.$store.getters.token
      };
    }
  },
  watch: {
    uploadVisible(val) {
      !val &&
        setTimeout(() => {
          this.$refs["uploadImg"].clearFiles();
          this.$refs["uploadImg"].abort();
        }, 100);
    }
  },
  mounted() {
    this.init();
    // this.getPro();
    // this.addStencilPalette("箭头", "arrows", path.join("./arrows.xml"));
  },
  beforeDestroy() {
    this.graph.destroy();
  },
  methods: {
    getTableData() {
      // json字符串转成对象
      this.$http.get("static/knot.json").then(res => {
        this.knotJson = res.body;
        console.log('这是getTableData   this.knotJson[0]["视图坐标"]的结果：'+this.knotJson[0]["视图坐标"]);//22.92,14.2
        console.log('这是getTableData   this.knotJson[0]["视图坐标"][0]的结果：'+this.knotJson[0]["视图坐标"][0]);//22.92
        // console.log('这是getTableData   this.knotJson.length的结果：'+this.knotJson.length);//23
        // console.log(this.knotJson);//读到了23个数组
        // console.log('这是getTableData   this.knotJson[0]["类型"]的结果：'+this.knotJson[0]["类型"]);//source

      this.$http.get("static/flow.json").then(res => {
        this.flowJson = res.body;
        // console.log(this.flowJson);
      });      
      });
      
      let m = this.knotJson.length;
        for (let j = 0; j <= m-1; j++) {
          this.knotType[j] = this.knotJson[j]["类型"];
          console.log('这是this.knotJson[j]["类型"]的结果：'+this.knotJson[j]["类型"]);//this.knotType[j]source
          console.log('这是this.knotType[j]的结果：'+this.knotType[j]);//this.knotType[j]source
          let x = this.knotJson[j]["视图坐标"][0];
          let y = this.knotJson[j]["视图坐标"][1];

          if (this.knotJson[j]["类型"] == 'source') {
              this.graphVertex[j]=this.createVertexSource(j,x,y)
          // this.graphVertex[j] = this.createVertexSource(j);
              console.log("类型为source,此时j的值为："+j);
              }else if(this.knotJson[j]["类型"] == 'junction'){
              this.graphVertex[j]= this.createVertexJunction(j,x,y);
              console.log("类型为junction，此时j的值为："+j);
          } else {
            this.graphVertex[j] = this.createVertexSink(j,x,y);
              console.log("类型为sink，此时j的值为："+j);
          }
        }//for结束

        for (let k = 0; k < this.flowJson.length; k++) {
          // 起点
          let startNum= this.flowJson[k]["起点"]-1;
          // 终点
          let endNum= this.flowJson[k]["终点"]-1;
          // let x = this.knotJson[j]["视图坐标"][0];
          // let y = this.knotJson[j]["视图坐标"][1];
          let x1 = this.knotJson[startNum]["视图坐标"][0];
          let x2 = this.knotJson[endNum]["视图坐标"][0];
          let y1 = this.knotJson[startNum]["视图坐标"][1];
          let y2 =  this.knotJson[endNum]["视图坐标"][1]
          let x0 = ( x1 + x2 )/2-10;
          let y0 = ( y1 + y2 )/2+3;
          this.graphPipe[k,x0,y0]=this.createPipe(k,x0,y0);
          this.createEdge(k,this.graphVertex[startNum], this.graphPipe[k,x0,y0]);
          this.createEdge(k,this.graphPipe[k,x0,y0],this.graphVertex[endNum]);
        }
              var parent = this.graph.getDefaultParent();

      // Creates a layout algorithm to be used
      // with the graph


      // 设置容器随内容自适应
      this.graph.setResizeContainer(true);
      // 设置自动布局形式
      var layout = new mxHierarchicalLayout(this.graph,mxConstants.DIRECTION_WEST);
      // var layout = new mxCircleLayout(this.graph,mxConstants.DIRECTION_WEST);


      // Moves stuff wider apart than usual
      layout.forceConstant = 400;
      layout.execute(parent);
    },





    //创建管段
    createPipe(i,x0,y0){
      const parent = this.graph.getDefaultParent();
      // console.log('这是新建管段');
      this.graph.getModel().beginUpdate();
      try {
          //顶点样式
          let num = this.flowJson[i]['名称'].replace(/[^0-9]/ig,"");
          console.log('该设备名称是：'+this.flowJson[i]['名称']+'该设备序号是：'+num);
          let w = 635/10 * num;
          const cell = this.graph.insertVertex(parent,null,this.flowJson[i]['名称'],0,0,30,5, "shape=pipe;fillColor=red;strokeColor=red");
          return cell;
      }   finally { this.graph.getModel().endUpdate();}
    },

    //创建sink
    createVertexSink(i,x,y){
      const parent = this.graph.getDefaultParent();
      console.log('这是createVertexSink');
      this.graph.getModel().beginUpdate();
      try {
          //顶点样式
          let num = this.knotJson[i]['名称'].replace(/[^0-9]/ig,"");
          console.log('该设备名称是：'+this.knotJson[i]['名称']+'该设备序号是：'+num);
          let w = 635/10 * num;

          const cell = this.graph.insertVertex(parent,null,this.knotJson[i]['名称'],0,0,10,20, "shape=delivery;fillColor=rgb(100, 255, 0);strokeColor=rgb(100, 255, 0)");
          return cell;
      }   finally { this.graph.getModel().endUpdate();}
    },
    //创建junction
    createVertexJunction(i,x,y){
      const parent = this.graph.getDefaultParent();
      console.log('这是createVertexJunction');
      // console.log('这是this.knotJson.length的结果：'+this.knotJson.length);//23
      console.log('===');
      console.log('this.knotJson[i][顺序]:'+this.knotJson[i]['顺序']);//
      this.graph.getModel().beginUpdate();
      try {
          //顶点样式
          let num = this.knotJson[i]['名称'].replace(/[^0-9]/ig,"");//取字符串中的数字
          console.log('该设备名称是：'+this.knotJson[i]['名称']+'该设备序号是：'+num);
          let w = 635/20 *num;
          const cell = this.graph.insertVertex(parent,null,this.knotJson[i]['名称'],0,0,10, 10, "shape=junction;strokeColor=blue");
          return cell;
      }   finally { this.graph.getModel().endUpdate();}
    },
    //创建supply
    createVertexSource(i,x,y) {
      const parent = this.graph.getDefaultParent();
      console.log('这是Source，坐标为：['+x+','+y+']');
      this.graph.getModel().beginUpdate();
      try {
        //顶点样式
        const cell = this.graph.insertVertex(parent,null,this.knotJson[i]['名称'],0,0,10, 20, "shape=supply;fillColor=red;strokeColor=red");
       return cell;
      } finally { this.graph.getModel().endUpdate();}
       console.log('创建了一个source!');
    },//createVertexSource(i)结束

    createEdge(k,v1, v2) {
      const parent = this.graph.getDefaultParent();
      this.graph.getModel().beginUpdate();
      try {var e1 = this.graph.insertEdge( parent, null,null, v1,v2,"strokeWidth=1;labelBackgroundColor=white;fontStyle=1");
      } finally {
        this.graph.getModel().endUpdate();
      }
    },
    init() {
      // eslint-disable-next-line new-cap
      this.model = new mxGraphModel();
      // eslint-disable-next-line new-cap

      //弹窗图形
				// var wnd = new mxWindow('Scrollable, resizable, given height', this.$refs.container, 50, 50, 220, 224, true, true);
				// wnd.setMaximizable(true);
				// wnd.setScrollable(true);
				// wnd.setResizable(true);
				// wnd.setVisible(true);
      this.graph = new mxGraph(this.$refs.container, this.model);
      //在图中，启用新的连接
      this.graph.setConnectable(true); // 设置这个属性后节点之间才可以连接
      this.graph.setCellsLocked(false); //设置元素可编辑,不然无法自动布局
      this.graph.setMultigraph(true); //设置两个节点是否可以建立多个连接
      // Enables tooltips for the overlays
      this.graph.setTooltips(true);
      var style = this.graph.getStylesheet().getDefaultEdgeStyle();
      style[mxConstants.STYLE_ROUNDED] = true; //圆角连线
      style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector; //自己拐弯的连线
      this.graph.gridSize = 40;
      // 禁用鼠标右键
      mxEvent.disableContextMenu(this.$refs.container);
      this.initContentMenu(); // 初始化上下文菜单
      this.initUndoManager(); // 初始化undo/redo
      this.initKeyHandler(); // 初始化键盘事件
      this.$nextTick(() => {
      this.initToolBar();
      });
    },
    addStencilPalette(title, name, file) {
      const req = mxUtils.load(file);
      const root = req.getDocumentElement();
      let shape = root.firstChild;

      this.$set(this.palettes, name, { title, name, shapes: [] });

      while (shape != null) {
        if (shape.nodeType === mxConstants.NODETYPE_ELEMENT) {
          const shapeName = shape.getAttribute("name");
          const w = shape.getAttribute("w");
          const h = shape.getAttribute("h");

          // eslint-disable-next-line new-cap
          mxStencilRegistry.addStencil(shapeName, new mxStencil(shape));
          this.palettes[name]["shapes"].push({
            name: shape.getAttribute("name"),
            width: w / 2,
            height: h / 2
          });
        }

        shape = shape.nextSibling;
      }
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
      //基本
      this.addVertex(
        this.pipeURL,
        60,
        10,
        "shape=pipe;fillColor=red;strokeColor=blue",
        toolbarBasic
      ); //管段
      this.addVertex(
        this.supplyURL,
        30,
        60,
        "shape=supply;fillColor=red;strokeColor=red",
        toolbarBasic
      ); //供应点
      this.addVertex(
        this.deliveryURL,
        30,
        60,
        "shape=delivery;fillColor=rgb(100, 255, 0);strokeColor=rgb(100, 255, 0)",
        toolbarBasic
      ); //终点
      this.addVertex(
        this.valveURL,
        40,
        20,
        "shape=valve;fillColor=red;strokeColor=red",
        toolbarBasic
      ); //阀门
      this.addVertex(
        this.regulatorValveURL,
        40,
        35,
        "shape=regulatorValve;fillColor=red;strokeColor=red",
        toolbarBasic
      ); //调节阀
      this.addVertex(
        this.checkValveURL,
        30,
        30,
        "shape=checkValve;fillColor=red;strokeColor=red",
        toolbarBasic
      ); //截断阀

      //泵
      this.addVertex(
        this.pumpURL,
        40,
        40,
        "shape=pump;fillColor=blue;strokeColor=blue",
        toolbarBasic
      ); //普通泵
      this.addVertex(
        this.cpumpURL,
        40,
        40,
        "shape=pump;fillColor=rgb(100, 255, 0);strokeColorrgb(100, 255, 0)",
        toolbarBasic
      ); //离心泵
      this.addVertex(
        this.rpumpURL,
        40,
        40,
        "shape=pump;fillColor=red;strokeColor=red",
        toolbarBasic
      ); //往复泵

      //其他
      this.addVertex(
        this.GenericCompressorURL,
        40,
        40,
        "shape=compressor;fillColor=blue;strokeColor=blue",
        toolbarElse
      );
      this.addVertex(
        this.c_compressorURL,
        40,
        40,
        "shape=compressor;fillColor=rgb(100, 255, 0);strokeColorrgb(100, 255, 0)",
        toolbarElse
      );
      this.addVertex(this.oil_tankURL, 40, 40, "shape=cylinder", toolbarElse); //油罐
      this.addVertex(
        this.junctionURL,
        20,
        20,
        "shape=junction;strokeColor=blue",
        toolbarElse
      ); //连接点
      //泄漏点
      this.addVertex(
        this.leakURL,
        15,
        60,
        "shape=leak;fillColor=rgb(0, 255, 255);strokeColor=rgb(0, 255, 255)",
        toolbarElse
      );

      // 箭头
      const domArray = this.$refs.dragItem;
      if (!(domArray instanceof Array) || domArray.length <= 0) {
        return;
      }
      domArray.forEach(dom => {
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

    createThumb(item, width, height) {
      // eslint-disable-next-line new-cap
      const tmpGraph = new mxGraph(document.createElement("div"));
      const thumbBorder = 2;

      tmpGraph.labelsVisible = false;
      tmpGraph.view.scaleAndTranslate(1, 0, 0);

      this.instanceGraph(tmpGraph, item, 0, 0, width, height);

      const bounds = tmpGraph.getGraphBounds();
      const s =
        Math.floor(
          Math.min(
            (width - 2 * thumbBorder) / bounds.width,
            (height - 2 * thumbBorder) / bounds.height
          ) * 100
        ) / 100;

      tmpGraph.view.scaleAndTranslate(
        s,
        Math.floor((width - bounds.width * s) / 2 / s - bounds.x),
        Math.floor((height - bounds.height * s) / 2 / s - bounds.y)
      );

      const node = tmpGraph.view.getCanvas().ownerSVGElement.cloneNode(true);

      node.style.position = "relative";
      node.style.overflow = "hidden";
      // node.style.overflow = "auto";

      node.style.cursor = "move";
      node.style.width = `${width}px`;
      node.style.height = `${height}px`;
      node.style.left = `${thumbBorder}px`;
      node.style.top = `${thumbBorder}px`;
      node.style.display = "inline-block";
      return node;
    },
    instanceGraph(graph, shapeItem, x, y, width, height) {
      const parent = graph.getDefaultParent();
      graph.getModel().beginUpdate();
      try {
        const vertex = graph.insertVertex(
          parent,
          null,
          null,
          x,
          y,
          width,
          height,
          `shape=${shapeItem["name"]};`
        );

        vertex.customer = true;
      } finally {
        graph.getModel().endUpdate();
      }
    },
    addVertex(icon, w, h, style, toolbar) {
      // eslint-disable-next-line new-cap
      const vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);

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
      const funct = function(graph, evt, cell, x, y) {
        graph.stopEditing(false);
        const vertex = graph.getModel().cloneCell(prototype);

        vertex.geometry.x = x;
        vertex.geometry.y = y;

        graph.addCell(vertex);
        graph.setSelectionCell(vertex);
      };
      const img = toolbar.addMode(null, image, function(evt, cell) {
        const pt = this.graph.getPointForEvent(evt);

        funct(graph, evt, cell, pt.x, pt.y);
      });

      mxEvent.addListener(img, "mousedown", function(evt) {
        if (img.enabled === false) {
          mxEvent.consume(evt);
        }
      });

      mxEvent.addListener(img, "mouseenter", function(evt) {
        if (img.enabled === false) {
          mxEvent.consume(evt);
        }
        //img.style = "background: gainsboro";
      });

      mxEvent.addListener(img, "mouseleave", function(evt) {
        if (img.enabled === false) {
          mxEvent.consume(evt);
        }
        img.style = "background: white";
      });
      mxUtils.makeDraggable(img, graph, funct);
      return img;
    },

    logXML() {
      // eslint-disable-next-line new-cap
      var encoder = new mxCodec();
      var node = encoder.encode(this.graph.getModel());
      return mxUtils.getPrettyXml(node);
    },

    exportFile() {
      // eslint-disable-next-line new-cap
      var encoder = new mxCodec();
      var node = encoder.encode(this.graph.getModel());
      var xml = mxUtils.getXml(node);
      const blob = new Blob([xml], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, "车位.xml");
    },
    readFile(evt) {
      const file = evt.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        var txt = e.target.result;
        this.importModelXML(txt);
      };
      reader.readAsText(file);
    },
    importModelXML(xml) {
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
    },
    // colorChange() {
    //   this.graph.getModel().beginUpdate();
    //   try {
    //     const cells = this.graph.getSelectionCells();
    //     for (let i = 0; i < cells.length; i++) {
    //       this.graph
    //         .getModel()
    //         .setStyle(cells[i], "fillColor=" + this.color + ";");
    //     }
    //   } finally {
    //     this.graph.getModel().endUpdate();
    //   }
    // },
    importFile() {
      this.$refs.importInput.click();
    },
    deleteCells({ cells = [], includeEdges = false, multilevel = true }) {
      if (!cells || !(cells instanceof Array)) {
        throw new Error("cells 必须是一个数组");
      }
      const tmpSet = new Set(cells);

      if (multilevel) {
        cells.forEach(cell => {
          this.findDeleteCell(cell, tmpSet);
        });
      }
      this.graph.removeCells(Array.from(tmpSet), includeEdges);
    },
    findDeleteCell(cell, deleteSet) {
      deleteSet.add(cell);
      if (cell.edges) {
        cell.edges.forEach(tmpEdge => {
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
            includeEdges: true
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
        menu.addItem("前进", null, () => {
          this.redo();
        });
        menu.addItem("后退", null, () => {
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
          includeEdges: true
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

    uploadImgSuccess(response, file, fileList) {
      this.garageEdit.id = this.requestInfo.garageId;
      this.$set(this.garageEdit, "baseImg", response.data);
      update(this.garageEdit).then(response => {
        if (response.data) {
          this.changeBgImg(this.garageEdit.baseImg);
          this.uploadVisible = false;
          this.$message.success("相应车库图片上传更新成功");
        } else {
          this.$message.error("上传失败");
        }
      });
    },

    changeBgImg(url) {
      const width = this.$refs.container.offsetWidth;
      const height = this.$refs.container.offsetHeight;
      // eslint-disable-next-line new-cap
      var img = new mxImage(url, width, height);
      this.graph.setBackgroundImage(img);
      this.graph.view.validate();
    },

    // 非graph
    // getPro() {
    //   provinceList().then(response => {
    //     this.provinceList = response.data;
    //   });
    // },
    // proChange() {
    //   this.getCity();
    // },
    // getCity() {
    //   cityList({ areaId: this.requestInfo.provinceId }).then(response => {
    //     this.cityList = response.data;
    //   });
    // },
    // cityChange() {
    //   this.getCommuntiy();
    // },
    // getCommuntiy() {
    //   communityList({
    //     provinceId: this.requestInfo.provinceId,
    //     cityId: this.requestInfo.cityId
    //   }).then(response => {
    //     this.communityList = response.data;
    //   });
    // },
    // communityChange() {
    //   this.getGarage();
    // },
    // getGarage() {
    //   garageList({ communityId: this.requestInfo.communityId }).then(
    //     response => {
    //       this.garageList = response.data;
    //     }
    //   );
    // },
    save() {
      this.garageEdit.id = this.requestInfo.garageId;
      this.garageEdit.xmlInfo = this.logXML();
      update(this.garageEdit).then(response => {
        if (response.data) {
          this.$message.success("保存成功");
        } else {
          this.$message.success("保存失败");
        }
      });
    },

    importError(err, file, fileList) {
      this.$message.error("上传出现错误");
      console.log(err);
    },

    garageChange() {
      info({ id: this.requestInfo.garageId }).then(response => {
        this.garageEdit = response.data;
        this.changeBgImg(response.data.baseImg);
        this.importModelXML(response.data.xmlInfo);
      });
    },
    importBgImg() {
      if (!this.requestInfo.garageId) {
        this.$message.error("请先选择车库");
        return false;
      }
      this.uploadVisible = true;
    },

    // 文件大小限制提示
    beforeImgUpload(file) {
      if (!this.requestInfo.garageId) {
        this.$message.error("请先选择车库");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 100;
      if (!isLt2M) {
        this.$message.error("上传大小不能超过 100MB!");
      }
      return isLt2M;
    }
  }
};
</script>
 
<style  lang="scss">
.container {
  height: 400px;
}
.m_graph_container {
  position: absolute;
  // height: 90%;
  // width: calc(95% - 200px);
  // 画布大小
  width: 640px;
  height: 400px;
  margin-left: 200px;
  overflow: auto;
  #container {
    position: absolute;
    overflow: hidden;
    height: 400px;
    left: 0px;
    top: 0;
    right: 0px;
    bottom: 0;
    border-left: 1px solid #DCDFE6;
    // background-image: url("../../public/mxgraph/images/grid.gif");
  }
}
.sidebar {
  width: 200px;
  padding-left: 10px;
  border-right: 1px solid #DCDFE6;
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
</style>