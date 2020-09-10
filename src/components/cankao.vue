<!Doctype html>
<html xmlns=http://www.w3.org/1999/xhtml>
<head>
<meta http-equiv=Content-Type content="text/html;charset=utf-8">
<title>图形布局</title>
 
<!-- 如果本文件的包与src不是在同一个目录,就要将basepath设置到src目录下 -->
<script type="text/javascript">
mxBasePath = '../src';
</script>
 
<!-- 引入支持库文件 -->
<script type="text/javascript" src="../src/js/mxClient.js"></script>
<!-- 示例代码 -->
<script type="text/javascript">
 
// 程序在此启动
function main(container)
{
// 检测浏览器兼容性
if (!mxClient.isBrowserSupported())
{
mxUtils.error('Browser is not supported!', 200, false);
}
else
{
// 在容器中创建图形
var graph = new mxGraph(container);
// 禁用选择和单元格处理
graph.setEnabled(false);
// 更改点风格的样式
var style = graph.getStylesheet().getDefaultVertexStyle();
style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
style[mxConstants.STYLE_FONTSIZE] = '10';
// 设置容器随内容自适应
//graph.setResizeContainer(true);
// 设置图大小
graph.gridSize = 40;
// 创建默认窗体
var parent = graph.getDefaultParent();
 
// 创建新的布局算法
var layout = new mxFastOrganicLayout(graph);
 
// 移动距离
layout.forceConstant = 80;
 
// 动画效果选项
var animate = document.getElementById('animate');
// 添加按钮来更新布局
document.body.insertBefore(mxUtils.button('圆形布局Circle Layout',
function(evt)
{
graph.getModel().beginUpdate();
try
{
// 创建圆形布局算法
var circleLayout = new mxCircleLayout(graph);
circleLayout.execute(parent);
}
catch (e)
{
throw e;
}
finally
{
if (animate.checked)
{
var morph = new mxMorphing(graph);
morph.addListener(mxEvent.DONE, function()
{
graph.getModel().endUpdate();
});
morph.startAnimation();
}
else
{
graph.getModel().endUpdate();
}
}
}
), document.body.firstChild);
//  添加按钮来更新布局
document.body.insertBefore(mxUtils.button('随机布局Organic Layout',
function(evt)
{
graph.getModel().beginUpdate();
try
{
layout.execute(parent);
}
catch (e)
{
throw e;
}
finally
{
if (animate.checked)
{
//默认值是 6, 1.5, 20
var morph = new mxMorphing(graph, 10, 1.7, 20);
morph.addListener(mxEvent.DONE, function()
{
graph.getModel().endUpdate();
});
morph.startAnimation();
}
else
{
graph.getModel().endUpdate();
}
}
}
), document.body.firstChild);
 
// 开启更新事务
graph.getModel().beginUpdate();
var w = 30;
var h = 30;
try
{
var v1 = graph.insertVertex(parent, null, 'A', 0, 0, w, h);
var v2 = graph.insertVertex(parent, null, 'B', 0, 0, w, h);
var v3 = graph.insertVertex(parent, null, 'C', 0, 0, w, h);
var v4 = graph.insertVertex(parent, null, 'D', 0, 0, w, h);
var v5 = graph.insertVertex(parent, null, 'E', 0, 0, w, h);
var v6 = graph.insertVertex(parent, null, 'F', 0, 0, w, h);
var v7 = graph.insertVertex(parent, null, 'G', 0, 0, w, h);
var v8 = graph.insertVertex(parent, null, 'H', 0, 0, w, h);
var e1 = graph.insertEdge(parent, null, 'ab', v1, v2);
var e2 = graph.insertEdge(parent, null, 'ac', v1, v3);
var e3 = graph.insertEdge(parent, null, 'cd', v3, v4);
var e4 = graph.insertEdge(parent, null, 'be', v2, v5);
var e5 = graph.insertEdge(parent, null, 'cf', v3, v6);
var e6 = graph.insertEdge(parent, null, 'ag', v1, v7);
var e7 = graph.insertEdge(parent, null, 'gh', v7, v8);
var e8 = graph.insertEdge(parent, null, 'gc', v7, v3);
var e9 = graph.insertEdge(parent, null, 'gd', v7, v4);
var e10 = graph.insertEdge(parent, null, 'eh', v5, v8);
// 执行更改
layout.execute(parent);
}
finally
{
// 结束更新事务
graph.getModel().endUpdate();
}
}
};
</script>
</head>
<!-- 页面载入时启动程序 -->
<body οnlοad="main(document.getElementById('graphContainer'))">
 
<!-- 创建带网格壁纸和曲线的一个容器，请一定要定义的position和overflow的属性！根据在线API的54 页内容增加的大小侦听器  -->
<div id="graphContainer"
style="position:relative;overflow:visible;width:821px;height:641px;background:url('editors/images/grid.gif');">
</div>
<br>
<input type="checkbox" id="animate" checked="checked"/> Transitions
</body>
</html>


<!Doctype html>
<html xmlns=http://www.w3.org/1999/xhtml>
<head>
<meta http-equiv=Content-Type content="text/html;charset=utf-8">
<title>Hello, World! example for mxGraph</title>
<!-- 如果不是在同一个目录的库,就设置根目录'mxBasePath' -->
<script type="text/javascript">
mxBasePath = '../src';
</script>
<!-- 加载和初始化库'mxClient.js' -->
<script type="text/javascript" src="../src/js/mxClient.js"></script>
 
<!-- 示例代码 -->
<script type="text/javascript">
//程序从这里开始。创建了一个示例图中的DOM节点与指定的ID。调用此函数时从onLoad事件处理程序的文件（见下文）
function main(container)
{
//检查浏览器是否支持
if (!mxClient.isBrowserSupported()) {
//如果浏览器不支持，显示错误信息。
mxUtils.error('Browser is not supported!', 200, false);
} else {
//能够实现在SVG中清晰呈现矩形，即：去锯齿效果
mxRectangleShape.prototype.crisp = true;
//在给定的容器中创建的图形
var graph = new mxGraph(container);
 
//设置容器自动调整大小
//graph.setResizeContainer(true);
//允许弹性选项
new mxRubberband(graph);
// 在对象中创建默认组件
var parent = graph.getDefaultParent();
//在图形中插入组件
//开启模型的事务
graph.getModel().beginUpdate();
try {
//插入点
var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
//插入线
var e1 = graph.insertEdge(parent, null, '', v1, v2);
}
finally {
//事务结束
graph.getModel().endUpdate();//"G:/mxgraph-1_10_4_2/mxgraph/javascript/examples/control.html"
}
}
};
</script>
</head>
<!-- 页面载入时启动程序 -->
<body οnlοad="main(document.getElementById('graphContainer'))">
<!-- 创建带网格壁纸和曲线的一个容器 -->
<div id="graphContainer" 
style="position:relative;overflow:hidden;width:321px;height:241px;background:url('../examples/editors/images/grid.gif');cursor:default;">
</div>
</body>
</html>
