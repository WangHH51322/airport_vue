<template>
  <div>
    <div style="margin-top: 20px">
      <el-form ref="form" label-width="40px">
        <el-form-item style="margin-left: 13px" icon="el-icon-data-line">
          <h2>
            <i class="el-icon-share"></i>
            流体参数:
          </h2>
        </el-form-item>
        <el-form-item >
          <el-col :span="5">
            <el-form-item label="密度单位" label-width="80px">
              <el-select v-model="projectUnits.densityUnit.unit" placeholder="请选择" @change="selectDensityUnit">
                <el-option
                  v-for="item in densityUnits"
                  :key="item.id"
                  :label="item.unit"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="运动粘度单位" label-width="120px">
              <el-select v-model="projectUnits.viscosityKinematicUnit.unit" placeholder="请选择" @change="selectViscosityKinematicUnit">
                <el-option
                  v-for="item in viscosityKinematicUnits"
                  :key="item.id"
                  :label="item.unit"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="动力粘度单位" label-width="120px">
              <el-select v-model="projectUnits.viscosityDynamicUnit.unit" placeholder="请选择" @change="selectViscosityDynamicUnit">
                <el-option
                  v-for="item in viscosityDynamicUnits"
                  :key="item.id"
                  :label="item.unit"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-button type="primary" @click="onSubmit" style="margin-left: 13px">立即保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
        <el-form-item style="margin-left: 13px">
          <h2>
            <i class="el-icon-paperclip"></i>
            单位管理:
          </h2>
        </el-form-item>
        <el-form-item >
          <el-col :span="5">
            <el-form-item label="单位类别" label-width="80px">
              <el-select v-model="physicalQuantityName" placeholder="请选择" @change="selectPhysicalQuantityId">
                <el-option
                  v-for="item in physicalQuantities"
                  :key="item.id"
                  :label="item.quantityName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <!--表格区域-->
      <template>
        <el-table
          :data="quantityUnits"
          border
          max-height="500"
          style="width: 1200px;margin-left: 10px">
          <el-table-column
            prop="unitName"
            label="单位名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="symbol"
            label="单位符号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="englishName"
            label="英文名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="factorA"
            label="换算系数A"
            width="130">
          </el-table-column>
          <el-table-column
            prop="factorB"
            label="换算系数B"
            width="130">
          </el-table-column>
          <el-table-column
            label="操作"
            width="300">
            <template slot-scope="scope">
              <el-button size="small" @click="">编辑</el-button>
              <el-button size="small" type="danger" @click="">删除</el-button>
              <el-button size="small" type="primary" @click="">进入项目</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: "basicDataUnit",
    data(){
      return{
        project : JSON.parse(window.sessionStorage.getItem("project")),
        densityUnits: [],
        viscosityKinematicUnits: [],
        viscosityDynamicUnits: [],
        projectUnits:{
          id:'',
          projectId:'',
          densityUnitId:'',
          viscosityKinematicUnitId:'',
          viscosityDynamicUnitId:'',
          lengthUnitId:'',
          diameterUnitId:'',
          wallThicknessUnitId:'',
          roughnessUnitId:'',
          densityUnit:{
            id:'',
            unit:'',
          },
          viscosityKinematicUnit:{
            id:'',
            unit:'',
          },
          viscosityDynamicUnit:{
            id:'',
            unit:'',
          },
        },
        physicalQuantityName:'质量',
        physicalQuantityId:1,
        physicalQuantities:[this.physicalQuantity],
        physicalQuantity:{
          id:'',
          unitNameIso:'',
          symbol:'',
          quantityName:'',
          englishName:'',
          unitSymbolIso:'',
        },
        quantityUnit:{
          id:'',
          unitName:'',
          englishName:'',
          symbol:'',
          factorA:'',
          factorB:'',
          unitSystemId:'',
          physicalQuantityId:'',
        },
        quantityUnits:[this.quantityUnit],
      }
    },
    mounted() {
      this.initPhysicalQuantities();
      this.initProjectUnits();
      this.initDensityUnits();
      this.initViscosityKinematicUnits();
      this.initViscosityDynamicUnits();
      this.initQuantityUnits();
    },
    methods:{
      onSubmit(){
        this.putRequest("/api/management/project/unit/", this.projectUnits).then(resp => {
          if (resp) {
            //this.$message(resp.msg);
          }
        })
      },
      selectViscosityDynamicUnit(value){
        this.projectUnits.viscosityDynamicUnitId = value;
        console.log(this.projectUnits.viscosityDynamicUnitId);
      },
      selectDensityUnit(value){
        this.physicalQuantityId = value;
        console.log(this.projectUnits.densityUnitId);
      },
      selectPhysicalQuantityId(value){
        this.physicalQuantityId = value;
        this.initQuantityUnits();
        console.log(this.physicalQuantityId);
      },
      selectViscosityKinematicUnit(value){
        this.projectUnits.viscosityKinematicUnitId = value;
        console.log(this.projectUnits.viscosityKinematicUnitId);
      },
      initProjectUnits(){
        this.getRequest("/api/management/project/unit/" + this.project.id).then(resp => {
          if (resp) {
            this.projectUnits = resp;
            console.log(this.projectUnits);
          }
        });
      },
      initViscosityDynamicUnits(){
        this.getRequest("/api/management/viscositydynamic/head/unit/").then(resp => {
          if (resp) {
            this.viscosityDynamicUnits = resp;
          }
        });
      },
      initViscosityKinematicUnits(){
        this.getRequest("/api/management/others/viscositykinematic/unit/").then(resp => {
          if (resp) {
            this.viscosityKinematicUnits = resp;
          }
        });
      },
      initDensityUnits(){
        this.getRequest("/api/management/liquid/density/unit/").then(resp => {
          if (resp) {
            this.densityUnits = resp;
          }
        });
      },
      initPhysicalQuantities(){
        this.getRequest("/api/unit/physicalQuantity/").then(resp => {
          if (resp) {
            this.physicalQuantities = resp;
          }
        });
      },
      initQuantityUnits(){
        this.getRequest("/api/unit/quantityUnit/physicalQuantity/" + this.physicalQuantityId).then(resp => {
          if (resp) {
            this.quantityUnits = resp;
          }
          //console.log(resp);
        });
      },
    }
  }
</script>

<style scoped>

</style>
