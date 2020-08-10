<template>
  <div class="pb20">
    <el-radio-group v-model="topicRadio">
      <el-radio-button label="基础通信Topic"></el-radio-button>
      <el-radio-button label="物模型通信Topic"></el-radio-button>
      <el-radio-button label="自定义Topic"></el-radio-button>
    </el-radio-group>

    <div v-show="topicRadio === '基础通信Topic'">
      <basics :basicsData="basicsData" />
    </div>

    <div v-show="topicRadio === '物模型通信Topic'">
      <model :modelData="modelData" />
    </div>

    <div v-show="topicRadio === '自定义Topic'">
      <custom :customObj="customObj" />
    </div>
  </div>
</template>

<script>
import basics from './basics'
import model from './model'
import custom from './custom'
import { topicList } from '@/api/deviceRequest'
export default {
  components: {
    basics,
    model,
    custom
  },
  props: {
    deviceObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      topicRadio: '基础通信Topic',
      basicsData: [],
      modelData: [],
      customObj: {}
    }
  },
  watch: {
    deviceObj(obj) {
      topicList({ id: obj.id }).then(res => {
        if (res.code === 200) {
          this.basicsData = res.data.base_communication_topic
          this.modelData = res.data.model_communication_topic
        }
      }).catch(() => {})
      this.customObj = {
        productKey: this.deviceObj.productKey,
        deviceName: this.deviceObj.deviceName
      }
    }
  },
  methods: {

  }
}
</script>
