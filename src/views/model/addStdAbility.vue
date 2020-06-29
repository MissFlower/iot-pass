<template>
  <el-dialog :visible.sync="dialogVisible" class="dialogVisibleDialog" title="添加标准功能">
    <div class="con df ai_c">
      <div class="flex1">
        <div>选择功能</div>
        <div class="con-item">
          <el-radio-group v-model="type">
            <el-radio-button label="自定义品类"></el-radio-button>
            <el-radio-button label="其他类型"></el-radio-button>
          </el-radio-group>
          <el-input placeholder="请输入功能名称" suffix-icon="el-icon-search"></el-input>
          <div v-for="(item, index) in list" :key="index" class="con-item-ability df ai_c">
            <div class="w20"><i class="el-icon-check"></i></div>
            <div>
              <div>{{item.name}}<span class="dib blue f12">{{item.type}}</span></div>
              <div class="f12 c9">标识符： {{item.ids}}</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <el-tag type="info" effect="plain"><i class="el-icon-arrow-left"></i></el-tag>
        <el-tag type="info" effect="plain"><i class="el-icon-arrow-right"></i></el-tag>
      </div>
      <div class="flex1">
        <div>
          <span>选择功能</span>
          <el-link type="primary" class="f12 fr">全选删除</el-link>
        </div>
        <div class="con-item"></div>
      </div>
    </div>

  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      type: '',
      list: [{
        name: 'ceshi',
        type: '1',
        ids: ['sad', 'dsaa']
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogVisibleDialog {
  .con {
    height: 400px;
    width: 100%;
    .con-item {
      height: 360px;
      border: 1px solid #d7d8d9;
      padding: 12px 16px;
    }
  }
}
</style>