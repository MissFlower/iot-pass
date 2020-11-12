<!--
 * @Description: 设备日志
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2020-11-09 18:25:36
 * @LastEditors: AiDongYang
<<<<<<< HEAD
 * @LastEditTime: 2020-11-12 15:09:58
=======
 * @LastEditTime: 2020-11-12 13:56:09
>>>>>>> bb56b3e025bce7f15c73dabd260f8d232b82911a
-->
<template>
  <div>
    <ElButton type="primary" class="upload-order" @click="uploadOrder">上传指令</ElButton>
    <ElTable :data="tableList" border>
      <ElTableColumn prop="createTime" label="时间" min-width="150" />

      <ElTableColumn prop="remark" label="备注" min-width="300" />

      <ElTableColumn prop="operation" label="操作" width="150">
        <template slot-scope="{row}">
          <ElLink :underline="false" type="primary" @click="download(row.id)">下载</ElLink>
        </template>
      </ElTableColumn>

      <div slot="empty" class="defalut-graph-box">
        <DeafultGraph icon-class="empty" text="暂无数据" />
      </div>
    </ElTable>
    <!-- 分页-->
    <Pagination :data="tableData" @pagination="changePage" class="tr" />

    <ElDialog
      title="上传指令"
      :visible.sync="dialogVisible"
      width="480px"
    >
      <ElForm ref="form" :model="form" :rules="rules">
        <ElFormItem label="备注" prop="remark">
          <ElInput type="text" v-model="form.remark" placeholder="请输入备注" show-word-limit maxlength="20" />
        </ElFormItem>
        <ElFormItem label="文件名" prop="fileName">
          <ElInput type="text" v-model="form.fileName" placeholder="请输入文件名" show-word-limit maxlength="20" />
        </ElFormItem>
      </ElForm>
      <span slot="footer">
        <ElButton @click="close">取 消</ElButton>
        <ElButton type="primary" @click="issueOrder">下发指令</ElButton>
      </span>
    </ElDialog>
  </div>
</template>
<script>
import DeafultGraph from 'src/components/DeafultGraph'
import Pagination from 'src/components/Pagination'
import { uploadInstruct, downloadPath, localLogList } from 'src/api/deviceRequest'
export default {
  name: 'DeviceLog',
  components: {
    DeafultGraph,
    Pagination
  },
  props: {
    deviceObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tableList: [],
      dialogVisible: false,
      form: {
        remark: '',
        fileName: ''
      },
      rules: {
        remark: { required: true, message: '请输入备注', trigger: ['blur', 'change'] },
        fileName: { required: true, message: '请输入文件名', trigger: ['blur', 'change'] }
      },
      tableData: {
        pageCount: 0, // 总页数
        total: 0, // 总条数
        pageSize: 10, // 一页大小
        pageNum: 1 // 第几页 从0开始
      }
    }
  },
  watch: {
    deviceObj: {
      handler() {
        this.getList()
      }
    }
  },
  methods: {
    async getList() {
      const { data } = await localLogList({
        productKey: this.deviceObj.productKey,
        deviceName: this.deviceObj.deviceName,
        pageNum: this.tableData.pageNum,
        pageSize: this.tableData.pageSize
      })
      this.tableList = data.data
      this.tableData.total = data.total
    },
    uploadOrder() {
      // 上传指令
      this.dialogVisible = true
    },
    async download(recordId) {
      // 下载
      const { data } = await downloadPath({
        recordId
      })
      window.location.href = data.filePath
    },
    issueOrder() {
      // 下发指令
      this.$refs.form.validate(async valid => {
        if (valid) {
          await uploadInstruct({
            productKey: this.deviceObj.productKey,
            deviceName: this.deviceObj.deviceName,
            ...this.form
          })
          this.tableData.pageNum = 1
          this.getList()
          this.$refs.form.resetFields()
          this.dialogVisible = false
        }
      })
    },
    close() {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    changePage() {
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-order {
  margin-bottom: 16px;
}
.defalut-graph-box {
  display: flex;
  justify-content: center;
  padding: 50px 0;
}

</style>
