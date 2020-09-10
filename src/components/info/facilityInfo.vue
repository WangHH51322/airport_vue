<!--  -->
<template>
  <div>
    <!-- 当前所在图层 -->
    <div v-if="layerName">图层:{{layerName}}</div>
    <!-- 选中节点 -->
    <div>
      <h3>节点信息</h3>
      <div>节点ID：{{nodeId}}</div>
      <div>节点类型：{{nodeType}}</div>
      <div>节点编号：{{nodeNumber}}</div>
    </div>
<!-- 根据节点类型，节点特有的参数 -->
    <div>
      <h3>参数：</h3>
      <div v-if="nodeType==='管道'">
        <div>{{parameters.pipe_length.name}}({{parameters.pipe_length.unit}}):{{parameters.pipe_length.value}}</div>
        <div>{{parameters.outside_diameter.name}}({{parameters.outside_diameter.unit}}):{{parameters.outside_diameter.value}}</div>
        <div>{{parameters.wall_thickness.name}}({{parameters.wall_thickness.unit}}):{{parameters.wall_thickness.value}}</div>
      </div>
    <div v-else>
        <div v-for="(value, key) in parameters " v-bind:key="key">{{key}}：{{value}}</div>
      </div>
<!-- 节点和上下游设备连接关系 -->
    <div>
      <h3>连接关系:</h3>
      <h4>上游设备：</h4>
      <div v-for="(sourceItem, sourceIndex) in source " :key="sourceIndex">
        <div>节点ID：{{sourceItem.id}}</div>
        <div>节点类型：{{sourceItem.type}}</div>
      </div>
      <h4>下游设备：</h4>
      <div v-for="(targetItem, targetIndex) in target" :key="targetIndex">
        <h5>No.{{targetIndex+1}}</h5>
        <div>节点ID：{{targetItem.id}}</div>
        <div>节点类型：{{targetItem.type}}</div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "facilityInfo",
  data() {
    return {};
  },

  computed: {
    ...mapState("graphInfo", ["nodeData", "layerData"]),
    nodeId() {
      return this.nodeData.id;
    },
    nodeType() {
      return this.nodeData.type;
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
    layerName() {
      if(this.layerData!=null){
if (this.layerData.name != null) {
        return this.layerData.name;
      } else {
        return null;
      }
      }
      
    },
    nodeNumber(){
        if (this.nodeData.nodeNumber != null) {
        return this.nodeData.nodeNumber;
      } else {
        return null;
      }
      }
  },

  methods: {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>