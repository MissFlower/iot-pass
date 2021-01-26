<!--
文件作者：mawenjuan
创建日期：2021.1.20
文件说明：添加模块
 -->
<template>
  <el-dialog :visible.sync="dialogVisible" width="400px" :title="`${row ? '编辑' : '添加'}模块`" @close="close" v-loading="loading">
    <el-form ref="addModular" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="固件模块类型:" prop="moduleType">
        <el-input v-model="formData.moduleType" placeholder="请输入固件模块类型" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="所属产品:" prop="productKey">
        <el-select v-model="formData.productKey" placeholder="请选择所属产品" @change="getProductType" class="w200">
          <el-option
            v-for="item in productList"
            :key="item.productKey"
            :value="item.productKey"
            :label="item.productName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品型号:" prop="productType">
        <el-input v-model="formData.productType" placeholder="请输入产品型号" class="w200"></el-input>
        <!-- <el-select v-model="formData.productType" class="w200">
          <el-option v-for="(item, index) in productTypeArr" :key="index" :label="item.productType" :value="item.productType"></el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="硬件版本:" prop="hardwareVersion">
        <el-input v-model="formData.hardwareVersion" placeholder="请输入硬件版本" class="w200"></el-input>
      </el-form-item>
      <!-- <el-form-item label="模块别名">
        <el-input v-model="formData.product" placeholder="请输入模块别名"></el-input>
      </el-form-item>
      <el-form-item label="模块描述">
        <el-input v-model="formData.product" type="textarea" placeholder="请输入模块描述"></el-input>
      </el-form-item> -->
      <div class="tr">
        <el-button class="mr20" @click="close">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { getProducts, getListModuleConfigByProductKey, saveModule, updateModule } from '@/api/fireware'
export default {
  props: {
    row: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: true,
      formData: {
        productKey: '',
        productType: '',
        moduleType: '',
        hardwareVersion: ''
      },
      rules: {
        moduleType: [
          { required: true, message: '请输入固件模块类型', trigger: 'blur' },
          { max: 50, message: '长度不大于50个字符', trigger: 'blur' }
        ],
        productKey: [
          { required: true, message: '请选择所属产品', trigger: 'blur' }
        ],
        productType: [
          { required: true, message: '请选择产品类型', trigger: 'blur' },
          { max: 50, message: '长度不大于50个字符', trigger: 'blur' }
        ],
        hardwareVersion: [
          { required: true, message: '请输入硬件版本', trigger: 'blur' },
          { max: 50, message: '长度不大于50个字符', trigger: 'blur' }
        ]
      },
      productList: [],
      productTypeArr: []
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.app.userInfo
    }
  },
  mounted() {
    if (this.row) {
      for (const key in this.formData) {
        this.formData[key] = this.row[key]
        this.formData['id'] = this.row['id']
      }
    }
    this.formData.uid = this.userInfo.id
    this.getProductList()
  },
  methods: {
    close(val) {
      this.$emit('close')
    },
    getProductList() {
      this.loading = true
      this.productList = []
      this.formData.productKey = ''
      getProducts({
        pageNum: 1,
        pageSize: 1000,
        productName: ''
      }).then(res => {
        if (res.code === 200 && res.data.data) {
          this.productList = res.data.data
          if (this.row) {
            this.formData.productKey = this.row.productKey
          }
        }
        this.loading = false
      })
    },
    getProductType() {
      this.productTypeArr = []
      getListModuleConfigByProductKey(this.formData.productKey).then(res => {
        if (res.code === 200) {
          this.productTypeArr = res.data ? res.data : []
        }
      })
    },
    handleSave() {
      this.$refs.addModular.validate(valid => {
        if (valid) {
          let promise = saveModule
          let str = '添加'
          if (this.row) {
            promise = updateModule
            str = '编辑'
          }
          this.loading = true
          promise(this.formData).then(res => {
            if (res.code === 200) {
              this.$message.success(`${str}模块成功`)
              this.close()
              this.$parent.getModular()
            } else {
              this.$message.error(res.message)
            }
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
