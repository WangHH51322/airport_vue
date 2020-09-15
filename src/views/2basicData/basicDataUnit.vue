<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick"
    style="margin-top: 20px;margin-left: 20px;width: auto">
      <!--项目单位-->
      <el-tab-pane label="项目单位" name="projectUnits">
        <!--单位系统-->
        <div style="margin-top: 20px">
          <el-form size="small" :inline="true" class="demo-form-inline" width="auto">
            <el-form-item label="单位系统:" label-width="80px" width="auto">
              <el-select
                v-model="switchValue"
                placeholder="请选择"
                @change="switchChange()"
                style="width:100px"
              >
                <el-option
                  v-for="item in unitSystem"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <!--<el-button type="primary" size="mini" @click="getUnit(scope.row)">刷新</el-button>-->
        <!--单位表格-->
        <div style="margin-top: 20px">
          <el-table
            :data="projectUnits"
            border
            max-height="500"
            style="width:20%;"
            :header-cell-style="headerCellStyle"
            :cell-style="cellStyle"
          >
            <el-table-column prop="variableName" label="物理量名称"></el-table-column>
            <el-table-column label="单位" width="100" >
              <template slot-scope="scope">
                <!-- 普通选择器 -->
                <el-select
                  v-model="scope.row.variableUnitId"
                  placeholder="请选择"
                  size="small"
                  style="radius:false"
                  @visible-change="getUnit(scope.row)"
                  @change="changeUnit(scope.row)"
                >
                  <!-- $event:回调参数_改变后的值，scope.$index：行号，scope.row：这一行数据 -->
                  <el-option
                    v-for="item in selectOptions"
                    :key="item.id"
                    :label="item.symbol"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <!--*************************************************************-->
      <!--单位管理-->
      <el-tab-pane label="单位管理" name="unitManagement">
        <div style="margin-top: 20px;margin-left:-40px">
          <el-form ref="form" label-width="40px">
            <el-form-item style="margin-left: 13px">
              <h2>
                <i class="el-icon-paperclip"></i>
                单位管理:
              </h2>
              <!--单位制切换-->
              <el-switch
                class="tablescope"
                v-model="switchValue"
                active-value="2"
                inactive-value="1"
                active-text="英制"
                inactive-text="公制"
                @change = "switchChange"
              >
              </el-switch>
            </el-form-item>
            <!--物理量(单位类别)下拉框-->
            <el-form-item >
              <el-col :span="5">
                <el-form-item label="单位类别" label-width="80px">
                  <el-select v-model="physicalQuantityName" placeholder="请选择" @change="selectPhysicalQuantityId">
                    <el-option
                      v-for="item in physicalQuantities"
                      :key="item.id"
                      :label="item.quantityName"
                      :value="item.id"
                    >
                      {{item.quantityName}}
                      <el-button type="primary" size="mini" style="margin-left: 70px" @click="updatePhysicalQuantity(item)">
                        编辑
                      </el-button>
                    </el-option>
                    <el-button
                      icon="el-icon-plus" circle size="medium"
                      @click="dialogVisible2 = true"
                      style="margin-top:5px;margin-left:65px;color: red"></el-button>
                    <!--<el-button type="success" icon="el-icon-check" circle size="medium"
                      @click="getAllPhysicalQ"></el-button>-->
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-form>
          <!--单位类别编辑框-->
          <el-dialog
            title="编辑"
            :visible.sync="dialogVisible1"
            width="30%">
        <span>
          <el-form :model="updatePhysicalQ"
                   label-width="100px"
                   :rules="rules"
                   ref="updatePhysicalQ">
            <el-form-item label="物理量名称" prop="quantityName">
              <el-input v-model="updatePhysicalQ.quantityName"></el-input>
            </el-form-item>
            <el-form-item label="英文名称" prop="englishName">
              <el-input v-model="updatePhysicalQ.englishName"></el-input>
            </el-form-item>
            <el-form-item label="物理量符号" prop="symbol">
              <el-input v-model="updatePhysicalQ.symbol"></el-input>
            </el-form-item>
            <el-form-item label="国标单位" prop="unitNameIso">
              <el-input v-model="updatePhysicalQ.unitNameIso"></el-input>
            </el-form-item>
            <el-form-item label="单位符号" prop="unitSymbolIso">
              <el-input v-model="updatePhysicalQ.unitSymbolIso"></el-input>
            </el-form-item>
          </el-form>
        </span>
            <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="doUpdatePhysicalQ('updatePhysicalQ')">确 定</el-button>
        </span>
          </el-dialog>
          <!--单位类别新增框-->
          <el-dialog
            title="新建"
            :visible.sync="dialogVisible2"
            width="30%">
        <span>
          <el-form :model="physicalQuantity"
                   label-width="100px"
                   :rules="rules"
                   ref="physicalQuantity">
            <el-form-item label="物理量名称" prop="quantityName">
              <el-input v-model="physicalQuantity.quantityName"></el-input>
            </el-form-item>
            <el-form-item label="英文名称" prop="englishName">
              <el-input v-model="physicalQuantity.englishName"></el-input>
            </el-form-item>
            <el-form-item label="物理量符号" prop="symbol">
              <el-input v-model="physicalQuantity.symbol"></el-input>
            </el-form-item>
            <el-form-item label="国标单位" prop="unitNameIso">
              <el-input v-model="physicalQuantity.unitNameIso"></el-input>
            </el-form-item>
            <el-form-item label="单位符号" prop="unitSymbolIso">
              <el-input v-model="physicalQuantity.unitSymbolIso"></el-input>
            </el-form-item>
          </el-form>
        </span>
            <span slot="footer" class="dialog-footer">
          <el-button @click="cancelPhysicalQ">取 消</el-button>
          <el-button type="primary" @click="addPhysicalQ('physicalQuantity')">确 定</el-button>
        </span>
          </el-dialog>
        </div>

        <div>
          <el-card class="box-card"
          style="margin-left: 5px;width: 1120px">
            <!--表格区域-->
            <template>
              <el-table
                type="border-card"
                :data="quantityUnits"
                border
                max-height="400"
                style="width: 1100px;margin-left: 0px">
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
                  prop="chineseName"
                  label="单位类别"
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
                    <el-button size="small" @click="showEditView(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-card>
          <!--新建单位按钮-->
          <el-button size="medium" type="primary"
                     style="margin-left: 10px;margin-top: 20px"
                     icon="el-icon-plus"
                     @click="addQuantityUnit">
            新建单位
          </el-button>
          <!--单位转换工具-->
          <el-popover
            placement="right"
            width="550"
            v-model="dialogVisible5">
            <el-button slot="reference" >单位转换</el-button>
            <el-form label-width="100px">
              <el-input v-model="unitTransfer.quantityUnitValueA" placeholder="结果值" style="width: 100px" :disabled="true">123</el-input>
              <el-select v-model="unitTransfer.quantityUnitA" placeholder="请选择" style="width: 100px">
                <el-option
                  v-for="item in quantityUnits2"
                  :key="item.id"
                  :label="item.symbol"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              =
              <el-input v-model="unitTransfer.quantityUnitValueB" placeholder="输入值" style="width: 100px"></el-input>
              <el-select v-model="unitTransfer.quantityUnitB" placeholder="请选择" style="width: 100px">
                <el-option
                  v-for="item in quantityUnits2"
                  :key="item.id"
                  :label="item.symbol"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-divider direction="vertical"></el-divider>
              <el-button size="medium" type="success" @click="transferQuantityUnit">转换</el-button>
            </el-form>
          </el-popover>

          <!--物理量单位新增框-->
          <el-dialog
            title="新建单位"
            :visible.sync="dialogVisible3"
            width="30%">
        <span>
          <el-form :model="quantityUnit"
                   label-width="100px"
                   :rules="rules"
                   ref="quantityUnit">
            <el-form-item label="单位类别:" >
              <span v-model="quantityUnit.chineseName">{{getPhysicalQ.quantityName}}</span>
            </el-form-item>
            <el-form-item label="单位名称:" prop="unitName">
              <el-input v-model.trim="quantityUnit.unitName"></el-input>
            </el-form-item>
            <el-form-item label="单位符号" prop="symbol">
              <el-input v-model.trim="quantityUnit.symbol"></el-input>
            </el-form-item >
            <el-form-item label=" = ">
              <el-col :span="11">
                <el-form-item prop="factorA">
                  <el-input v-model.trim="quantityUnit.factorA" placeholder="换算系数A" style="width: 100px"></el-input>
                  * {{getPhysicalQ.unitSymbolIso}} +
                </el-form-item>
             </el-col>
              <el-col :span="11">
                <el-form-item prop="factorB">
                  <el-input v-model.trim="quantityUnit.factorB" placeholder="换算系数B" style="width: 100px"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="单位制" prop="unitSystemId">
              <el-select v-model="quantityUnit.unitSystemId" placeholder="请选择">
                <el-option
                  v-for="item in unitSystem"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物理量:" >
              <span v-model="quantityUnit.physicalQuantityId">{{getPhysicalQ.quantityName}}</span>
            </el-form-item>
          </el-form>
        </span>
            <span slot="footer" class="dialog-footer">
          <el-button @click="cancelQuantityU">取 消</el-button>
          <el-button type="primary" @click="confirmQuantityU('quantityUnit')">确 定</el-button>
        </span>
          </el-dialog>
          <!--物理量单位修改框-->
          <el-dialog
            title="修改单位"
            :visible.sync="dialogVisible4"
            width="30%">
        <span>
          <el-form :model="updateQuantityUnit"
                   label-width="100px"
                   :rules="rules"
                   ref="updateQuantityUnit">
            <el-form-item label="单位类别:" >
              <span v-model="updateQuantityUnit.chineseName">{{getPhysicalQ.quantityName}}</span>
            </el-form-item>
            <el-form-item label="单位名称:" prop="unitName">
              <el-input v-model.trim="updateQuantityUnit.unitName"></el-input>
            </el-form-item>
            <el-form-item label="单位符号" prop="symbol">
              <el-input v-model.trim="updateQuantityUnit.symbol"></el-input>
            </el-form-item >
            <el-form-item label=" = ">
              <el-col :span="11">
                <el-form-item prop="factorA">
                  <el-input v-model.trim="updateQuantityUnit.factorA" placeholder="换算系数A" style="width: 100px"></el-input>
                  * {{getPhysicalQ.unitSymbolIso}} +
                </el-form-item>
             </el-col>
              <el-col :span="11">
                <el-form-item prop="factorB">
                  <el-input v-model.trim="updateQuantityUnit.factorB" placeholder="换算系数B" style="width: 100px"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-form>
        </span>
            <span slot="footer" class="dialog-footer">
          <el-button @click="cancelUpdateQuantityU">取 消</el-button>
          <el-button type="primary" @click="confirmUpdateQuantityU('updateQuantityUnit')">确 定</el-button>
        </span>
          </el-dialog>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  export default {
    name: "basicDataUnit",
    data(){
      return{
        /*默认激活的标签页*/
        activeName: 'unitManagement',
        /*表单验证规则*/
        rules: {
          symbol: [
            {required: true,message: '请输入值', trigger: 'blur'}
          ],
          factorA: [
            {required: true,message: '请输入转换系数A', trigger: 'blur'}
          ],
          factorB: [
            {required: true,message: '请输入转换系数B', trigger: 'blur'}
          ],
          unitSystemId: [
            {required: true,message: '请选择单位制', trigger: 'change'}
          ],
          quantityName: [
            {required: true,message: '请输入物理量名', trigger: 'blur'}
          ],
          englishName: [
            {required: true,message: '请输入英文名', trigger: 'blur'}
          ],
          unitNameIso: [
            {required: true,message: '请输入国标单位', trigger: 'blur'}
          ],
          unitName: [
            {required: true,message: '请输入单位名称', trigger: 'blur'}
          ],
          unitSymbolIso: [
            {required: true,message: '请输入单位符号', trigger: 'blur'}
          ],
        },
        /*单位转化_页面参数对象*/
        unitTransfer:{
          quantityUnitA:'',
          quantityUnitB:'',
          quantityUnitValueA:'',
          quantityUnitValueB:'',
        },
        /*单位转化_接收后端参数对象*/
        unitTransfer2:{
          quantityUnitValueA:'',
        },
        /*新建单位时单位制选择下拉框的选项*/
        unitSystem:[{
            id: '1',
            name: '公制'
          }, {
            id: '2',
            name: '英制'
          }],
        /*1-5个表单是否展示的判断值*/
        dialogVisible1:false,
        dialogVisible2:false,
        dialogVisible3:false,
        dialogVisible4:false,
        dialogVisible5:false,
        /*单位制选择器默认值*/
        switchValue:"1",
        /*记录从哪个项目进入此页面*/
        project : JSON.parse(window.sessionStorage.getItem("project")),
        /*单位类别下拉框默认值和id*/
        physicalQuantityName:'质量',
        physicalQuantityId:1,
        /*接收后端单位类别对象*/
        physicalQuantities:[],
        /*单位类别下拉框编辑对象*/
        updatePhysicalQ:{
          id:'',
          unitNameIso:'',
          symbol:'',
          quantityName:'',
          englishName:'',
          unitSymbolIso:'',
        },
        /*记录在下拉框中选中了那个单位类别*/
        getPhysicalQ:{
          id:'',
          unitNameIso:'',
          symbol:'',
          quantityName:'',
          englishName:'',
          unitSymbolIso:'',
        },
        /*单独一个物理量(单位类别)对象*/
        physicalQuantity:{
          id:'',
          unitNameIso:'',
          symbol:'',
          quantityName:'',
          englishName:'',
          unitSymbolIso:'',
        },
        /*接收后端物理量单位*/
        quantityUnits:[],
        /*单位转换工具中下拉框内的物理量单位*/
        quantityUnits2:[],
        /*具体某一个物理量单位*/
        quantityUnit:{
          id:'',
          unitName:'',
          chineseName:'',
          englishName:'',
          symbol:'',
          factorA:'',
          factorB:'',
          unitSystemId:'',
          physicalQuantityId:'',
        },
        /*暂时没作用,别乱删*/
        getQuantityUnit:{
          id:'',
          unitName:'',
          chineseName:'',
          englishName:'',
          symbol:'',
          factorA:'',
          factorB:'',
          unitSystemId:'',
          physicalQuantityId:'',
        },
        /*记录编辑后的物理量单位对象*/
        updateQuantityUnit:{
          id:'',
          unitName:'',
          chineseName:'',
          englishName:'',
          symbol:'',
          factorA:'',
          factorB:'',
          unitSystemId:'',
          physicalQuantityId:'',
        },
        /*项目单位下拉框中可选的单位*/
        selectOptions:[],
        /*项目中包含的全部物理量参数*/
        projectUnits:[],
        /*表格中展示的每行物理量参数*/
        projectUnit:{
          id:'',
          projectId:'',
          projectVariable:'',
          variableName:'',
          variableUnitId:'',
          variableUnitSymbol:'',
          variableUnitType:'',
        },
        /*每一行默认的单位初值*/
        variableUnitId:'',
      }
    },
    mounted() {
      this.initPhysicalQuantities();
      this.initQuantityUnits();
      this.initPhysicalQuantityById(this.physicalQuantityId)
      this.initProjectUnit();
    },
    methods:{
      /*初始化项目单位*/
      /*这里的quantityUnit调用的是前面data中的初始化的变量可能会出bug,调试的时候注意一下*/
      initProjectUnit(){
        this.getRequest("/api/unit/projectUnit/projectId/" + this.project.id).then(resp => {
          if (resp) {
            this.projectUnits = resp;
            this.projectUnits.forEach((item, index) => {
              this.getRequest("/api/unit/quantityUnit/" + item.variableUnitId).then(resp2 => {
                if (resp2) {
                  Object.assign(this.quantityUnit,resp2);
                  item.variableUnitSymbol = this.quantityUnit.symbol;
                  this.quantityUnit = {
                    id:'',
                    unitName:'',
                    chineseName:'',
                    englishName:'',
                    symbol:'',
                    factorA:'',
                    factorB:'',
                    unitSystemId:'',
                    physicalQuantityId:'',
                  };
                  // console.log("variableUnitSymbol");
                  // console.log(item.variableUnitSymbol);
                }
              });
                //console.log(item)
            });
            // console.log("开始");
            // console.log(this.projectUnits);
          }
        });
        this.getRequest("/api/unit/quantityUnit/").then(resp3 => {
          if (resp3) {
            this.selectOptions = resp3;
            console.log(this.selectOptions);
          }
        });
      },
      //表头css
      headerCellStyle() {
        return "text-align:center;padding:8px";
      },
      //每个小表格css
      cellStyle() {
        return "text-align:center;padding:1px;height:50px";
      },
      //请求物理量所有单位
      getUnit(row){
        Object.assign(this.projectUnit,row);
        this.getRequest("/api/unit/quantityUnit/physicalQuantity/?id1=" + this.projectUnit.variableUnitType + "&id2=" + this.switchValue).then(resp => {
          if (resp) {
            this.selectOptions = resp;
            //console.log(this.selectOptions);
          }
        });
      },
      /*物理量单位的下拉框选中值改变时*/
      changeUnit(row){
        // console.log("切换");
        // console.log(row);
        // Object.assign(this.projectUnitTransfer,row);
        // console.log("多行");
        // console.log(this.projectUnitTransfer);
        this.putRequest("/api/unit/projectUnit/", row).then(resp => {
          if (resp) {
            this.initProjectUnit();
          }
        });
      },

      /*标签页点击切换事件*/
      handleClick(tab, event) {
        //console.log(tab, event);
      },
      /*单位转换"确定"点击事件*/
      transferQuantityUnit(){
        // console.log(this.unitTransfer.quantityUnitA)
        // console.log(this.unitTransfer.quantityUnitB)
        // console.log(this.unitTransfer.quantityUnitValueB)
        if (this.unitTransfer.quantityUnitA && this.unitTransfer.quantityUnitB && this.unitTransfer.quantityUnitValueB){
          this.getRequest("/api/unit/unitTransfer/?quantityUnitIdA=" + this.unitTransfer.quantityUnitA +
            "&quantityUnitIdB=" + this.unitTransfer.quantityUnitB +
            "&quantityUnitValueB=" + this.unitTransfer.quantityUnitValueB).then(resp => {
            if (resp) {
              this.unitTransfer2 = resp;
              this.unitTransfer.quantityUnitValueA =  this.unitTransfer2.quantityUnitValueA;
              //console.log(this.unitTransfer);
            }
          })
        }else {
          this.$message('单位与输入值不可为空!!!!');
        }
      },
      /*物理量单位"删除"点击事件*/
      handleDelete(row){
        this.$confirm('此操作将永久单位' + row.symbol + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("/api/unit/quantityUnit/" + row.id).then(resp => {
            if (resp) {
              this.initQuantityUnits();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      /*物理量单位更新"取消"点击事件*/
      cancelUpdateQuantityU(){
        this.updateQuantityUnit = {
          id:'',
          unitName:'',
          englishName:'',
          chineseName:'',
          symbol:'',
          factorA:'',
          factorB:'',
          unitSystemId:'',
          physicalQuantityId:'',
        };
        this.dialogVisible4 = false;
      },
      /*物理量单位更新"确定"点击事件*/
      confirmUpdateQuantityU(data){
        this.$refs[data].validate((valid) => {
          if (valid) {
            this.putRequest("/api/unit/quantityUnit/", this.updateQuantityUnit).then(resp => {
              if (resp) {
                this.initQuantityUnits();
                this.updateQuantityUnit = {
                  id:'',
                  unitName:'',
                  englishName:'',
                  chineseName:'',
                  symbol:'',
                  factorA:'',
                  factorB:'',
                  unitSystemId:'',
                  physicalQuantityId:'',
                };
                this.dialogVisible4 = false;
              }
            });
          } else {
            alert('请重新输入!!!');
            return false;
          }
        });
      },
      /*物理量单位更新表单"出现"事件*/
      showEditView(row){
        this.dialogVisible4 = true;
        Object.assign(this.updateQuantityUnit,row);
        console.log(this.updateQuantityUnit);
      },
      /*物理量单位新建表单"出现"事件*/
      addQuantityUnit(){
        this.dialogVisible3 = true;
      },
      /*物理量单位新建"确定"点击事件*/
      confirmQuantityU(data){
        this.quantityUnit.chineseName = this.getPhysicalQ.quantityName;
        this.quantityUnit.englishName = this.getPhysicalQ.englishName;
        this.quantityUnit.physicalQuantityId = this.getPhysicalQ.id;
        this.$refs[data].validate((valid) => {
          if (valid) {
            this.postRequest("/api/unit/quantityUnit/", this.quantityUnit).then(resp => {
              if (resp) {
                this.initQuantityUnits();
                this.quantityUnit = {
                  id:'',
                  unitName:'',
                  chineseName:'',
                  englishName:'',
                  symbol:'',
                  factorA:'',
                  factorB:'',
                  unitSystemId:'',
                  physicalQuantityId:'',
                };
                this.dialogVisible3 = false;
              }
            });
          } else {
            alert('请重新输入!!!');
            //this.addQuantityUnit();
            return false;
          }
        });
        // if (this.quantityUnit.symbol &&
        //   this.quantityUnit.factorA &&
        //   this.quantityUnit.factorB &&
        //   this.quantityUnit.unitSystemId) {
        //
        // }else {
        //   this.$message('输入框不可为空!!!!');
        //   this.addQuantityUnit();
        // }
        //console.log(this.quantityUnit);
      },
      /*物理量单位新建"取消"点击事件*/
      cancelQuantityU(){
        this.quantityUnit={
          id:'',
          unitName:'',
          chineseName:'',
          englishName:'',
          symbol:'',
          factorA:'',
          factorB:'',
          unitSystemId:'',
          physicalQuantityId:'',
        };
        this.dialogVisible3 = false;
      },
      /*物理量(单位类别)新建"确定"点击事件*/
      addPhysicalQ(data){
        this.$refs[data].validate((valid) => {
          if (valid) {
            this.postRequest("/api/unit/physicalQuantity/", this.physicalQuantity).then(resp => {
              if (resp) {
                this.initPhysicalQuantities();
                this.physicalQuantity = {
                  id:'',
                  unitNameIso:'',
                  symbol:'',
                  quantityName:'',
                  englishName:'',
                  unitSymbolIso:''
                };
                this.dialogVisible2 = false;
              }
            });
          } else {
            alert('请重新输入!!!');
            return false;
          }
        });
      },
      /*物理量(单位类别)新建"取消"点击事件*/
      cancelPhysicalQ(){
        this.physicalQuantity = {
          id:'',
          unitNameIso:'',
          symbol:'',
          quantityName:'',
          englishName:'',
          unitSymbolIso:''
        };
        this.dialogVisible2 = false;
      },
      /*物理量(单位类别)更新"确定"点击事件*/
      doUpdatePhysicalQ(data){
        this.$refs[data].validate((valid) => {
          if (valid) {
            this.putRequest("/api/unit/physicalQuantity/", this.updatePhysicalQ).then(resp => {
              if (resp) {
                this.initPhysicalQuantities();
              }
            });
            this.dialogVisible1 = false;
          } else {
            alert('请重新输入!!!');
            return false;
          }
        });
      },
      /*物理量(单位类别)更新表单"出现"事件*/
      updatePhysicalQuantity(data){
        Object.assign(this.updatePhysicalQ,data);
        //console.log(this.updatePhysicalQ);
        this.dialogVisible1 = true;
      },
      // getAllPhysicalQ(){
      //   this.getRequest("/api/unit/quantityUnit/physicalQuantity/unitSystem/" + this.switchValue).then(resp => {
      //       if (resp) {
      //         this.quantityUnits = resp;
      //         this.quantityUnits2 = resp;
      //         //console.log(this.quantityUnits)
      //         //console.log(this.switchValue);
      //       }
      //     });
      // },
      /*单位制切换事件*/
      switchChange(){
        this.initQuantityUnits();
        console.log(this.switchValue);
      },
      /*记录单位制切换后的单位制id*/
      selectPhysicalQuantityId(value){
        this.physicalQuantityId = value;
        this.initQuantityUnits();
        this.initPhysicalQuantityById(this.physicalQuantityId);
        this.dialogVisible5 = false;
      },
      /*物理量(单位类别)初始化事件*/
      initPhysicalQuantities(){
        this.getRequest("/api/unit/physicalQuantity/simple/").then(resp => {
          if (resp) {
            this.physicalQuantities = resp;
            //console.log(this.physicalQuantities);
          }
        });
      },
      /*根据单位制id查询物理量(单位类别)初始化事件*/
      initPhysicalQuantityById(id){
        this.getRequest("/api/unit/physicalQuantity/simple/" + id).then(resp => {
          if (resp) {
            this.getPhysicalQ = resp;
            // console.log(this.getPhysicalQ);
            // console.log(this.getPhysicalQ.id)
          }
        });
      },
      /*根据单位制id和物理量id查询物理量单位初始化*/
      initQuantityUnits(){
        this.getRequest("/api/unit/quantityUnit/physicalQuantity/?id1=" + this.physicalQuantityId + "&id2=" + this.switchValue)
          .then(resp => {
          if (resp) {
            this.quantityUnits = resp;
            this.initQuantityUnits2();
            //console.log(this.quantityUnits)
            //console.log(this.switchValue);
          }
        });
      },
      /*根据物理量id查询物理量单位初始化*/
      initQuantityUnits2(){
        this.getRequest("/api/unit/quantityUnit/physicalQuantity/?id1=" + this.physicalQuantityId)
          .then(resp => {
          if (resp) {
            this.quantityUnits2 = resp;
          }
        });
      },
    }
  }
</script>

<style lang="scss">
/*  .tablescope{
    .el-switch__label--left {
      position: relative;
      left: 60px;
      color: #fff;
      z-index: -1111;
    }
    .el-switch__core{
      width: 65px !important;
      height: 24px;
    }
    .el-switch__core::after{
      width:18px;
      height:18px;
      margin-top:1px;
      margin-bottom: 2px;
    }

    .el-switch__label--right {
      position: relative;
      right: 60px;
      color: #fff;
      z-index: -1111;
    }
    .el-switch__label--right.is-active {
      z-index: 1111;
      color: #fff !important;

    }
    .el-switch__label--left.is-active {
      z-index: 1111;
      color: #9c9c9c !important;
    }
  }*/
</style>

