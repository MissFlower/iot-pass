<!--
 * @Description: 添加设备
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-04 10:32:25
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-04 16:08:18
-->

<template>
  <el-dialog
    v-loading="loading"
    title="添加设备"
    :visible.sync="dialogVisible"
    width="500px"
    @close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="产品：" prop="productSelIndex">
        <el-select
          v-model="ruleForm.productSelIndex"
          class="wp100"
          placeholder="请选择产品"
          :disabled="selectDisabled"
        >
          <el-option
            v-for="(item, index) in productList"
            :key="index"
            :label="item.productName"
            :value="index"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备名称：" prop="deviceName">
        <el-input v-model="ruleForm.deviceName" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="备注名称：" prop="nickName">
        <el-input v-model="ruleForm.nickName" placeholder="请输入备注名称" />
      </el-form-item>
      <el-form-item class="mt20 tr" style="margin-bottom:0;">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { productList, createDevice } from '@/api/deviceRequest'
export default {
  props: {
    appointProduck: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: true,
      productList: [],
      selectDisabled: false,
      loading: false,
      ruleForm: {
        productSelIndex: null,
        deviceName: '',
        nickName: ''
      },
      rules: {
        productSelIndex: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ],
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: false, message: '请输入备注名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    if (this.appointProduck.productName === '全部产品') {
      this.getProductList()
    } else {
      this.selectDisabled = true
      this.ruleForm.productSelIndex = this.appointProduck.productName
    }
  },

  methods: {
    // 获取产品列表
    getProductList() {
      productList({
        pageNum: 1,
        pageSize: 100,
        productName: ''
      })
        .then(res => {
          if (res.code === 200) {
            if (res.data) {
              this.productList = res.data.data
            }
          }
        })
        .catch(() => {})
    },

    // 取消
    handleCancel() {
      this.$parent.newDeviceClose()
    },

    // 验证所填信息
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleSave()
        } else {
          return false
        }
      })
    },

    // 保存
    handleSave() {
      this.loading = true
      var productObj
      if (this.appointProduck.productName === '全部产品') {
        productObj = this.productList[this.ruleForm.productSelIndex]
      } else {
        productObj = this.appointProduck
      }

      createDevice({
        productId: productObj.id,
        productKey: productObj.productKey,
        deviceName: this.ruleForm.deviceName,
        nickName: this.ruleForm.nickName
      })
        .then(res => {
          this.loading = false
          if (res.code === 200) {
            this.$parent.newDeviceClose(true)
          }
          this.$message({
            type: res.code === 200 ? 'success' : 'warning',
            message: res.message
          })
        })
        .catch(() => {
          this.loading = false
        })
    },

    // 窗口关闭
    handleClose() {
      this.handleCancel()
    }
  }
}
</script>

<style lang="scss" scoped></style>
