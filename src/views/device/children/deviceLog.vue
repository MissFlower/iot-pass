<!--
 * @Description: 设备日志
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2020-11-09 18:25:36
 * @LastEditors: AiDongYang
-->
<template>
  <div>
    <div class="top-btn">
      <ElButton type="primary" class="upload-order" @click="uploadOrder">上传指令</ElButton>
      <ElTooltip
        content="刷新"
        placement="top"
        effect="light"
        popper-class="custom-tooltip-style"
        class="refresh-icon"
      >
        <i class="el-icon-refresh-right" @click="getList" />
      </ElTooltip>
    </div>
    <ElTable :data="tableList" border>
      <ElTableColumn prop="createTime" label="时间" min-width="150" />

      <ElTableColumn prop="remark" label="备注" min-width="300" />

      <ElTableColumn prop="operation" label="操作" width="150">
        <template slot-scope="{row}">
          <ElLink :underline="false" type="primary" @click="download(row.id)">下载</ElLink>
        </template>
      </ElTableColumn>

      <div slot="empty" v-loading="loading" class="defalut-graph-box">
        <DeafultGraph icon-class="empty" text="暂无数据" />
      </div>
    </ElTable>
    <!-- 分页-->
    <Pagination :data="tableData" @pagination="changePage" class="tr" />

    <ElDialog
      title="上传指令"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="480px"
      @close="close"
    >
      <ElForm ref="form" :model="form" :rules="rules">
        <ElFormItem label="备注" prop="remark">
          <ElInput type="text" v-model="form.remark" placeholder="请输入备注" show-word-limit maxlength="20" />
        </ElFormItem>
        <ElFormItem label="文件名" prop="fileName">
          <ElInput type="text" v-model="form.fileName" placeholder="请输入文件名" show-word-limit maxlength="20" />
        </ElFormItem>
      </ElForm>
      <span class="tips-info">Tips：指令下发成功后，请耐心等待几分钟，刷新表格查看</span>
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
import { deepFreeze } from '@/utils'
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
      },
      loading: false
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
      this.loading = true
      const { data } = await localLogList({
        productKey: this.deviceObj.productKey,
        deviceName: this.deviceObj.deviceName,
        pageNum: this.tableData.pageNum,
        pageSize: this.tableData.pageSize
      })
      this.loading = false
      this.tableList = deepFreeze(data.data)
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
          const { code, message } = await uploadInstruct({
            productKey: this.deviceObj.productKey,
            deviceName: this.deviceObj.deviceName,
            ...this.form
          })
          this.$message({
            type: code === 200 ? 'success' : 'warning',
            message
          })
          if (code === 200) {
            this.tableData.pageNum = 1
            this.getList()
            this.$refs.form.resetFields()
            this.dialogVisible = false
          }
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
.top-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tips-info {
  font-size: 12px;
  color: #666;
  cursor: default;
}
.refresh-icon {
  width: 32px;
  height: 32px;
  border: 1px solid #dcdfe6;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgb(136, 136, 136);
  transition: all ease-out 0.3s;

  &:hover {
    border-color: #737373;
  }
}
</style>
