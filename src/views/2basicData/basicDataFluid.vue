<template>
  <!-- 具体流体的编辑界面 -->
  <div class="container">
    <div class="breadcrumbTitle">
      <el-breadcrumb separat
      or-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/basicData/basicData1' }">基础数据</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/basicData/basicDataFluid'}">流体</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
          <div style="margin-left:auto;float:right"><el-button
            type="primary"
             icon="el-icon-plus"
            size="small"
             style="margin-left:20px"
             @click.native="inFluid();"
           >保存并返回流体列表</el-button></div>
    <div style="padding:30px">
     <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="密度" name="first">
      <!-- 密度表单 -->
          <div class="item">
            <div style="margin:30px 0 0 0">
              <el-checkbox v-model="densitychecked">常量</el-checkbox>
            </div>

            <div style="margin:5px 0 15px 0">
              <div style="display:flex">
                <el-input v-model="fluidForm.density" size="mini" style="width:200px"></el-input>
                <div style="width:800px;">
                  <div style="margin-left:30px;">
                    {{densityunit}}
                    
                  </div>
                </div>
              </div>
            </div>
            <el-divider></el-divider>
            <div style="display:flex;margin-top:10px ">
              <!--手动输入温度-密度曲线  -->
              <el-checkbox v-model="manuldensitychecked">手动输入温度-密度曲线</el-checkbox>
            </div>
            <div class="duoxiangshi">
              <el-tabs type="card">
                <el-tab-pane>
                  <span slot="label">多项式</span>
                  <!-- 多项式输入 -->
                  <div class="vaporPressure">
                    <!-- 系数输入框 -->
                    <div class="item">
                      <div class="equations">
                        <div style="height:auto">d</div>
                        <div>=</div>
                        <div>
                          <el-input size="small" style="width:100px"></el-input>
                        </div>
                        <div>T</div>
                        <div>+</div>
                        <div>
                          <el-input size="small" style="width:100px"></el-input>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style="margin:20px 0 0 0">
                    单位：
                    <div style="padding:10px">
                      d(密度)：
                     {{densityunit}}
                    </div>
                    <div style="padding:10px">
                      T(温度)：
                      {{temperatureunit}}
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="相对密度公式">
                  <div class="relativeDensity">
                    <!-- 20℃密度输入框 -->
                    <div class="item">
                      d
                      <sub>4</sub>
                      <sup style="margin-left:-12px">20</sup>=
                      <el-input size="mini" style="width:100px"></el-input>
                    </div>
                    <!-- 密度温度公式手动输入框 -->
                    <div class="item">
                      d
                      <sub>4</sub>=d
                      <sub>4</sub>
                      <sup style="margin-left:-12px">20</sup>-
                      <el-input size="mini" placeholder="s" style="width:100px"></el-input>(T-20)
                    </div>
                    <!-- 公式解释 -->
                    <div class="item">
                      d
                      <sub>4</sub>——油品的相对密度
                      <br />d
                      <sub>4</sub>
                      <sup style="margin-left:-12px;">20</sup>——油品在20℃时的相对密度
                      <br />s——温度系数
                      <br />
                      <div>
                        T——油品温度
                        {{temperatureunit}}
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
            <el-divider></el-divider>
            <!-- 在线拟合温度-密度曲线 -->
            <el-checkbox v-model="autodensitychecked">在线拟合温度-密度曲线：</el-checkbox>
            <div style="height:auto;overflow:hidden;margin:5px 0 15px 0">
              <density-table></density-table>
            </div>
            <div>拟合结果：</div>
            <div>
              <div class="equations">
                <div style="height:auto">d</div>
                <div>=</div>
                <div>
                  <el-input size="small" style="width:100px"></el-input>
                </div>
                <div>T</div>
                <div>+</div>
                <div>
                  <el-input size="small" style="width:100px"></el-input>
                </div>
              </div>
            </div>
          </div>
          <!-- 密度表单结束 -->
    </el-tab-pane>
    <el-tab-pane label="粘度" name="second">粘度</el-tab-pane>
    <el-tab-pane label="饱和蒸气压" name="third">饱和蒸气压</el-tab-pane>
    <el-tab-pane label="体积弹性系数" name="fourth">体积弹性系数</el-tab-pane>
    <el-tab-pane label="比热容" name="fifth">比热容</el-tab-pane>
  </el-tabs>
  </div>
  </div>
