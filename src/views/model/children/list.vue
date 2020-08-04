<template>
  <div class="modelList">
    <el-table :data="list" border v-loading="loading" class="mb20" :max-height="tableHeight">
      <div slot="empty" class="mt30 mb20 df jc_c" v-if="typeTab">
        <svg-icon icon-class="empty" style="width: 50px; height: 50px"></svg-icon>
        <div class="lh16 w300 tl ml20">
          <div class="b">尚未添加任何功能</div>
          <div class="c9 f12 mt10">您可以通过添加属性、事件、服务三类功能完成产品物模型的定义，产品下的设备都会继承该模型。</div>
          <div class="mt20">
            <el-button type="primary" size="mini" v-if="!productStatus" @click="handleEdit">编辑草稿</el-button>
            <el-button size="mini">了解更多</el-button>
          </div>
        </div>
      </div>
      <empty-con v-else slot="empty" class="mb20"></empty-con>
      <el-table-column label="功能类型">
        <template slot-scope="scope">
          {{abilityTypeObj[scope.row.abilityType]}}
        </template>
      </el-table-column>
      <el-table-column >
        <div slot="header">
          功能名称 ({{type ? typeObj[this.type] + '功能' : '全部'}})
          <span @click="showPopover($event)">
            <svg-icon icon-class="screen"></svg-icon>
          </span>
        </div>
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
      <slot name="operation"></slot>
    </el-table>
    <!-- 头部筛选 popover -->
    <el-popover ref='popover' placement="bottom" width="200" trigger="manual" v-model="visible">
      <div class="conHeader">
        <div class="hand f12 mb5" v-for="(item, index) in filters" :key="index" @click="setSelectType(item.value)">
          <i class="mr10 blue dib w20" :class="selectType.type == item.value ? 'el-icon-check' : ''"></i>
          <span>{{item.text}}</span>
        </div>
      </div>
      <div class="tr mt10">
          <el-button size="mini" type="primary" @click="setSelectTypeConfrim">确认</el-button>
          <el-button size="mini" @click="visible = false">取消</el-button>
      </div>
      <el-button v-show="false" slot="reference">手动激活</el-button>
    </el-popover>
  </div>
</template>

<script>
import {dataTypeObj, eventType, abilityTypeObj, typeObj, dataTypeTextObj} from '@/data/data'
import emptyCon from '@/components/empty'
export default {
  components: {emptyCon},
  props: {
   "dataFun": {
     type: Function
   },
   'productKey': {
     type: String
   },
   'typeTab': {
     type: String
   },
   'productStatus': {
     type: Number
   },
   'tableHeight': {
     type: Number
   }
  },
  data () {
    return {
      loading: false,
      list: [],
      dataTypeObj: dataTypeObj,
      eventType: eventType,
      abilityTypeObj: abilityTypeObj,
      typeObj: typeObj,
      dataTypeTextObj: dataTypeTextObj,
      identifiers: [],
      type: '',
      selectType: {
        type: ''
      },
      filters: [{
        text: '全部',
        value: ''
      }, {
        text: '标准功能',
        value: '1'
      }, {
        text: '自定义功能',
        value: '2'
      }],
      visible: false
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
            this.$emit('getList', this.list)
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
    showPopover (e) {
      this.selectType = {
        type: this.type
      }
      let el = e.target
      this.visible = true
      this.$nextTick(() => {
          let pop = this.$refs.popover
          pop.popperJS._reference = el
          pop.popperJS.state.position = pop.popperJS._getPosition(pop.popperJS._popper, pop.popperJS._reference)
          pop.popperJS.update()
      })
    },
    setSelectType (key) {
      this.selectType = {
        type: key
      }
    },
    setSelectTypeConfrim () {
      this.visible = false
      this.type = this.selectType.type
      this.getData()
    },
    resetSelectType () {
      this.type = ''
      this.getData()
    },
    handleEdit () {
      this.$emit('edit')
    }
  }
}
</script>