<template>
<div>
    <Row  :style="{padding: '0px',height:'400px'}">
        <Col span="6">
            <Card :style="{height:'269px'}">
                          <!-- 二级功能导航 -->
                <navigation1></navigation1>
            </Card>

            <Card :style="{height:'135px'}">
                          <!-- 绘图工具 -->
                <drawBox1></drawBox1>
            </Card>
        </Col>

        <Col span="12">
            <Card :style="{height:'405px'}">
                          主信息区/绘图区
            </Card>
        </Col>

        <Col span="6">
            <Card :style="{height:'405px'}">
                <!--  属性参数 attribute  -->
                <attribute1></attribute1>
            </Card>
            </Col>                    
    </Row>
    <!-- 2.3 Footer区域开始================================================= -->
                    <Content :style="{height:'100px'}">
                  <Row>
                    <Col span="6">
                      <Card :style="{height:'100px'}">
                        <!-- 视图切换 -->
                        <shituqiehuan1></shituqiehuan1>
                      </Card>
                    </Col>
                    <Col span="18">
                      <Card :style="{height:'100px'}">
                        <!-- 状态信息 -->
                        <stateParameter1></stateParameter1>
                      </Card>
                    </Col>
                  </Row>                  
                </Content>
<!-- 2.3 Footer区域结束================================================= -->
</div>
</template>
<script>
// 引入组件
    // footer
    import shituqiehuan1 from '@/components/wentai/shituqiehuan1'
    import navigation1 from '@/components/wentai/navigation1'
    import drawBox1 from '@/components/wentai/drawBox1'
    import attribute1 from '@/components/wentai/attribute1'
    import stateParameter1 from '@/components/wentai/stateParameter1'


    export default {
        name:'steady1',
        components: {shituqiehuan1,navigation1,drawBox1,attribute1,stateParameter1}
    }
</script>
<style  scoped>
</style>