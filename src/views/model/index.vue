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
      <el-button size="mini" @click="showImport" disabled>快速导入</el-button>
      <el-button size="mini" @click="showCheck">物模型 TSL</el-button>
      <el-button size="mini" disabled>历史版本</el-button>
      <div v-if="list.length > 0 && !loading" class="info df ai_c mb5 mt10 c9">
        <i class="el-icon-warning blue mr5"></i>
        您正在编辑的是草稿，需点击发布后，物模型才会正式生效
      </div>
    </div>
    <el-table :data="list" border v-if="!loading" class="mb20">
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
      <el-table-column :render-header="renderName">
        <template slot-scope="scope">
          {{scope.row.name}}
          <el-tag>{{typeObj[scope.row.modelType]}}</el-tag>
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
    <add-std-ability v-if="addStdAbilityFlag" :productKey="productKey" :identifiers="identifiers" @close="closeAddStdAbility" @success="successAtdAbility"></add-std-ability>
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
import { test} from '@/api'
export default {
  components: {addCustomAbility, addStdAbility, importAbility, checkModel},
  data () {
    return {
      loading: false,
      list: [],
      // tableFlag: true,
      addFlag: false,
      productKey: '',
      editAbility: null,
      addStdAbilityFlag: false,
      abilityTypeObj: dataObj.abilityTypeObj,
      typeObj: dataObj.typeObj,
      dataTypeTextObj: dataObj.dataTypeTextObj,
      type: '', // 用于列表功能类型筛选
      selectType: {
        type: ''
      },
      allData: null,
      importFlag: false,
      checkFlag: false,
      identifiers: []
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
      this.categoryIds = []
      getModelByproductKey({productKey: this.productKey}).then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.allData = res.data
            this.dealDataByType()
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
    dealDataByType () {
      for (let key in this.allData) {
        if (key.indexOf('Json') > -1 && key !== 'allJson') {
          let arr = this.allData[key]
          if (Array.isArray(arr)) {
            arr.forEach(item => {
              if (key.indexOf('base') > -1) {
                item.modelType = '1' // 1 标准
                this.identifiers.push(item.identifier)
              }
              if (key.indexOf('custom') > -1) {
                item.modelType = '2' // 2 自定义
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
            arr = arr.filter(item => {
              if (this.type) {
                return item.modelType * 1 === this.type * 1
              } else {
                return item
              }
            })
            this.list = this.list.concat(arr)
          }
        }
      }
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
    // 添加标准功能成功的回调
    successAtdAbility () {
      this.closeAddStdAbility()
      this.getData()
    },
    popoverShow () {
      this.selectType = {
        type: this.type
      }
    },
    // 头部渲染函数
    renderName (h) {
      return h('span', {}, [
        h('span', {class: 'mr10'}, `功能名称（${this.type ? this.typeObj[this.type] : '全部'}）`),
        h('el-popover', {
          props: { width: '180', trigger: 'click' },
          on: {
            show: this.popoverShow
          }
        }, [
          h('div', { attrs: {
            class: 'conHeader'
            }
          }, [
            h('div', {
              class: 'hand',
              on: {
                click: () => {
                  this.setSelectType('')
                }
              }
            }, [
              h('i', {
                class: `${this.selectType.type == '' ? 'el-icon-check' : ''} mr10 blue dib w20`
              }, ''),
              h('span', {attrs: { class: 'f12'}}, '全部')
            ]),
            h('div', {class: 'hand', on: {
                click: () => {
                  this.setSelectType('1')
                }
              }}, [
              h('i', {
                class: `${this.selectType.type == '1' ? 'el-icon-check' : ''} mr10 blue dib w20`
              }, ''),
              h('span', {attrs: { class: 'f12'}}, '标准功能')
            ]),
            h('div', {class: 'hand', on: {
                click: () => {
                  this.setSelectType('2')
                }
              }}, [
              h('i', {
                class: `${this.selectType.type == '2' ? 'el-icon-check mr10 blue dib w20' : ''} mr10 blue dib w20`
              }, ''),
              h('span', {attrs: { class: 'f12'}}, '自定义功能')
            ]),
            h('div', {class: 'tc mt10'}, [
              h('el-button', { attrs: {
                type: 'primary',
                size: 'mini'
              }, on: {
                click: () => {
                  this.setSelectTypeConfrim()
                }
              }}, '确认'),
              h('el-button', { attrs: {
                size: 'mini'
              }, on: {
                click: () => {
                  this.resetSelectType()
                }
              }}, '重置')
            ])
          ]),
          h('svg-icon', { slot: 'reference', attrs: {
            'icon-class': 'screen'
          }}, '')
        ])
       ])
    },
    setSelectType (key) {
      this.selectType = {
        type: key
      }
    },
    setSelectTypeConfrim () {
      this.type = this.selectType.type
      this.getData()
    },
    resetSelectType () {
      this.type = ''
      this.getData()
    },
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
  .conHeader {
      width: 180px;
      position: absolute;
      border: 1px solid #efefef;
      top: 0px;
      z-index: 1;
    }
  .header-popover {
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