</template>    
<script>

    // <!-- <el-form :model="fluidName" size="small">
    //   <el-row class="nameROW">
    //     <div class="title">
    //       <el-form-item
    //         label="液体名称："
    //         prop="name"
    //         class="nameInput"
    //         label-width="110px"
    //         label-position="right"
    //       >
    //         <el-input v-model="fluidForm.name"></el-input>
    //       </el-form-item>
    //     </div>
    //     <div style="margin-left:auto"><el-button
    //         type="primary"
    //         icon="el-icon-plus"
    //         size="small"
    //         style="margin-left:20px"
    //         @click.native="inFluid();"
    //       >保存并返回流体列表</el-button></div>
    //   </el-row>
    // </el-form>

    // <el-form :model="fluidForm" size="small" label-width="110px" label-position="top">
    //   <div class="flex">
    //     <div class="columns">
    
    //       <!--饱和蒸汽压表单  -->
    //       <div class="item">
    //         <h1>饱和蒸汽压：</h1>
    //         <el-checkbox v-model="checked" style="margin-top:30px">常量</el-checkbox>
    //         <div style="display:flex">
    //           <el-input v-model="fluidForm.density" size="mini" style="width:200px"></el-input>
    //           <div style="width:800px;">
    //             <div style="margin-left:30px;">
    //               单位：
    //               <select>
    //                 <option value="Pa">Pa</option>
    //                 <option value="kPa">kPa</option>
    //                 <option value="bar">bar</option>
    //                 <option value="MPa">MPa</option>
    //               </select>
    //             </div>
    //           </div>
    //         </div>
    //         <el-divider></el-divider>
    //         <div style="display:flex;margin-top:15px ">
    //           <el-checkbox v-model="checked">手动输入温度-饱和蒸汽压曲线</el-checkbox>
    //         </div>
    //         <el-tabs type="border-card">
    //           <el-tab-pane>
    //             <span slot="label">多项式</span>
    //             <!-- 多项式输入 -->
    //             <div class="vaporPressure">
    //               <!-- 系数输入框 -->
    //               <div class="item">
    //               <span class="equations">
    //             <div>P</div>
    //             <div>=</div>
    //             <div>
    //               <el-input size="mini" placeholder="A" style="width:60px"></el-input>
    //             </div>
    //             <div>
    //               T
    //               <sup>4</sup>
    //             </div>+
    //             <div>
    //               <el-input size="mini" placeholder="B" style="width:60px"></el-input>
    //             </div>
    //             <div>
    //               T
    //               <sup>3</sup>
    //             </div>
    //             <div>+</div>
    //             <div>
    //               <el-input size="mini" placeholder="C" style="width:60px"></el-input>
    //             </div>
    //             <div>
    //               T
    //               <sup>2</sup>
    //             </div>
    //             <div>+</div>
    //             <div>
    //               <el-input size="mini" placeholder="D" style="width:60px"></el-input>
    //             </div>
    //             <div>T</div>+
    //             <div>
    //               <el-input size="mini" style="width:70px"></el-input>
    //             </div>
    //           </span>
    //               </div>
    //               <!-- 单位 -->
    //               <div style="margin:20px 0 0 0">
    //                 单位：
    //                 <div style="padding:10px">
    //                   P(油品的饱和蒸气压)：
    //                   <select>
    //                     <option value="Pa">Pa</option>
    //                     <option value="kPa">kPa</option>
    //                     <option value="bar">bar</option>
    //                     <option value="MPa">MPa</option>
    //                   </select>
    //                 </div>
    //                 <div style="padding:10px">
    //                   T(油品温度)：
    //                   <select>
    //                     <option value="℃">
    //                       <slot>℃</slot>
    //                     </option>
    //                     <option value="K">
    //                       <slot>K</slot>
    //                     </option>
    //                   </select>
    //                 </div>
    //               </div>
    //             </div>
    //           </el-tab-pane>
    //           <el-tab-pane label="克拉贝龙-克劳修斯公式">
    //             <div class="vaporPressure">
    //               <!-- 系数输入框 -->
    //               <div class="item">
    //                 <span class="equations">
    //                   <div>lnP</div>
    //                   <div>=</div>
    //                   <div>
    //                     <el-input size="mini" placeholder="B" style="width:100px"></el-input>
    //                   </div>
    //                   <div>+</div>
    //                   <div>
    //                     <el-input size="mini" placeholder="A" style="width:100px"></el-input>
    //                   </div>
    //                   <div>/</div>
    //                   <div>T</div>
    //                 </span>
    //               </div>
    //               <!-- 单位 -->
    //               <div style="margin:20px 0 0 0">
    //                 单位：
    //                 <div style="padding:10px">
    //                   P(油品的饱和蒸气压)：
    //                   <select>
    //                     <option value="Pa">Pa</option>
    //                     <option value="kPa">kPa</option>
    //                     <option value="bar">bar</option>
    //                     <option value="MPa">MPa</option>
    //                   </select>
    //                 </div>
    //                 <div style="padding:10px">
    //                   T(油品温度)：
    //                   <select>
    //                     <option value="℃">
    //                       <slot>℃</slot>
    //                     </option>
    //                     <option value="K">
    //                       <slot>K</slot>
    //                     </option>
    //                   </select>
    //                 </div>
    //               </div>
    //             </div>
    //           </el-tab-pane>
    //         </el-tabs>
    //         <el-divider></el-divider>
    //         <el-checkbox v-model="checked">在线拟合温度-饱和蒸汽压曲线：</el-checkbox>
    //         <div style="margin:20px 0 0 0;">
    //           单位：
    //           <br />
    //           <div style="display:flex">
    //             <div style="padding:10px">
    //               温度：
    //               <select>
    //                 <option value="℃">
    //                   <slot>℃</slot>
    //                 </option>
    //                 <option value="K">
    //                   <slot>K</slot>
    //                 </option>
    //               </select>
    //             </div>
    //             <div style="padding:10px">
    //               压力：
    //               <select>
    //                 <option value="Pa">Pa</option>
    //                 <option value="kPa">kPa</option>
    //                 <option value="bar">bar</option>
    //                 <option value="MPa">MPa</option>
    //               </select>
    //             </div>
    //             <div style="padding:10px">
    //               饱和蒸汽压：
    //               <select>
    //                 <option value="Pa">Pa</option>
    //                 <option value="kPa">kPa</option>
    //                 <option value="bar">bar</option>
    //                 <option value="MPa">MPa</option>
    //               </select>
    //             </div>
    //           </div>
    //         </div>
    //         <div style="height:auto;overflow:hidden">
    //           <vaporPressure-table></vaporPressure-table>
    //         </div>

    //         <div style="margin-top:20px">
    //           拟合结果：
    //           <span class="equations">
    //             <div>P</div>
    //             <div>=</div>
    //             <div>
    //               <el-input size="mini" placeholder="A" style="width:70px"></el-input>
    //             </div>
    //             <div>
    //               T
    //               <sup>4</sup>
    //             </div>+
    //             <div>
    //               <el-input size="mini" placeholder="B" style="width:70px"></el-input>
    //             </div>
    //             <div>
    //               T
    //               <sup>3</sup>
    //             </div>
    //             <div>+</div>
    //             <div>
    //               <el-input size="mini" placeholder="C" style="width:70px"></el-input>
    //             </div>
    //             <div>
    //               T
    //               <sup>2</sup>
    //             </div>
    //             <div>+</div>
    //             <div>
    //               <el-input size="mini" placeholder="D" style="width:70px"></el-input>
    //             </div>
    //             <div>T</div>+
    //             <div>
    //               <el-input size="mini" style="width:70px"></el-input>
    //             </div>
    //           </span>
    //         </div>
    //       </div>
    //       <!-- 饱和蒸汽压表单结束 -->
    //     </div>
    //     <div class="columns">
    //       <div class="item">
    //         <h1>粘温曲线：</h1>
    //         <div style="display:flex;margin-top:30px ">
    //           <el-checkbox v-model="checked">手动输入粘温曲线</el-checkbox>
    //         </div>

    //         <el-tabs type="border-card" style="margin-top:10px ">
    //           <el-tab-pane>
    //             <span slot="label">多项式</span>
    //             <!-- 多项式输入 -->
    //             <div class="vaporPressure">
    //               <!-- 系数输入框 -->
    //               <div class="item">
    //                 <span class="equations">
    //                   <div>v</div>
    //                   <div>=</div>
    //                   <div>
    //                     <el-input size="mini" placeholder="A" style="width:60px"></el-input>
    //                   </div>
    //                   <div>
    //                     T
    //                     <sup>4</sup>
    //                   </div>+
    //                   <div>
    //                     <el-input size="mini" placeholder="B" style="width:60px"></el-input>
    //                   </div>
    //                   <div>
    //                     T
    //                     <sup>3</sup>
    //                   </div>
    //                   <div>+</div>
    //                   <div>
    //                     <el-input size="mini" placeholder="C" style="width:60px"></el-input>
    //                   </div>
    //                   <div>
    //                     T
    //                     <sup>2</sup>
    //                   </div>
    //                   <div>+</div>
    //                   <div>
    //                     <el-input size="mini" placeholder="D" style="width:60px"></el-input>
    //                   </div>
    //                   <div>T</div>+
    //                   <div>
    //                     <el-input size="mini" style="width:60px"></el-input>
    //                   </div>
    //                 </span>
    //               </div>
    //               <!-- 单位 -->
    //               <div style="margin:20px 0 0 0">
    //                 单位：
    //                 <div style="padding:10px">
    //                   v(油品的粘度)：
    //                   <select>
    //                     <option value="Pa">mm2/s</option>
    //                     <option value="kPa">cm2/s</option>
    //                     <option value="bar">m2/s</option>
    //                   </select>
    //                 </div>
    //                 <div style="padding:10px">
    //                   T(油品温度)：
    //                   <select>
    //                     <option value="℃">
    //                       <slot>℃</slot>
    //                     </option>
    //                     <option value="K">
    //                       <slot>K</slot>
    //                     </option>
    //                   </select>
    //                 </div>
    //               </div>
    //             </div>
    //           </el-tab-pane>
    //           <el-tab-pane label="ASTM公式">
    //             <div class="vaporPressure">
    //               <!-- 系数输入框 -->
    //               <div class="item">
    //                 <span class="equations">
    //                   <div>lg</div>
    //                   <div>[</div>
    //                   <div>lg</div>
    //                   <div>(</div>
    //                   <div>v</div>
    //                   <div>+</div>
    //                   <div>
    //                     <el-input size="mini" style="width:70px"></el-input>
    //                   </div>
    //                   <div>
    //                     &times;10
    //                     <sup>-6</sup>
    //                   </div>
    //                   <div>)</div>
    //                   <div>]</div>
    //                   <div>=</div>
    //                   <div>
    //                     <el-input size="mini" placeholder="A" style="width:70px"></el-input>
    //                   </div>
    //                   <div>+</div>
    //                   <div>
    //                     <el-input size="mini" placeholder="B" style="width:70px"></el-input>
    //                   </div>
    //                   <div>lg</div>
    //                   <div>(</div>
    //                   <div>T</div>
    //                   <div>+</div>
    //                   <div>273</div>
    //                   <div>)</div>
    //                 </span>
    //               </div>
    //               <!-- 单位 -->
    //               <div style="margin:20px 0 0 0">
    //                 单位：
    //                 <div style="padding:10px">
    //                   v(油品的粘度)：
    //                   <select>
    //                     <option value="Pa">mm2/s</option>
    //                     <option value="kPa">cm2/s</option>
    //                     <option value="bar">m2/s</option>
    //                   </select>
    //                 </div>
    //                 <div style="padding:10px">
    //                   T(油品温度)：
    //                   <select>
    //                     <option value="℃">
    //                       <slot>℃</slot>
    //                     </option>
    //                     <option value="K">
    //                       <slot>K</slot>
    //                     </option>
    //                   </select>
    //                 </div>
    //               </div>
    //             </div>
    //           </el-tab-pane>
    //           <el-tab-pane label="粘温指数关系式">
    //             <div class="vaporPressure">
    //               <!-- 系数输入框 -->
    //               <div class="item">
    //                 <span class="equations">
    //                   <div>
    //                     v
    //                     <sub>1</sub>
    //                   </div>
    //                   <div>/</div>
    //                   <div>
    //                     v
    //                     <sub>2</sub>
    //                   </div>
    //                   <div>=</div>
    //                   <div>exp</div>
    //                   <div>(</div>
    //                   <div>-</div>
    //                   <div>
    //                     <el-input size="mini" placeholder="B" style="width:100px"></el-input>
    //                   </div>
    //                   <div>(</div>

    //                   <div>
    //                     T
    //                     <sub>1</sub>
    //                   </div>
    //                   <div>-</div>
    //                   <div>
    //                     T
    //                     <sub>2</sub>
    //                   </div>
    //                   <div>)</div>
    //                   <div>)</div>
    //                 </span>
    //               </div>
    //               <!-- 单位 -->
    //               <div style="margin:20px 0 0 0">
    //                 单位：
    //                 <div style="padding:10px">
    //                   v(油品的粘度)：
    //                   <select>
    //                     <option value="Pa">mm2/s</option>
    //                     <option value="kPa">cm2/s</option>
    //                     <option value="bar">m2/s</option>
    //                   </select>
    //                 </div>
    //                 <div style="padding:10px">
    //                   T(油品温度)：
    //                   <select>
    //                     <option value="℃">
    //                       <slot>℃</slot>
    //                     </option>
    //                     <option value="K">
    //                       <slot>K</slot>
    //                     </option>
    //                   </select>
    //                 </div>
    //               </div>
    //             </div>
    //             <div style="margin-top:20px">
    //              <el-checkbox v-model="checked">分段输入粘温指数关系式系数B：</el-checkbox></div>
    //               <div style="height:auto;overflow:hidden"> 
    //               <mu-table></mu-table></div>
    //           </el-tab-pane>
    //         </el-tabs>

    //         <el-divider></el-divider>
    //         <el-checkbox v-model="checked">在线拟合粘温曲线：</el-checkbox>
    //         <div style="margin:20px 0 0 0;">
    //           单位：<br/>
    //           <div style="display:flex">
    //             <div style="padding:10px">
    //               v(油品的粘度)：
    //               <select>
    //                 <option value="Pa">mm2/s</option>
    //                 <option value="kPa">cm2/s</option>
    //                 <option value="bar">m2/s</option>
    //               </select>
    //             </div>
    //             <div style="padding:10px">
    //               T(油品温度)：
    //               <select>
    //                 <option value="℃">
    //                   <slot>℃</slot>
    //                 </option>
    //                 <option value="K">
    //                   <slot>K</slot>
    //                 </option>
    //               </select>
    //             </div>
    //           </div>
    //         </div>
    //         <div style="height:auto;overflow:hidden">
    //           <viscos-table></viscos-table>
    //         </div>
    //         <div style="margin-top:20px">
    //           拟合结果：
    //           <span class="equations">
    //             <div>v</div>
    //             <div>=</div>
    //             <div>
    //               <el-input size="mini" placeholder="A" style="width:70px"></el-input>
    //             </div>
    //             <div>
    //               T
    //               <sup>4</sup>
    //             </div>+
    //             <div>
    //               <el-input size="mini" placeholder="B" style="width:70px"></el-input>
    //             </div>
    //             <div>
    //               T
    //               <sup>3</sup>
    //             </div>
    //             <div>+</div>
    //             <div>
    //               <el-input size="mini" placeholder="C" style="width:70px"></el-input>
    //             </div>
    //             <div>
    //               T
    //               <sup>2</sup>
    //             </div>
    //             <div>+</div>
    //             <div>
    //               <el-input size="mini" placeholder="D" style="width:70px"></el-input>
    //             </div>
    //             <div>T</div>+
    //             <div>
    //               <el-input size="mini" style="width:70px"></el-input>
    //             </div>
    //           </span>
    //         </div>
    //         <div style="margin-top:20px"></div>
    //       </div>
    //       <div class="item">
    //         <h1>体积弹性系数：</h1>
    //         <div style="margin:20px 0 20px 0;background:#fff;padding:15px 5px 15px 5px">
    //           <span class="equations">
    //             <div>ln</div>
    //             <div>(</div>
    //             <div>1</div>
    //             <div>/</div>
    //             <div>K</div>
    //             <div>&times;</div>
    //             <div>
    //               10
    //               <sup>10</sup>
    //             </div>
    //             <div>)</div>
    //             <div>=</div>
    //             <div>
    //               <el-input size="mini" placeholder="A" style="width:60px"></el-input>
    //             </div>
    //             <div>+</div>

    //             <div>
    //               <el-input size="mini" placeholder="B" style="width:60px"></el-input>
    //             </div>
    //             <div>T</div>
    //             <div>+</div>
    //             <div>
    //               <el-input size="mini" placeholder="C" style="width:60px"></el-input>
    //             </div>
    //             <div>/</div>
    //             <div>
    //               d
    //               <sub>0</sub>
    //               <sup>2</sup>
    //             </div>
    //             <div>+</div>
    //             <div>
    //               <el-input size="mini" placeholder="D" style="width:60px"></el-input>
    //             </div>
    //             <div>T</div>
    //             <div>/</div>
    //             <div>
    //               d
    //               <sub>0</sub>
    //               <sup>2</sup>
    //             </div>
    //           </span>
    //         </div>
    //         <el-checkbox v-model="checked">使用默认系数：</el-checkbox>
    //         <div style="margin:20px 0 0 0">
    //           单位：
    //           <div style="padding:10px">
    //             K(体积弹性系数)：
    //             <select>
    //               <option value="Pa">Pa</option>
    //               <option value="kPa">kPa</option>
    //               <option value="bar">bar</option>
    //               <option value="MPa">MPa</option>
    //             </select>
    //           </div>
    //           <div style="padding:10px">
    //             d
    //             <sub>0</sub>
    //             (20℃条件下油品密度)：
    //             <select>
    //               <option value="kg/m3">kg/m3</option>
    //               <option value="g/cm3">g/cm3</option>
    //             </select>
    //           </div>

    //           <div style="padding:10px">
    //             T(油品温度)：
    //             <select>
    //               <option value="℃">
    //                 <slot>℃</slot>
    //               </option>
    //               <option value="K">
    //                 <slot>K</slot>
    //               </option>
    //             </select>
    //           </div>
    //         </div>
    //         <el-divider></el-divider>
            
    //         <el-checkbox v-model="checked">在线拟合温度-体积弹性系数曲线：</el-checkbox>
    //         <div style="margin:20px 0 0 0;">
    //           单位：
    //           <br />
    //           <div style="display:flex">
    //             <div style="padding:10px">
    //               温度：
    //               <select>
    //                 <option value="℃">
    //                   <slot>℃</slot>
    //                 </option>
    //                 <option value="K">
    //                   <slot>K</slot>
    //                 </option>
    //               </select>
    //             </div>
    //             <div style="padding:10px">
    //               体积弹性系数：
    //               <select>
    //                 <option value="Pa">Pa</option>
    //                 <option value="kPa">kPa</option>
    //                 <option value="bar">bar</option>
    //                 <option value="MPa">MPa</option>
    //               </select>
    //             </div>
               
    //           </div>
    //         </div>
    //         <div style="height:auto;overflow:hidden">
    //           <K-table></K-table>
    //         </div>

    //         <div style="margin-top:20px">
    //           拟合结果：
    //           <span class="equations">
    //             <div>ln</div>
    //             <div>(</div>
    //              <div>1</div>
    //               <div>/</div>
    //                <div>K</div>
    //                 <div>)</div>
    //                <div>=</div>
    //             <div>
    //               <el-input size="mini" placeholder="A" style="width:60px"></el-input>
    //             </div>
    //             <div>
    //               T
    //               <sup>4</sup>
    //             </div>+
    //             <div>
    //               <el-input size="mini" placeholder="B" style="width:60px"></el-input>
    //             </div>
    //             <div>
    //               T
    //               <sup>3</sup>
    //             </div>
    //             <div>+</div>
    //             <div>
    //               <el-input size="mini" placeholder="C" style="width:60px"></el-input>
    //             </div>
    //             <div>
    //               T
    //               <sup>2</sup>
    //             </div>
    //             <div>+</div>
    //             <div>
    //               <el-input size="mini" placeholder="D" style="width:60px"></el-input>
    //             </div>
    //             <div>T</div>+
    //             <div>
    //               <el-input size="mini" style="width:60px"></el-input>
    //             </div>
    //           </span>
    //         </div>
    //       </div>
    //       <div class="item">
    //         <h1>比热容：</h1>
    //         <div style="margin:20px 0 20px 0;background:#fff;padding:15px 5px 15px 5px">
    //           <span class="equations">
    //             <div>
    //               c
    //               <sub>y</sub>
    //             </div>
    //             <div>=</div>
    //             <div>(</div>
    //             <div>
    //               d
    //               <sub>4</sub>
    //               <sup style="margin-left:-12px">15</sup>
    //             </div>
    //             <div>)</div>
    //             <div>
    //               <sup>-0.5</sup>
    //             </div>
    //             <div>(</div>
    //             <div>
    //               <el-input size="mini" placeholder="A" style="width:100px"></el-input>
    //             </div>
    //             <div>+</div>
    //             <div>
    //               <el-input size="mini" placeholder="B" style="width:100px"></el-input>
    //             </div>
    //             <div>T</div>
    //             <div>)</div>
    //           </span>
    //         </div>

    //         <div style="width:800px;">
    //           <el-checkbox v-model="checked">使用默认系数</el-checkbox>
    //         </div>
    //         <!-- 单位 -->
    //         <div style="margin:20px 0 0 0">
    //           单位：
    //           <div style="padding:10px">
    //             c
    //             <sub>y</sub>
    //             (油品的比热容)：
    //             <select>
    //               <option value="Pa">kJ/(kg•℃)</option>
    //             </select>
    //           </div>

    //           <div style="padding:10px">
    //             <span style="font-size:15px">
    //               d
    //               <sub>4</sub>
    //               <sup style="margin-left:-12px">15</sup>
    //             </span>——油品在15℃的相对密度
                
    //           </div>

    //           <div style="padding:10px">
    //             T(油品温度)：
    //             <select>
    //               <option value="℃">
    //                 <slot>℃</slot>
    //               </option>
    //               <option value="K">
    //                 <slot>K</slot>
    //               </option>
    //             </select>
    //           </div>
    //           <el-divider></el-divider>
            
    //         <el-checkbox v-model="checked">在线拟合温度-比热容曲线：</el-checkbox>
    //         <div style="margin:20px 0 0 0;">
    //           单位：
    //           <br />
    //           <div style="display:flex">
    //             <div style="padding:10px">
    //               温度：
    //               <select>
    //                 <option value="℃">
    //                   <slot>℃</slot>
    //                 </option>
    //                 <option value="K">
    //                   <slot>K</slot>
    //                 </option>
    //               </select>
    //             </div>
    //             <div style="padding:10px">
    //               比热容：
    //               <select>
    //                 <option value="Pa">kJ/(kg•℃)</option>
    //               </select>
    //             </div>
               
    //           </div>
    //         </div>
    //         <div style="height:auto;overflow:hidden">
    //           <c-table></c-table>
    //         </div>

    //         <div style="margin-top:20px">
    //           拟合结果：
    //           <span class="equations">
    //             <div>
    //               c
    //               <sub>y</sub>
    //             </div>
    //                <div>=</div>
    //             <div>
    //               <el-input size="mini" placeholder="A" style="width:65px"></el-input>
    //             </div>
    //             <div>
    //               T
    //               <sup>4</sup>
    //             </div>+
    //             <div>
    //               <el-input size="mini" placeholder="B" style="width:65px"></el-input>
    //             </div>
    //             <div>
    //               T
    //               <sup>3</sup>
    //             </div>
    //             <div>+</div>
    //             <div>
    //               <el-input size="mini" placeholder="C" style="width:65px"></el-input>
    //             </div>
    //             <div>
    //               T
    //               <sup>2</sup>
    //             </div>
    //             <div>+</div>
    //             <div>
    //               <el-input size="mini" placeholder="D" style="width:65px"></el-input>
    //             </div>
    //             <div>T</div>+
    //             <div>
    //               <el-input size="mini" style="width:65px"></el-input>
    //             </div>
    //           </span>
    //         </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // <!-- </el-form> --> 

