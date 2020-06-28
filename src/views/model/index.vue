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
      <div class="flex1 df ai_c">
        <div class="w120">产品名称</div>
        <div>ceshi</div>
      </div>
      <div class="flex1 df ai_c">
        <div class="w120">productKey</div>
        <div>{{productKey}}</div>
      </div>
    </div>
    <div class="mb10">
      <el-button type="primary" size="mini" disabled>添加标准功能</el-button>
      <el-button size="mini" @click="handleShowAdd">添加自定义功能</el-button>
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
        <svg-icon icon-class="empty"></svg-icon>
        <div class="lh16 w300 tl ml20">
          <div class="b">尚未添加任何功能</div>
          <div class="c9 f12 mt10">您可以通过添加属性、事件、服务三类功能完成产品物模型的定义，产品下的设备都会继承该模型。</div>
          <div class="mt20">
            <el-button type="primary" size="mini">编辑草稿</el-button>
            <el-button size="mini">了解更多</el-button>
          </div>
        </div>
      </div>
      <el-table-column label="功能类型" prop="type"></el-table-column>
      <el-table-column label="功能名称（全部）" prop="name"></el-table-column>
      <el-table-column label="标识符" prop="identifier"></el-table-column>
      <el-table-column label="数据类型"></el-table-column>
      <el-table-column label="数据定义" prop="desc"></el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template slot-scope="scope">
          <el-link :underline="false" type="primary" class="f12" @click="showDetail(scope.row)">查看</el-link>
        </template>
      </el-table-column>
    </el-table>
    <add-custom-ability v-if="addFlag" :productKey="productKey"></add-custom-ability>
  </div>
</template>

<script>
import { getModelByproductKey } from '@/api/model'
import addCustomAbility from './addCustomAbility'
export default {
  components: {addCustomAbility},
  data () {
    return {
      loading: false,
      list: [],
      addFlag: false,
      productKey: ''
    }
  },
  mounted () {
    if (this.$route.query.key) {
      this.productKey = this.$route.query.key
      this.getData()
    }
  },
  methods: {
    getData() {
      this.loading = true
      this.list = []
      getModelByproductKey({productKey: this.productKey}).then(res => {
        if (res.code === 200) {
          // console.log(res)
          if (res.data.allJson) {
            this.list = this.list.concat(res.data.allJson.events)
            this.list = this.list.concat(res.data.allJson.properties)
            this.list = this.list.concat(res.data.allJson.services)
          }
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      })
    },
    // 详情查看
    showDetail (item) {
      console.log(item)
    },
    // 添加自定义功能
    handleShowAdd () {
      this.addFlag = true
    },
    // 返回上级
    goBack () {
      this.$router.push({path: `/product/detail/${this.productKey}?activetab=second`})
    }
  }
}
</script>


<style lang="scss" scoped>
#model {
  padding: 0 10px;
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
