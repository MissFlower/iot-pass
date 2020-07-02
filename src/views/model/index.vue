<!-- 
文件作者：mawenjuan
创建日期：2020.6.28
文件说明：功能定义页面
 -->

<template>
  <div id="model" v-loading="loading">
    <div class="f20 p10">
      <i class="el-icon-back hand" @click="goBack"></i><span style="margin-left:15px">编辑草稿</span>
    </div>
    <div class="f12 c9 df mt10 mb10">
      <!-- <div class="flex1 df ai_c">
        <div class="w120">产品名称</div>
        <div>ceshi</div>
      </div> -->
      <div class="flex1 df ai_c">
        <div class="w120">productKey</div>
        <div>{{productKey}}</div>
      </div>
    </div>
    <div class="mb10">
      <el-button type="primary" size="mini" @click="handleShowAddStdAbility">添加标准功能</el-button>
      <el-button size="mini" @click="handleShowAdd()">添加自定义功能</el-button>
      <el-button size="mini" @click="showImport">快速导入</el-button>
      <el-button size="mini" @click="showCheck">物模型 TSL</el-button>
      <el-button size="mini" disabled>历史版本</el-button>
      <div v-if="list.length > 0 && !loading" class="info df ai_c mb5 mt10 c9">
        <i class="el-icon-warning blue mr5"></i>
        您正在编辑的是草稿，需点击发布后，物模型才会正式生效
      </div>
    </div>
    <el-table :data="list" border>
      <div slot="empty" class="mt30 mb20 df jc_c">
        <svg-icon icon-class="empty" class="empty"></svg-icon>
        <div class="lh16 w300 tl ml20">
          <div class="b">尚未添加任何功能</div>
          <div class="c9 f12 mt10">您可以通过添加属性、事件、服务三类功能完成产品物模型的定义，产品下的设备都会继承该模型。</div>
          <div class="mt20">
            <el-button type="primary" size="mini">编辑草稿</el-button>
            <el-button size="mini">了解更多</el-button>
          </div>
        </div>
      </div>
      <el-table-column label="功能类型">
        <template slot-scope="scope">
          {{abilityTypeObj[scope.row.abilityType]}}
        </template>
      </el-table-column>
      <el-table-column prop="name">
        <span slot="header">
          功能名称（{{type ? `${typeObj[type]}` : '全部'}}）
          <!-- <el-popover
            placement="bottom"
            width="100"
            trigger="click"
            @show="selectType = type"
            >
            <div class="conHeader">
              <div @click.stop="setSelectType('')">
                <i class="mr10 blue dib w20" :class="selectType == '' ? 'el-icon-check' : ''"></i>
                <span>全部</span>
              </div>
              <div v-for="(item, key) in typeObj" :key="key" @click.stop="setSelectType(key)">
                <i class="mr10 blue dib w20" :class="selectType == key ? 'el-icon-check' : ''"></i>
                <span>{{item}}{{selectType}}</span>
              </div>
              <div class="mt10 tc">
                <el-button type="primary" size="mini" @click="setSelectTypeConfrim">确认</el-button>
                <el-button size="mini" @click="resetSelectType">重置</el-button>
              </div>
            </div>
            <svg-icon icon-class="screen" slot="reference"></svg-icon>
          </el-popover> -->
        </span>
        <template slot-scope="scope">
          {{scope.row.name}}
          <el-tag>{{typeObj[scope.row.type]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标识符" prop="identifier"></el-table-column>
      <el-table-column label="数据类型">
        <template slot-scope="scope">
          {{scope.row.dataType ? dataTypeTextObj[scope.row.dataType.type] : ''}}
        </template>
      </el-table-column>
      <el-table-column label="数据定义">
        <template slot-scope="scope">
          <div class="ellipsis">{{scope.row.dataType ? scope.row.dataType.specs : ''}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" align="center">
        <template slot-scope="scope">
          <el-link :underline="false" type="primary" class="f12" @click="handleShowAdd(scope.row)">编辑</el-link>
          <el-link :underline="false" type="primary" class="f12" @click="showDelete(scope.row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <add-custom-ability v-if="addFlag" :productKey="productKey" :editAbility="editAbility" @close="closeAddCustomAbility" @success="successAddCustomAbility"></add-custom-ability>
    <add-std-ability v-if="addStdAbilityFlag" :productKey="productKey" @close="closeAddStdAbility"></add-std-ability>
    <import-ability v-if="importFlag" @close="closeImport"></import-ability>
    <check-model v-if="checkFlag" :productKey='productKey' @close="closeCheck"></check-model>
  </div>
</template>

<script>
import { getModelByproductKey, deleteAbility } from '@/api/model'
import addCustomAbility from './addCustomAbility'
import addStdAbility from './addStdAbility'
import importAbility from './importAbility'
import checkModel from './checkModel'

import dataObj from '@/data/data'
export default {
  components: {addCustomAbility, addStdAbility, importAbility, checkModel},
  data () {
    return {
      loading: false,
      list: [],
      addFlag: false,
      productKey: '',
      editAbility: null,
      addStdAbilityFlag: false,
      abilityTypeObj: dataObj.abilityTypeObj,
      typeObj: dataObj.typeObj,
      dataTypeTextObj: dataObj.dataTypeTextObj,
      type: '', // 用于列表功能类型筛选
      selectType: '',
      allData: null,
      importFlag: false,
      checkFlag: false
    }
  },
  mounted () {
    if (this.$route.query.key) {
      this.productKey = this.$route.query.key
      this.getData()
    }
  },
  methods: {
    // 获取功能列表
    getData() {
      this.loading = true
      this.list = []
      getModelByproductKey({productKey: this.productKey}).then(res => {
        if (res.code === 200) {
          if (res.data) {
            for (let key in res.data) {
              if (key.indexOf('Json') > -1 && key !== 'allJson') {
                const arr = res.data[key]
                if (Array.isArray(arr)) {
                  arr.forEach(item => {
                    if (key.indexOf('base') > -1) {
                      item.type = '1' // 1 标准
                    }
                    if (key.indexOf('custom') > -1) {
                      item.type = '2' // 2 自定义
                    }
                    if (key.indexOf('Pro') > -1) {
                      item.abilityType = '1' // 1 属性
                    }
                    if (key.indexOf('Ser') > -1) {
                      item.abilityType = '2' // 2 服务
                    }
                    if (key.indexOf('Eve') > -1) {
                      item.abilityType = '3' // 3 事件
                    }
                    item.accessMode_ = item.accessMode
                    if (item.accessMode === 'rw') {
                      item.accessMode = '0'
                    } else if(item.accessMode == 'r') {
                      item.accessMode = '1'
                    }
                  })
                  this.list = this.list.concat(arr)
                }
              }
            }
          }
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(() => {
        this.$message.error('功能列表获取失败')
        this.loading = false
      })
    },
    // 详情查看
    showDetail (item) {
      console.log(item)
    },
    // 添加自定义功能、编辑功能
    handleShowAdd (row) {
      if (row) {
        this.editAbility = JSON.parse(JSON.stringify(row))
      } else {
        this.editAbility = null
      }
      this.addFlag = true
    },
    successAddCustomAbility () {
      this.closeAddCustomAbility()
      this.getData()
    },
    closeAddCustomAbility () {
      this.addFlag = false
      this.editAbility = null
    },
    // 添加标准功能
    handleShowAddStdAbility () {
      this.addStdAbilityFlag = true
    },
    // 返回上级
    goBack () {
      this.$router.push({path: `/product/detail/${this.productKey}?activetab=second`})
    },
    showDelete (row) {
      const str = "确认删除该功能吗？";
      this.$confirm(str, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          deleteAbility({
            productKey: this.productKey,
            abilityType: row.abilityType,
            identifier: row.identifier
          })
            .then(res => {
              if (res.code === 200) {
                this.$message.success("功能删除成功");
                this.getData();
              } else {
                this.$message.error(res.message);
              }
              this.loading = false;
            })
            .catch(() => {
              this.$message.error("功能删除失败");
              this.loading = false;
            });
        })
        .catch(() => {
          this.$message("操作已取消");
        });
    },
    // 关闭添加标准功能的回调
    closeAddStdAbility () {
      this.addStdAbilityFlag = false
    },
  
    setSelectType (key) {
      this.selectType = key
      this.$forceUpdate()
      console.log(this.selectType)
    },
    setSelectTypeConfrim () {},
    resetSelectType() {},
    // 导入弹框展示
    showImport () {
      this.importFlag = true
    },
    // 导入弹框的关闭回调
    closeImport () {
      this.importFlag = false
    },
    // 查看弹框展示
    showCheck () {
      this.checkFlag = true
    },
    // 查看弹框关闭回调
    closeCheck () {
      this.checkFlag = false
    }
  }
}
</script>


<style lang="scss" scoped>
#model {
  padding: 0 10px;
  .empty {
    width: 60px;
    height: 60px;
  }
  .info {
    font-size: 12px;
    background-color: #e5f3ff;
    padding: 8px;
    padding-left: 16px;
    padding-right: 12px;
  }
  .el-link + .el-link {
    margin-left: 10px;
  }
  .header-popover {
    // position: relative;
    color: red;
    .conHeader {
      width: 180px;
      position: absolute;
      border: 1px solid #efefef;
      top: 0px;
      z-index: 1;
    }
  }
}
</style>
