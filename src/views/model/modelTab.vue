<!-- 
文件作者：mawenjuan
创建日期：2020.6.28
文件说明：功能定义tab页面
 -->

<template>
  <div id="model" v-loading="loading">
    <div class="mb10">
      <el-button type="primary" size="mini" v-if="list.length == 0 && !loading" @click="handleEdit">编辑草稿</el-button>
      <div v-if="list.length > 0 && !loading" class="info df ai_c mb5">
        <i class="el-icon-warning blue mr5"></i>
        当前展示的是已发布到线上的功能定义，
        <span v-if="productStatus">如需编辑请先撤销发布</span>
        <span v-else>如需修改，请点击
          <el-link :underline="false" type="primary" class="f12" @click="handleEdit">编辑草稿</el-link>
        </span>
      </div>
      <el-button size="mini" @click="showCheck">物模型 TSL</el-button>
      <el-button size="mini" disabled>生成设备端代码</el-button>
    </div>
    <el-table :data="list" border v-if="!loading">
      <div slot="empty" class="mt30 mb20 df jc_c">
        <svg-icon icon-class="empty"></svg-icon>
        <div class="lh16 w300 tl ml20">
          <div class="b">尚未添加任何功能</div>
          <div class="c9 f12 mt10">您可以通过添加属性、事件、服务三类功能完成产品物模型的定义，产品下的设备都会继承该模型。</div>
          <div class="mt20">
            <el-button type="primary" size="mini" @click="handleEdit">编辑草稿</el-button>
            <el-button size="mini">了解更多</el-button>
          </div>
        </div>
      </div>
      <el-table-column label="功能类型" prop="type">
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
      <el-table-column label="操作" width="80" align="center">
        <template slot-scope="scope">
          <el-link :underline="false" type="primary" class="f12" @click="showDetail(scope.row)">查看</el-link>
        </template>
      </el-table-column>
    </el-table>
    <add-custom-ability v-if="showFlag" :productKey="productKey" :editAbility="editAbility" @close="closeAddCustomAbility" :showFlag="true"></add-custom-ability>
    <check-model v-if="checkFlag" :productKey='productKey' @close="closeCheck"></check-model>
  </div>
</template>

<script>
import { getModelByproductKey } from '@/api/model'

import addCustomAbility from './addCustomAbility'
import checkModel from './checkModel'

import dataObj from "@/data/data"
export default {
  components: { addCustomAbility, checkModel },
  props: ['productKey', 'productStatus'],
  data () {
    return {
      loading: false,
      list: [],
      abilityTypeObj: dataObj.abilityTypeObj,
      typeObj: dataObj.typeObj,
      dataTypeTextObj: dataObj.dataTypeTextObj,
      showFlag: false,
      editAbility: null,
      checkFlag: false,
      type: '', // 用于列表功能类型筛选
      selectType: {
        type: ''
      },
      allData: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      this.list = []
      getModelByproductKey({productKey: this.productKey}).then(res => {
        if (res.code === 200) {
          // console.log(res)
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
              }
              if (key.indexOf('custom') > -1) {
                item.modelType = '2' // 0 自定义
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
    showDetail (row) {
      this.editAbility = JSON.parse(JSON.stringify(row))
      this.showFlag = true
    },
    closeAddCustomAbility () {
      this.editAbility = null
      this.showFlag = false
    },
    handleEdit () {
      this.$router.push(`/model/index?key=${this.productKey}`)
    },
    // 查看弹框展示
    showCheck () {
      this.checkFlag = true
    },
    // 查看弹框关闭回调
    closeCheck () {
      this.checkFlag = false
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
    }
  }
}
</script>


<style lang="scss" scoped>
#model {
  .svg-icon {
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
}
</style>
