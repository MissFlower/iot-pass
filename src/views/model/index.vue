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
      <el-button size="mini" disabled>快速导入</el-button>
      <el-button size="mini" disabled>物模型 TSL</el-button>
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
      <el-table-column label="功能类型" prop="type">
        <template slot-scope="scope">
          {{abilityTypeObj[scope.row.abilityType]}}
        </template>
      </el-table-column>
      <el-table-column prop="name">
        <span slot="header">
          功能名称（全部）
          <!-- <span class="header-popover">
            <svg-icon icon-class="screen" class="hand" @click="visible = !visible"></svg-icon>
            <div class="conHeader">
              <div v-for="(item, key) in typeObj" :key="key">{{item}}</div>
            </div>
          </span> -->
          <el-popover
            placement="bottom"
            width="100"
            trigger="click"
            v-if="visible"
            >
            <div class="conHeader">
              <div>
                <i class="mr10 blue dib w20" :class="type == '' ? 'el-icon-check' : ''"></i>
                <span>全部</span>
              </div>
              <div v-for="(item, key) in typeObj" :key="key">
                <i class="mr10 blue dib w20" :class="type == key ? 'el-icon-check' : ''"></i>
                <span>{{item}}</span>
              </div>
              <div class="mt10 tc">
                <el-button type="primary" size="mini">确认</el-button>
                <el-button size="mini">重置</el-button>
              </div>
            </div>
            <svg-icon icon-class="screen" slot="reference" @click="handle"></svg-icon>
          </el-popover>
        </span>
        <template slot-scope="scope">
          {{scope.row.name}}
          <el-tag>{{typeObj[scope.row.type]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标识符" prop="identifier"></el-table-column>
      <el-table-column label="数据类型">
        <template slot-scope="scope">
          {{scope.row.dataType ? scope.row.dataType.type : ''}}
        </template>
      </el-table-column>
      <el-table-column label="数据定义">
        <template slot-scope="scope">
          {{scope.row.dataType ? scope.row.dataType.specs : ''}}
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
    <add-std-ability v-if="addStdAbilityFlag"></add-std-ability>
  </div>
</template>

<script>
import { getModelByproductKey } from '@/api/model'
import addCustomAbility from './addCustomAbility'
import addStdAbility from './addStdAbility'

import dataObj from '@/data/data'
export default {
  components: {addCustomAbility, addStdAbility},
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
      type: '', // 用于列表功能类型筛选
      visible: true,
      allData: null
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
          // console.log(res)
          // if (res.data && res.data.allJson) {
          //   this.list = this.list.concat(res.data.allJson.events)
          //   this.list = this.list.concat(res.data.allJson.properties)
          //   this.list = this.list.concat(res.data.allJson.services)
          // }
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
                      item.type = '0' // 0 自定义
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
    handle () {
      if (this.visible) {
        this.visible = false
      } else {
        this.visible = true
      }
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