import { mapState } from "vuex";
import viscosTable from "@/components/basicData/basicDataFluid/viscosTable.vue";
import densityTable from "@/components/basicData/basicDataFluid/densityTable.vue";
import vaporPressureTable from "@/components/basicData/basicDataFluid/vaporPressureTable.vue";
import muTable from "@/components/basicData/basicDataFluid/muTable.vue";
import KTable from "@/components/basicData/basicDataFluid/KTable.vue";
import cTable from "@/components/basicData/basicDataFluid/cTable.vue";
export default {
  name: "basicDataFluid",
  components: {
    "viscos-table": viscosTable,
    "density-table": densityTable,
    
    "vaporPressure-table": vaporPressureTable,
    "mu-table": muTable,
     "K-table": KTable,
     "c-table": cTable,
  },
  data() {
    return {
      //温度单位
densityunit:"kg/m3",
temperatureunit:"℃",
activeName: 'first',
      options: [{}],
      value: "",
      fluidForm: {
        density: "",
        vaporPressure: "",
        elasticmodulus: "",
        viscoscurve: "",
      },
      viscosDataForm: {
        viscosData: [
          {
            temperature: "",
            viscosity: "",
          },
          {
            temperature: "",
            viscosity: "",
          },
          {
            temperature: "",
            viscosity: "",
          },
          {
            temperature: "",
            viscosity: "",
          },
        ],
      },
      checked: true,
    };
  },
  methods: {
    submitForm(formname) {},
    resetForm(formname) {},
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleSave(index, row) {},
    /***
     * 折叠面板
     *
     */
    handleChange(val) {
      console.log(val);
    },
    inFluid(){

       this.$router.push({
        name: "fluidList",
        params: {
          projectName: this.name,
          id: this.id,
        },
      });
    }
  },
  watch: {
    fluidForm: {
      handler(val) {
        console.log(val);
        let params = this.fluidForm;
        params.book = this.id;
        console.log(this.fluidForm);
        this.postKeyValueRequest("/Fluid1/save", params).then((resp) => {
          if (resp) {
            console.log(resp);
            this.tableData = resp.data.list;
            this.total = resp.data.total;
          }
        });
      },
      deep: true,
    },
    viscosDataForm: {
      handler(val) {
        console.log(val);
        let params = val;
        //   this.postKeyValueRequest("/Fluid1/save", params).then((resp) => {
        //   if (resp) {
        //     console.log(resp);
        //     this.tableData = resp.data.list;
        //     this.total = resp.data.total;
        //   }
        // });
        // this.getRequest("/Fluid1/").then((resp) => {
        //   if (resp) {
        //     console.log(resp);
        //   }
        // });
      },
      deep: true,
    },
  },
  computed: {
    unit() {
      var string = "3";
      var uit = "kg/m" + string.sup();
      console.log(uit);
      return uit;
    },
    ...mapState("projectList", ["projectId"]),
    id() {
      return this.projectId;
    },
  },
  created() {
    let book = { id: this.id };
    this.getRequest("/Fluid1", book).then((resp) => {
      console.log("fluidresp", resp);
      if (resp.data.list.length) {
        //fluidid:1
        this.fluidForm = resp.data.list[0];
      }
    });
    //     this.getRequest("/viscos",book).then((resp) => {
    //       if (resp) {
    //       console.log("fluidresp",resp);
    //       //fluidid:1
    //         this.fluidForm=resp.data.list[0]
    //       }
    //     });
  },
};
</script>
<style  scoped>
.container {
  background: #fff;
  width: calc(100vw - 200px);
  height: calc(100vh - 70px);
  overflow-x: hidden;
  overflow-y: visible;
}

