<!--
文件作者：mawenjuan
创建日期：2020.6.23
文件说明：自定义功能的属性部分
-->

<template>
  <div id="attributeCon">
    <datatype-selectpart
      ref="form"
      :info="formData.dataType"
      :show-flag="showFlag"
      :all-flag="allFlag"
      :model-type="modelType"
      @success="handleSuccess"
    ></datatype-selectpart>
    <div class="form_label">
      <span class="red mr5">*</span>读写类型
    </div>
    <el-form-item>
      <el-radio v-model="formData.accessMode" label="rw" :disabled="showFlag">读写</el-radio>
      <el-radio v-model="formData.accessMode" label="r" :disabled="showFlag">只读</el-radio>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    dataType: {
      type: Object,
      default: () => {}
    },
    accessMode: {
      type: String,
      default: ''
    },
    showFlag: {
      type: Boolean,
      default: false
    },
    modelType: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        accessMode: 'rw',
        dataType: null
      },
      allFlag: 0
    }
  },
  mounted() {
    if (this.accessMode) {
      this.formData.accessMode = this.accessMode
    }
    if (this.dataType) {
      // if (this.dataType.type) {
      //   this.dataType.type = this.dataTypeObj[this.dataType.type]
      //     ? this.dataTypeObj[this.dataType.type]
      //     : this.dataType.type
      // }
      this.formData.dataType = JSON.parse(JSON.stringify(this.dataType))
    }
  },
  methods: {
    // 数据选择成功的回调
    handleSuccess(data) {
      if (data) {
        this.formData.dataType = JSON.parse(JSON.stringify(data))
        this.$emit('callBack', this.formData)
      } else {
        this.$emit('callBack', null)
      }
    },
    // 父级获取输入的参数
    getDataForParent() {
      this.$refs.form.getDataForParent()
    }
  }
}
</script>
