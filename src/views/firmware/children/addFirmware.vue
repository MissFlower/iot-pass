<!--
文件作者：liuxixiu
创建日期：2020.6.17
文件说明：新增固件
 -->
<template>
  <div>
    <el-dialog
      title="添加固件"
      :visible.sync="dialogFormVisible"
      width="400px"
      :before-close="closeDialog"
    >
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        label-width="120px"
        v-loading="loading"
      >
        <el-form-item label="固件类型" required>
          <el-radio-group v-model="ruleForm.fmType">
            <el-radio-button label="1">整包</el-radio-button>
            <el-radio-button label="2">差分</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="固件名称" prop="fmName">
          <el-input type="text" class="w200" v-model="ruleForm.fmName" placeholder="请输入固件名称"></el-input>
        </el-form-item>
        <el-form-item label="所属产品" prop="productKey">
          <el-select v-model="ruleForm.productKey" filterable :filter-method="userFilter" @change="changeSelectProduct">
            <el-option
              v-for="item in products"
              :key="item.productKey"
              :label="item.productName"
              :value="item.productKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号" required>
          <el-select v-model="ruleForm.productType" @change="changeSelectProdunctType">
            <el-option v-for="(item, index) in productTypeArr" :key="index" :label="item.productType" :value="item.productType"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="固件模块类型" required>
          <el-select
            v-model="ruleForm.moduleType"
            placeholder="固件模块类型"
            :disabled="typeDisabled"
            class="w200"
          >
            <el-option v-for="(value, index) in moduleTypeMap" :key="index" :label="value" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="固件模块" required>
          <el-radio v-model="ruleForm.typel" label="1">选择模块</el-radio>
          <el-radio v-model="ruleForm.typel" label="2">新增模块</el-radio>
          <el-select v-model="typelTag">
            <el-option label="default" value="1"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="待升级版本号" prop="srcVersion">
          <el-select v-model="srcVersion" multiple @focus="srcVersionFocus" class="w200">
            <el-option
              v-for="version in srcVersionList"
              :key="version"
              :label="version"
              :value="version"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="升级后版本号" prop="destVersion">
          <el-input type="text" v-model="ruleForm.destVersion" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="签名算法" required>
          <el-select v-model="ruleForm.signMethod" placeholder="请选择签名算法" class="w200">
            <el-option label="Md5" value="1"></el-option>
            <el-option label="SHA256" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择固件" required>
          <el-upload
            action
            :http-request="uploadFile"
            accept=".zip, .tar, .gz, .tar.gz, .gzip, .bin, .hex"
            :show-file-list="false"
            :disabled="ruleForm.fmName == '' ? true : false"
          >
            <el-button size="small" @click="beforeSelectFile">{{ uploadText }}</el-button>
            <div slot="tip" class="el-upload__tip">仅支持bin、tar、gz、tar.gz、zip、gzip、hex类型的文件</div>
          </el-upload>
          <el-progress
            v-if="uploadProgressShow"
            :percentage="100"
            :status="uploadStatus ? 'success':'exception'"
          ></el-progress>
        </el-form-item>
        <el-form-item label="固件描述" prop="fmDesc">
          <el-input
            type="textarea"
            v-model="ruleForm.fmDesc"
            placeholder="请简要描述应用的功能"
            :rows="4"
            class="w200"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addFmSubmit('ruleForm')">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { uploadFile, saveFm, getProducts, getSrcVersionList, getListModuleConfigByProductKey } from '@/api/fireware'