.nameROW {
  background: cornflowerblue;
  padding: 1em 1.5em;
  margin-bottom: 1.5em;
  display: flex
}
.flex {
  display: grid;
  grid-template-columns: calc(50% - 0.75em) calc(50% - 0.75em);
  grid-gap: 1.5em;
  margin: 0 1.5em 0;
  width: inherit;
}
.columns {
  display: flex;
  flex-direction: column;
}

.item {
  padding: 1.5em;
  background: #fcfafa;

  float: left;
  /* z-index: 1;
            box-shadow: 0 0 0 1px hsla(240,0%,100%,.3) inset,
            .1em .3em 1em rgba(97, 97, 92, 0.6); */
}
/* .item::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            -webkit-filter: blur(80px);
            -moz-filter: blur(80px);
            -ms-filter: blur(80px);
            -o-filter: blur(80px);
            filter: blur(80px);
            z-index: -3;
            margin: -30px;
            
            background-position: center top;
            background-size: cover;
            background-attachment: fixed;
        } */
.columns > * + * {
  margin-top: 1.5em;
}
.nameInput {
  width: 300px;
  margin: 0;
}
.title {
  margin-left: -28px;
}
.duoxiangshi {
  margin-top: 10px;
}
.equations {
  display: table;
  font-size: 15px;
}
.equations > * {
  display: table-cell;
  text-align: center;
  padding: 3px;
}

.relativeDensity > .item {
  margin-top: 10px;
  background: #fcfafa;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 15px;
}
.density-input {
  margin: 10px 45px;
}
.vaporPressure {
  display: flex;
  flex-direction: column;
}

.el-input {
  size: small;
}
</style>