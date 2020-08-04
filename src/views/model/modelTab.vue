<!-- 
文件作者：mawenjuan
创建日期：2020.6.28
文件说明：功能定义tab页面
 -->

<template>
  <div id="model" v-loading="loading">
    <div class="mb10">
      <el-button type="primary" size="mini" v-if="list.length == 0 && !loading" @click="handleEdit" :disabled="productStatus ? true : false">编辑草稿</el-button>
      <div v-if="list.length > 0 && !loading" class="info df ai_c mb5">
        <i class="el-icon-warning blue mr5"></i>
        当前展示的是已发布到线上的功能定义，
        <span v-if="productStatus ? true : false">如需编辑请先撤销发布</span>
        <span v-else class="df ai_c">如需修改，请点击
          <el-link :underline="false" type="primary" class="f12" @click="handleEdit">编辑草稿</el-link>
        </span>
      </div>
      <el-button size="mini" :disabled="list.length == 0" @click="showCheck">物模型 TSL</el-button>
      <el-button size="mini" disabled>生成设备端代码</el-button>
    </div>
    <model-list ref="modelList" v-if="productKey" :typeTab="'tab'" :productKey="productKey" :dataFun="dataFun" :productStatus="productStatus" :tableHeight="tableHeight" @edit="handleEdit" @getList="setList">
      <el-table-column label="操作" width="80" align="center" slot="operation">
        <template slot-scope="scope">
          <el-link :underline="false" type="primary" class="f12" @click="showDetail(scope.row)">查看</el-link>
        </template>
      </el-table-column>
    </model-list>
    <add-custom-ability v-if="showFlag" :productKey="productKey" :editAbility="editAbility" @close="closeAddCustomAbility" :showFlag="true"></add-custom-ability>
    <check-model v-if="checkFlag" :productKey='productKey' @close="closeCheck"></check-model>
  </div>
</template>

<script>
import { getModelByproductKey } from '@/api/model'

import addCustomAbility from './addCustomAbility'
import checkModel from './checkModel'
import modelList from './children/list'

export default {
  components: { addCustomAbility, checkModel, modelList },
  props: ['productData'],
  data () {
    return {
      loading: false,
      list: [],
      dataFun: getModelByproductKey,
      showFlag: false,
      editAbility: null,
      checkFlag: false,
      productKey: '',
      productStatus: -1,
      tableHeight: window.innerHeight - 350
    }
  },
  mounted () {
    if (this.productData) {
      this.productKey = this.productData.productKey
      this.productStatus = this.productData.productStatus
    }
  },
  methods: {
    setList (data) {
      this.list = data
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
      this.$router.push(`/model/index?key=${this.productKey}&name=${this.productData.productName}`)
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
  position: relative;
  width: 100%;
  height: 100%;
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