export default {
  props: {
    dialogFormVisible: {
      type: Boolean
    }
  },
  data() {
    const validSrcVersion = (rule, value, callback) => {
      if (this.srcVersion.length === 0) {
        callback(new Error('请选择待升级版本'))
      } else {
        if (this.ruleForm.destVersion !== '') {
          this.$refs.ruleForm.validateField('destVersion')
          callback()
        } else {
          callback()
        }
      }
    }
    const validDrcVersion = (rule, value, callback) => {
      if (value !== '' && this.srcVersion.indexOf(value) > -1) {
        callback(new Error('升级前后版本号不能相同'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      uploadText: '点击上传',
      uploadProgressShow: false,
      uploadStatus: true,
      ruleForm: {
        fmType: 1, // 固件名称 1整包、2差分
        productKey: '', // 固件所属产品名称
        productType: '', // 产品型号
        moduleType: '', // 固件模块类型
        srcVersion: '', // 待升级版本号
        destVersion: '', // 升级后固定版本
        fmName: '', // 固件名称
        fmSign: '',
        fmSize: '',
        fmUrl: '', // url
        signMethod: '1', // 签名算法 1md5 2SHA256
        fmDesc: '', // 固件描述
        fmStatus: 1,
        delFlag: 0
      },
      typelTag: '1',
      products: [],
      productMap: {},
      moduleTypeMap: [],
      productTypeArr: [],
      timeout: null,
      productForm: {
        pageNum: 1,
        pageSize: 50,
        productName: ''
      },
      productsValue: '',
      srcVersionList: [], // 待升级版本列表
      srcVersion: [],
      rules: {
        fmName: [
          { required: true, message: '请输入固件名称', trigger: 'blur' }
        ],
        srcVersion: [
          { required: true, validator: validSrcVersion, trigger: 'change' }
        ],
        destVersion: [
          { required: true, message: '请输入升级后版本号', trigger: 'blur' },
          { validator: validDrcVersion, trigger: 'change' }
        ],
        productKey: [
          { required: true, message: '请选择所属产品', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    typeDisabled: function() {
      return !this.ruleForm.productKey
    }
  },
  watch: {
    'ruleForm.moduleType': function() {
      this.srcVersion = []
      this.getVersionList()
    },
    'ruleForm.productKey': function() {
      this.getVersionList()
    }
  },
  mounted() {
    this.getProductList()
  },
  methods: {
    // 提交新增固件
    addFmSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const formData = {}
          for (const item in this.ruleForm) {
            formData[item] = this.ruleForm[item]
          }
          formData.srcVersion = this.srcVersion.join(',')
          this.loading = true
          saveFm(formData)
            .then(res => {
              if (res.code === 200) {
                this.$emit('changeVisible', this.dialogFormVisible)
                this.$emit('changeList', true)
                this.$refs['ruleForm'].resetFields() // 清空弹出框校验
              } else {
                this.$message.warning(res.message)
              }
              this.loading = false
            })
            .catch(error => {
              console.log(error)
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeDialog() {
      this.$refs['ruleForm'].resetFields() // 清空弹出框校验
      this.uploadText = '上传文件'
      this.uploadProgressShow = false
      this.$emit('changeVisible', this.dialogFormVisible)
    },
    beforeSelectFile() {
      if (this.ruleForm.fmName === '') {
        this.$refs.ruleForm.validateField('fmName')
      }
    },
    // 上传文件
    uploadFile(data) {
      const fromData = new FormData()
      fromData.append('file', data.file)
      fromData.append('fmName', this.ruleForm.fmName)
      this.uploadProgressShow = false
      uploadFile(fromData)
        .then(res => {
          if (res.data.fmUrl) {
            // this.ruleForm.fmName = res.data.fmName || this.ruleForm.fmName;
            this.ruleForm.fmUrl = res.data.fmUrl
            this.ruleForm.fmSign = res.data.fmSign
            this.ruleForm.fmSize = res.data.fmSize
            this.uploadText = '重新上传'
            this.uploadStatus = true
            this.uploadProgressShow = true
          } else {
            this.uploadStatus = false
            this.uploadProgressShow = true
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    userFilter(query = '') {
      const arr = this.products.filter(item => {
        return item.productName.includes(query)
      })
      if (arr.length > 50) {
        this.products = arr.slice(0, 50)
      } else {
        this.products = arr
      }
    },
    // 获取产品列表
    getProductList() {
      this.productForm.productName = this.productsValue.split('|')[1]
        ? this.productsValue.split('|')[1]
        : ''
      const data = this.productForm
      getProducts(data).then(res => {
        if (res.code === 200) {
          this.products = res.data.data
          this.productMap = {}
          res.data.data.forEach(item => {
            this.productMap[item.productKey] = item
          })
          this.userFilter()
        }
      })
    },
    changeSelectProduct() {
      this.productTypeArr = []
      this.ruleForm.productType = ''
      this.ruleForm.moduleType = ''
      this.srcVersionList = []
      this.ruleForm.srcVersion = ''
      this.moduleTypeMap = []
      this.getProductType(this.ruleForm.productKey)
    },
    getProductType(key) {
      getListModuleConfigByProductKey(key).then(res => {
        if (res.code === 200) {
          this.productTypeArr = res.data ? res.data : []
        }
      })
    },
    changeSelectProdunctType() {
      this.ruleForm.moduleType = ''
      for (let i = 0; i < this.productTypeArr.length; i++) {
        const row = this.productTypeArr[i]
        if (row.productType === this.ruleForm.productType) {
          this.moduleTypeMap = row.moduleTypeList
          break
        }
      }
    },
    srcVersionFocus() {
      if (this.srcVersionList.length === 0) {
        if (!this.ruleForm.productKey) {
          this.$message.warning('请选择所属产品')
        } else if (this.ruleForm.moduleType === '') {
          this.$message.warning('请选择固件模块类型')
        }
      }
    },
    getVersionList() {
      if (!this.ruleForm.productKey) {
        return
      } else if (this.ruleForm.moduleType === '') {
        return
      }
      this.loading = true
      getSrcVersionList({
        productKey: this.ruleForm.productKey,
        moduleType: this.ruleForm.moduleType,
        productType: this.ruleForm.productType
      }).then(res => {
        if (res.code === 200) {
          this.srcVersionList = res.data
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
