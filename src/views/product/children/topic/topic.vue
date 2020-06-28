<template>
  <div>
     <el-radio-group v-model="topicRadio">
      <el-radio-button label="基础通信Topic"></el-radio-button>
      <el-radio-button label="物模型通信Topic"></el-radio-button>
      <el-radio-button label="自定义Topic"></el-radio-button>      
    </el-radio-group>

    <div v-show="topicRadio === '基础通信Topic'">
      <basics :basicsData="basicsData"/>
    </div>

    <div v-show="topicRadio === '物模型通信Topic'">
      <model :modelData="modelData"/>
    </div>

    <div v-show="topicRadio === '自定义Topic'">
      <custom />
    </div>
  </div>
</template>

<script>
import basics from './basics'
import model from './model'
import custom from './custom'
  export default {
    components: {
      basics,
      model,
      custom
    },
    data() {
      return {
        topicRadio: '基础通信Topic',
        modelData: [{
          fn: '固件升级1',
          type: '/ota/device/inform/a10LfCPxkMs/${deviceName}',
          pess: '发布',
          des: '设备上报固件升级信息'
        },{
          fn: '固件升级2',
          type: '/ota/device/inform/a10LfCPxkMs/${deviceName}',
          pess: '发布',
          des: '设备上报固件升级信息'
        },{
          fn: '固件升级3',
          type: '/ota/device/inform/a10LfCPxkMs/${deviceName}',
          pess: '发布',
          des: '设备上报固件升级信息'
        }],
        basicsData: [{
          fn: '固件升级1',
          type: '/ota/device/inform/a10LfCPxkMs/${deviceName}',
          pess: '发布',
          des: '设备上报固件升级信息'
        },{
          fn: '固件升级2',
          type: '/ota/device/inform/a10LfCPxkMs/${deviceName}',
          pess: '发布',
          des: '设备上报固件升级信息'
        },{
          fn: '固件升级3',
          type: '/ota/device/inform/a10LfCPxkMs/${deviceName}',
          pess: '发布',
          des: '设备上报固件升级信息'
        },{
          fn: '固件升级4',
          type: '/ota/device/inform/a10LfCPxkMs/${deviceName}',
          pess: '发布',
          des: '设备上报固件升级信息'
        },{
          fn: '固件升级5',
          type: '/ota/device/inform/a10LfCPxkMs/${deviceName}',
          pess: '发布',
          des: '设备上报固件升级信息'
        }]
      };
    },
    methods: {
      
    }
  };
</script>