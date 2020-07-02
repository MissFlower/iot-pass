<template>
  <el-dialog :visible.sync="dialogVisible" class="checkDialog" title="查看物模型" width="400px" @close="close" v-loading="loading">
    <div class="json_item lh16">
      物模型是对设备在云端的功能描述，包括设备的属性、服务和事件。物联网平台通过定义一种物的描述语言来描述物模型，称之为 TSL（即Thing Specification Language），采用JSON格式，您可以根据TSL组装上报设备的数据。您可以导出完整物模型，用于云端应用开发；您也可以只导出精简物模型，配合设备端SDK实现设备开发。
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="完整物模型" name="1">
      </el-tab-pane>
      <el-tab-pane label="精简模型" name="2">
      </el-tab-pane>
    </el-tabs>
    <editor
      class="ace-github"
      v-model="content"
      @init="editorInit"
      :options="options"
      lang="json"
      width="100%"
      height="200"
    ></editor>
    <div slot="footer">
      <el-button type="primary" @click="handleImport">导出物模型</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getModel } from '@/api/model'
export default {
  components: {
    editor: require('vue2-ace-editor')
  },
  props: ['productKey'],
  data () {
    return {
      dialogVisible: true,
      formData: {
        product: '',
        version: ''
      },
      productList: [],
      src: '',
      activeName: '1',
      JsonData: {
        'code': 200,
        'message': 'succeed !',
        'data': [
          {
            'uuid': '76254DDB-A8EA-46CB-B3D7-6EEBD13BB2E6',
            'version': 1,
            'code': '401',
            'message': '请求无权限',
            'createId': 'dev',
            'createDate': '2018-12-03T00:00:00',
            'modifyId': null,
            'modifyDate': null
          },
          {
            'uuid': 'B0415CC2-F0E0-4B0C-A3BA-50ABAEE98BB9',
            'version': 1,
            'code': '500',
            'message': '服务器错误',
            'createId': 'dev',
            'createDate': '2018-12-03T00:00:00',
            'modifyId': null,
            'modifyDate': null
          },
          {
            'uuid': 'B70692E0-CCB7-4C44-B59B-7B75B16FA9FE',
            'version': 1,
            'code': '200',
            'message': '请求成功',
            'createId': 'dev',
            'createDate': '2018-12-03T15:06:54.717',
            'modifyId': null,
            'modifyDate': null
          },
          {
            'uuid': 'C8A37C2D-0842-423B-AEBA-976C106A3E90',
            'version': 1,
            'code': '202',
            'message': '请求失败',
            'createId': 'dev',
            'createDate': '2018-12-03T00:00:00',
            'modifyId': null,
            'modifyDate': null
          }
        ]
      },
      content: '', // json转化用这个，直接使用JSON.stringify(data)表现的只有一行
      options: {
        // 编辑框的一些配置
        /* vue2-ace-editor编辑器配置自动补全等 */
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true /* 自动补全 */,
        readOnly: true,
        showPrintMargin: false // 去除编辑器里的竖线
      },
      loading: false
    }
  },
  mounted () {
    this.content = JSON.stringify(this.JsonData, null, '\t')
    this.handleClick()
  },
  methods: {
    getData () {
      this.content = ''
      this.loading = true
      getModel({
        productKey: this.productKey
      }).then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.content = JSON.stringify(res.data, null, '\t')
          } else {
            this.$message.error(res.message)
          }
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.$message.error('物模型获取失败')
      })
    },
    close () {
      this.$emit('close')
    },
    handleClick () {
      if (this.activeName === '1') {
        this.getData()
      } else {
        this.content = ''
      }
    },
    handleImport () {},
    editorInit: function () {
      require('brace/ext/language_tools')
      require('brace')
      require('brace/mode/json')
      require('brace/snippets/json')
      require('brace/snippets/html')
    }
  }
}
</script>

<style lang="scss">
.checkDialog {
  .el-dialog__body {
    padding: 0 20px;
    .json_item {
      background-color: #FBFBFC!important;
      border: 1px solid #ECEDEE;
      padding: 10px!important;
    }
  }
  .el-tabs__header {
    margin: 0;
  }
  .ace-github {
    // border: 1px solid red;
  }
}
</style>

