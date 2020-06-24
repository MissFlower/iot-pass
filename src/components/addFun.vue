<template>
  <el-dialog :visible.sync="dialogVisible" title="添加自定义功能" width="400px" class="addFun">
    <el-form :model="formData" :rules="rules">
      <el-form-item>
        <span slot="label">
          功能类型
          <el-tooltip>
            <i class="el-icon-question c9"></i>
            <div slot="content" class="f12 c9">属性一般是设备的运行状态，如当前温度等；服务是设备可被调用的方法，支持定义参数，如执行某项任务；事件则是设备上报的通知，如告警，需要被及时处理。</div>
          </el-tooltip>
        </span>
        <el-radio-group v-model="type">
          <el-radio-button label="1">属性</el-radio-button>
          <el-radio-button label="2">服务</el-radio-button>
          <el-radio-button label="3">事件</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <span slot="label">
          功能名称
          <el-tooltip>
            <i class="el-icon-question c9"></i>
            <div slot="content" class="f12 c9">必填，支持中文、大小写字母、数字、短划线、下划线和小数点，必须以中文、英文或数字开头，不超过30个字符。</div>
          </el-tooltip>
        </span>
        <el-input placeholder="请输入您的标识符"></el-input>
      </el-form-item>
      <el-form-item>
        <span slot="label">
          功能类型
          <el-tooltip>
            <i class="el-icon-question c9"></i>
            <div slot="content" class="f12 c9">必填，支持大小写字母、数字和下划线、不超过50个字符。</div>
          </el-tooltip>
        </span>
        <el-input placeholder="请输入您的标识符"></el-input>
      </el-form-item>
      <attribute-con v-if="type == 1"></attribute-con>
      <service-con v-if="type == 2"></service-con>
      <event-con v-if="type == 3"></event-con>
      <el-form-item label="描述">
        <el-input v-model="formData.desc" type="textarea" placeholder="请输入描述" :rows="4" maxlength="100" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary">确认</el-button>
      <el-button>取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import attributeCon from "./children/attributeCon";
import serviceCon from "./children/serviceCon";
import eventCon from "./children/eventCon";

export default {
  components: {attributeCon, serviceCon, eventCon},
  data () {
    return {
      dialogVisible: false,
      type: 1,
      formData: {
        desc: ''
      },
      rules: {}
    }
  },
  mounted () {
    // if (location.href.indexOf('localhost') > -1) {
    //   this.dialogVisible = true
    // }
  }
}
</script>

<style lang="scss">
.addFun {
  .el-dialog__body {
    padding: 10px 20px 0;
  }
  .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label {
    float: none;
  }
}
</style>