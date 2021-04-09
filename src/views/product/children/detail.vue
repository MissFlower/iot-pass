<template>
  <div id="addProduct" v-loading="mainLoading">
    <div class="f20 b pb20 df ai_c jc_sb">
      <div>
        <i class="el-icon-back" @click="goBack"></i>
        <span class="ml15">{{ productName }}</span>
      </div>
      <el-button :type="btnType" size="mini" @click="releaseProduct" v-if="authArr.indexOf('product_release') > -1 && operateFlag">{{ btnType ? '发布' : '撤销发布' }}</el-button>
    </div>
    <div class="p_key">
      <div class="flex1 df ai_c">
        <div class="w100 c9 mr20">ProductKey:</div>
        <span class="c6">{{ productKey }}</span>
        <iconToolTip ref="iconToolTip" :content="`复制`" :icon="`el-icon-copy-document`" :copyStr="productKey" v-if="operateFlag" class="ml10"></iconToolTip>
      </div>
      <div class="flex1 df ai_c">
        <span class="w100 c9 mr20">ProductSecret:</span>
        <span class="c6">*******</span>
        <iconToolTip ref="iconToolTip" :content="`查看`" :icon="`eye`" @clickFun="seeSecret" v-if="operateFlag" class="ml10"></iconToolTip>
      </div>
    </div>
    <div class="p_key mt10">
      <span class="w100 c9 mr20">设备数:</span>
      <span class="c6">{{ productData.deviceCount ? productData.deviceCount : 0 }}</span>
      <iconToolTip ref="iconToolTip" :content="`前往管理`" :icon="`manage`" @clickFun="goEqu" v-if="operateFlag" class="ml10"></iconToolTip>
    </div>
    <div class="mt20">
      <el-tabs v-model="activeName" type="card" @tab-click="tabChange">
        <el-tab-pane label="产品信息" name="product" :disabled="!operateFlag">
          <product-info
            :product-data="productData"
            :btn-type="btnType"
            :operateFlag="operateFlag"
            @changeProName="changeProName"
          />
        </el-tab-pane>

        <el-tab-pane label="Topic类列表" name="topic" :disabled="!operateFlag">
          <product-topic :productId="productData.id" :productStatus="productData.productStatus" />
        </el-tab-pane>

        <el-tab-pane label="功能定义" name="second" :disabled="!operateFlag">
          <product-ability
            v-if="productData.productKey && activeName == 'second'"
            :productData="productData"
            :operateFlag="operateFlag"
          ></product-ability>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="产品证书" :visible.sync="dialogVisible" width="50%">
      <div class="dialogSecret">
        <span class="text">ProductSecret</span>
        <span class="secret">{{ productSecret }}</span>
        <iconToolTip ref="iconToolTip" :content="`复制`" :icon="`el-icon-copy-document`" :copyStr="productSecret" class="ml10"></iconToolTip>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findSecret, getProduct, cancelRelease, release } from '@/api/product'
import productInfo from './info'
import productTopic from './topic/topic'
import productAbility from '@/views/model/modelTab'
import iconToolTip from '@/components/iconToolTip'
export default {
  components: {
    productInfo,
    productTopic,
    productAbility,
    iconToolTip
  },
  data() {
    return {
      mainLoading: false,
      productKey: this.$route.params.key,
      dialogVisible: false,
      activeName: 'product',
      standardSelectState: true,
      btnType: 'primary', // 按钮type，记录产品是否发布
      productName: '',
      loading: false,
      productSecret: '',
      productData: {},
      operateFlag: false // 产品是否存在
    }
  },
  computed: {
    authArr() {
      return this.$store.state.app.functionArr
    }
  },
  watch: {
    $route() {
      if (this.$route.path.indexOf('/product/detail/') > -1 && this.$route.params.key) {
        this.productKey = this.$route.params.key
        this.getInfo()
      }
    }
  },
  created() {
    this.getInfo()
  },
  mounted() {
    if (this.$route.query.activetab) {
      this.activeName = this.$route.query.activetab
    }
  },
  methods: {
    getInfo() {
      if (this.productKey) {
        this.getProDetail()
        // 获取产品密钥
        findSecret({ productKey: this.productKey }).then(res => {
          if (res.code === 200) {
            this.productSecret = res.data
          }
        })
      }
    },
    // 设备管理
    goEqu() {
      this.$router.push(`/device/deviceManage?productId=${this.productData.id}`)
    },
    // 修改产品名称
    changeProName(name) {
      this.productName = name
    },
    // 产品发布、取消
    releaseProduct() {
      if (this.btnType === '') {
        this.$confirm('确认要将产品撤销发布吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.mainLoading = true
          cancelRelease({ productKey: this.productKey }).then(res => {
            this.mainLoading = false
            if (res.code === 200) {
              this.btnType = 'primary'
              this.$message({
                type: 'success',
                message: '撤销发布成功！'
              })
              this.productData.productStatus = 0
              this.productData = JSON.parse(JSON.stringify(this.productData))
            } else {
              this.$message.warning(res.message)
            }
          }).catch(err => {
            this.mainLoading = false
            this.$message.error(err)
          })
        })
      } else {
        this.$confirm('请确认产品的各项基本信息准确无误，产品发布后将无法再做修改和删除。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.mainLoading = true
          release({ productKey: this.productKey }).then(res => {
            this.mainLoading = false
            if (res.code === 200) {
              this.btnType = ''
              this.$message({
                type: 'success',
                message: '发布成功!'
              })
              this.productData.productStatus = 1
              this.productData = JSON.parse(JSON.stringify(this.productData))
            } else {
              this.$message.warning(res.message)
            }
          }).catch(err => {
            this.mainLoading = false
            this.$message.error(err)
          })
        })
      }
    },
    // 查看密钥
    seeSecret() {
      this.dialogVisible = true
    },
    // 返回上层页面
    goBack() {
      // this.$router.go(-1)
      this.$router.push('/product/index')
    },
    // 切换tab
    tabChange(val) {

    },
    // 获取产品详情数据
    getProDetail() {
      this.loading = true
      getProduct({ productKey: this.productKey }).then(res => {
        this.loading = false
        if (res.code === 200 && res.data) {
          this.productName = res.data.productName
          this.productData = res.data
          if (res.data.productStatus === 0) {
            this.btnType = 'primary'
          } else {
            this.btnType = ''
          }
          this.operateFlag = true
        } else {
          if (!res.data) {
            this.operateFlag = false
            this.activeName = 'product'
          }
          this.productData = {}
          this.$message.warning(res.message)
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.p_key {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.dialogSecret {
  border: 1px solid #ecedee;
  height: 36px;
  display: flex;
  align-items: stretch;
  span {
    display: flex;
    align-items: center;

    padding: 5px;
  }
  .text {
    background: #fbfbfc;
    border-right: 1px solid #ecedee;
  }
}

#addProduct {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
