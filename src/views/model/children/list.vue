<template>
  <div class="modelList">
    <div v-if="list.length > 0 && !loading" class="info df ai_c mb5 mt10 c9">
      <i class="el-icon-warning blue mr5"></i>
      您正在编辑的是草稿，需点击发布后，物模型才会正式生效
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
          {{scope.row.dataType ? dataTypeTextObj[scope.row.dataType.type] : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="数据定义" width="200">
        <template slot-scope="scope">
          <div style="white-space: pre;">{{scope.row.showText}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" align="center">
        <template slot-scope="scope">
          <el-link :underline="false" type="primary" class="f12" @click="handleShowAdd(scope.row)">编辑</el-link>
          <el-link :underline="false" type="primary" class="f12" @click="showDelete(scope.row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import dataObj from '@/data/data'
export default {
  // props: ['dataFun', 'productKey'],
  props: {
   "dataFun": {
     type: Function
   },
   'productKey': {
     type: String
   }
  },
  data () {
    return {
      loading: false,
      list: [],
      dataTypeObj: dataObj.dataTypeObj,
      eventType: dataObj.eventType,
      abilityTypeObj: dataObj.abilityTypeObj,
      typeObj: dataObj.typeObj,
      dataTypeTextObj: dataObj.dataTypeTextObj,
      type: '',
      selectType: {
        type: ''
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取功能列表
    getData() {
      this.loading = true
      this.list = []
      this.categoryIds = []
      this.dataFun({productKey: this.productKey}).then(res => {
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
                item.showText = this.dealDataDefinition(item.dataType)
              }
              if (key.indexOf('Ser') > -1) {
                item.abilityType = '2' // 2 服务
                if (item.callType === 'async') {
                  item.showText = '调用方式： 异步调用'
                } else {
                  item.showText = '调用方式： 同步调用'
                }
              }
              if (key.indexOf('Eve') > -1) {
                item.abilityType = '3' // 3 事件
                item.showText = `事件类型：${this.eventType[item.type]}`
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
    // 属性的数据范围的处理
    dealDataDefinition (dataType) {
      if (!dataType) {
        return
      }
      const type = this.dataTypeObj[dataType.type]
      const specs = dataType.specs
      let str = ''
      switch (type) {
        case '0':
        case '1':
        case '2':
          str = `取值范围：${specs.min} ~ ${specs.max}`
          break
        case '3':
          str = `枚举值：`
          if (specs) {
            for (let key in specs) {
              str = `${str}\n\t${key} - ${specs[key]}`
            }
          }
          break
        case '4':
          str = `布尔值：`
          if (specs) {
            for (let key in specs) {
              str = `${str}\n\t${key} - ${specs[key]}`
            }
          }
          break
        case '5':
          str = `数据长度：${specs.length}`
          break
        default:
          str = '-'
      }
      return str
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
    handleShowAdd (row) {
      this.$emit('showAdd', row)
    },
    showDelete (row) {
      this.$emit('showDelete', row)
    }
  }
}
</script>