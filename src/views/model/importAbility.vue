<template>
  <el-dialog :visible.sync="dialogVisible" class="importDialog" title="导入物模型" width="400px" @close="close">
    <div class="json_item">
      <i class="el-icon-warning blue"></i>
      注：导入的物模型会覆盖原来的功能。
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="拷贝产品" name="1">
        <el-form :model="formData">
          <el-form-item label="选择产品">
            <el-select v-model="formData.product" placeholder="请选择产品">
              <el-option v-for="(item, index) in productList" :key="index" :value="item.id">{{item.name}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择版本">
            <el-select v-model="formData.product" placeholder="请选择产品">
              <el-option v-for="(item, index) in productList" :key="index" :value="item.id">{{item.name}}</el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="导入物模型" name="2">
        <div class="mb10">
          <span class="red mr5">*</span>
          <span>上传物模型文件</span>
          <el-tooltip>
            <i class="el-icon-question c9"></i>
            <div slot="content" class="f12 c9 w200">文件大小不能超过256KB.</div>
          </el-tooltip>
        </div>
        <el-upload
          :action="src">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer">
      <el-button type="primary" @click="handleSave" disabled>确认</el-button>
      <el-button @click="close" disabled>取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: true,
      formData: {
        product: '',
        version: ''
      },
      productList: [],
      src: '',
      activeName: '1'
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    handleClick () {},
    handleSave () {}
  }
}
</script>

<style lang="scss">
.importDialog {
  .el-dialog__body {
    padding: 0 20px;
    .json_item {
      padding: 10px!important;
    }
  }
}
</style>

