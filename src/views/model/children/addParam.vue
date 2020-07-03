<!-- 
文件作者：mawenjuan
创建日期：2020.6.23
文件说明：新增参数的弹框
 -->

<template>
  <el-dialog id="addParam" :title="title" :visible.sync="dialogVisible" append-to-body  width="400px" @close="close">
    <el-form ref="form" :model="formData" :rules="rules">
      <el-form-item prop="name">
        <span slot="label">
          参数名称
          <el-tooltip>
            <i class="el-icon-question c9"></i>
            <div slot="content" class="f12 c9 w200">必填，支持中文、大小写字母、数字、短划线、下划线和小数点，必须以中文、英文或数字开头，不超过30个字符。</div>
          </el-tooltip>
        </span>
        <el-input v-model="formData.name" placeholder="请输入您的参数名称"></el-input>
      </el-form-item>
      <el-form-item prop="identifier">
        <span slot="label">
          标记符
          <el-tooltip>
            <i class="el-icon-question c9"></i>
            <div slot="content" class="f12 c9 w200">必填，支持大小写字母、数字和下划线、不超过50个字符。</div>
          </el-tooltip>
        </span>
        <el-input v-model="formData.identifier" placeholder="请输入您的标识符" :disabled="info ? true : false"></el-input>
      </el-form-item>
      <datatype-selectpart ref="dataSelect" :type="`addParam`" :info="formData.dataType" @success="handleSuccess"></datatype-selectpart>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="handleSave">确认</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dataObj from '@/data/data'
export default {
  props: ['specs', 'info'],
  data () {
    const validateIdentifier = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('参数标识符不能为空'))
      } else if (this.specsArr.indexOf(value) > -1 && !this.info) {
        callback(new Error('参数标识符已存在'))
      } else {
        callback()
      }
    } 
    return {
      dialogVisible: true,
      title: '',
      formData: {
        name: '',
        identifier: '',
        dataType: null
      },
      rules: {
        name: [
          { required: true, message: '参数名不能为空', trigger: 'change' },
        ],
        identifier: [
          { required: true, validator: validateIdentifier, trigger: 'change' },
        ]
      },
      specsArr: [],
      dataTypeObj: dataObj.dataTypeObj
    }
  },
  mounted () {
    if (this.specs && Array.isArray(this.specs)) {
      this.specs.forEach(item => {
        this.specsArr.push(item.identifier)
      })
    }
    if (this.info) {
      this.formData = JSON.parse(JSON.stringify(this.info))
      if (this.dataTypeObj[this.formData.dataType.type]) {
        this.formData.dataType.type = this.dataTypeObj[this.formData.dataType.type]
      }
      this.title = '编辑参数'
    } else {
      this.title = '新增参数'
    }
  },
  methods: {
    // 保存
    handleSave () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$refs.dataSelect.getDataForParent()
        }
      })
    },
    // 数据选择成功的回调
    handleSuccess (data) {
      if (data) {
        this.formData.dataType = data
        this.$emit('success', this.formData)
        this.close()
      } else {
        this.$emit('success', null)
      }
    },
    close () { // 弹框关闭函数
      this.dialogVisible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
#addParam {
  .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label {
    float: none;
  }
}
</style>