<!--  -->
<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/pump' }">泵</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.$route.params.pumpname}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="container">
        <div class="box">
            <div class="content_body">
                <div class="left">
                    <div class="left-header">请输入【{{this.$route.params.pumpname}}】基础数据</div>
                    <el-form class="left-body" :model="liutiData" :rules="liutiRules">
                        <el-form-item prop="temperature">
                            <div>状态参数：</div>
                            <div>
                                <span>温度(℃)：<el-input v-model="liutiData.temperature" placeholder="请输入定性温度"></el-input>
                                </span>
                            </div>
                        </el-form-item>
                        <br>
                        <el-form-item prop="density">
                            <div>基本物性：</div>
                            <div>
                                <span>密度(kg/m3)：<el-input v-model="liutiData.density" placeholder="请输入密度"></el-input>
                                </span>
                            </div>
                        </el-form-item>
                        <el-form-item prop="viscosity">
                            <div>
                                <span>粘度(mPa•s)：<el-input v-model="liutiData.viscosity" placeholder="请输入粘度"></el-input>
                                </span>
                            </div>
                        </el-form-item>
                        <el-form-item prop="rerong">
                            <div>
                                <span>热容(J/(kg•c))：<el-input v-model="liutiData.rerong" placeholder="请输入热容"></el-input>
                                </span>
                            </div>
                        </el-form-item>
                        <el-form-item prop="elastic">
                            <div>
                                <span>弹性模量(MPa)：<el-input v-model="liutiData.elastic" placeholder="请输入弹性模量"></el-input>
                                </span>
                            </div>
                        </el-form-item>
                        <br>
                        <el-col :span="16">
                            <el-form-item>
                                <el-button type="primary" @click="Confirm">确认</el-button>
                            </el-form-item>
                        </el-col>
                        <el-form-item>
                            <el-button type="primary" @click="Save">保存</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="right">
                    <div class="right-header">物性曲线 </div>

                    <div id="charts" class="containercharts"></div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import echarts from 'echarts';

export default {
    name: "pumpParams",
    data() {
        return {
            liutiData: {
                temperature: '',
                density: '',
                viscosity: '',
                rerong: '',
                elastic: '',
            },
            liutiRules: {
                temperature: [{
                    required: true,
                    message: '请输入定性温度',
                    trigger: 'blur'
                }, ],
                density: [{
                    required: true,
                    message: '请输入密度',
                    trigger: 'blur'
                }, ],
                viscosity: [{
                    required: true,
                    message: '请输入粘度',
                    trigger: 'blur'
                }, ],
                rerong: [{
                    required: true,
                    message: '请输入热容',
                    trigger: 'blur'
                }, ],
                elastic: [{
                    required: true,
                    message: '请输入弹性模量',
                    trigger: 'blur'
                }, ]
            }
        }
    },
    methods: {
        //触发图像
        Confirm() {
            console.log(this.liutiData);
        },
        func(x) {
            x /= 10;
            return 1+2*x;
        },

        generateData() {
            let data = [];
            for (let i = -200; i <= 200; i += 0.1) {
                data.push([i, this.func(i)]);
            }
            return data;
        }

    },
    mounted() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('charts'));

        // 指定图表的配置项和数据
        var option = {
            animation: false,
            grid: {
                top: 40,
                left: 50,
                right: 40,
                bottom: 50
            },
            xAxis: {
                name: 'x',
                min: 0,
                minorTick: {
                    show: true
                },
                splitLine: {
                    lineStyle: {
                        color: '#999'
                    }
                },
                minorSplitLine: {
                    show: true,
                    lineStyle: {
                        color: '#ddd'
                    }
                }
            },
            yAxis: {
                name: 'y',
                min: -100,
                max: 100,
                minorTick: {
                    show: true
                },
                splitLine: {
                    lineStyle: {
                        color: '#999'
                    }
                },
                minorSplitLine: {
                    show: true,
                    lineStyle: {
                        color: '#ddd'
                    }
                }
            },
            dataZoom: [{
                show: true,
                type: 'inside',
                filterMode: 'none',
                xAxisIndex: [0],
                startValue: -20,
                endValue: 20
            }, {
                show: true,
                type: 'inside',
                filterMode: 'none',
                yAxisIndex: [0],
                startValue: -20,
                endValue: 20
            }],
            series: [{
                type: 'line',
                showSymbol: false,
                clip: true,
                data: this.generateData()
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
}
</script>

<style lang="less" scoped>
.container {
    margin-top: 20px;
}

.box {
    height: 600px;
    line-height: 50px;
}

.left {
    height: 600px;
    width: 30%;
    float: left;
}

.right {
    height: 600px;
    width: 70%;
    float: right;
}

.left-header {
    text-align: center;
    font-size: 25px;
}

.el-input {
    width: 220px;
    float: right;
}

.right-header {
    text-align: center;
    font-size: 25px;
}

.el-button {
    display: block;
    margin: 0 auto;
}

.containercharts {
    margin-left: 100px;
    width: 900px;
    height: 600px;
}
</style>
