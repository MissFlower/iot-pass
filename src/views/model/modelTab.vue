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
        当前展示的是已发布到线上的功能定义，如需修改，请点击
        <el-link :underline="false" type="primary" class="f12" @click="handleEdit">编辑草稿</el-link>
      </div>
      <el-button size="mini" disabled>物模型 TSL</el-button>
      <el-button size="mini" disabled>生成设备端代码</el-button>
    </div>
    <el-table :data="list" :max-height="maxHeight" border>
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
    <add-custom-ability v-if="addFlag"></add-custom-ability>
  </div>
</template>

<script>
import { getModelByproductKey } from '@/api/model'
import addCustomAbility from './addCustomAbility'
export default {
  components: {addCustomAbility},
  props: ['productKey'],
  data () {
    return {
      loading: false,
      list: [],
      maxHeight:  window.innerHeight - 18 - 15 - 20 - 40,
      addFlag: false
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
    showDetail (item) {
      console.log(item)
    },
    handleEdit () {
      // this.addFlag = true
      console.log('------')
      this.$router.push(`/model/index?key=${this.productKey}`)
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
