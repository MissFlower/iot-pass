<!-- 
文件作者：mawenjuan
创建日期：2020.6.23
文件说明：新增参数的弹框
 -->

<template>
  <el-dialog id="addParam" title="新增参数" :visible.sync="dialogVisible" append-to-body  width="400px">
    <el-form :model="formData">
      <el-form-item>
        <span slot="label">
          参数名称
          <el-tooltip>
            <i class="el-icon-question c9"></i>
            <div slot="content" class="f12 c9 w200">必填，支持中文、大小写字母、数字、短划线、下划线和小数点，必须以中文、英文或数字开头，不超过30个字符。</div>
          </el-tooltip>
        </span>
        <el-input placeholder="请输入您的参数名称"></el-input>
      </el-form-item>
      <el-form-item>
        <span slot="label">
          标记符
          <el-tooltip>
            <i class="el-icon-question c9"></i>
            <div slot="content" class="f12 c9 w200">必填，支持大小写字母、数字和下划线、不超过50个字符。</div>
          </el-tooltip>
        </span>
        <el-input placeholder="请输入您的标识符"></el-input>
      </el-form-item>
      <datatype-selectpart :type="`addParam`"></datatype-selectpart>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: true,
      formData: {
        name: '',
        identifier: ''
      }
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