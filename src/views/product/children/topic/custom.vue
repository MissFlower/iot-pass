<template>
  <div v-loading="loading">
    <div class="mt20 f14" v-if="!productStatus">
      <el-button type="primary" @click="customDialog">定义Topic类</el-button>
    </div>
    <el-table
      :data="customData"
      class="mt10 wp100"
      :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
    >
      <el-table-column prop="name" label="自定义topic">
        <!-- <template slot-scope="scope">{{ scope.row.name }}</template> -->
      </el-table-column>

      <el-table-column label="操作权限" width="100">
        <template
          slot-scope="scope"
        >{{ scope.row.access === 1 ? '订阅' : (scope.row.access === 2 ? '发布' : '发布和订阅') }}</template>
      </el-table-column>
      <el-table-column prop="qos" label="QOS"></el-table-column>

      <el-table-column prop="remark" label="描述"></el-table-column>

      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="editTopic(scope.row)" class="mr20">编辑</el-button>
          <el-popconfirm title="确定要删除Topic类吗？" @onConfirm="deleteTopic(scope.row.id)">
            <el-button type="text" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页-->
    <pagination :data="tableData" @pagination="changePage" class="tr" />
    <!-- 定义or编辑 topic -->
    <el-dialog title="定义Topic类" :visible.sync="dialogFormVisible">
      <el-form ref="customDialog" :model="customForm" label-position="top" :rules="customRules">
        <el-form-item label="设备操作权限" prop="access">
          <el-select
            v-model="customForm.access"
            style="width:100%"
            @change="topicAccessChange"
          >
            <el-option label="订阅" :value="1"></el-option>
            <el-option label="发布" :value="2"></el-option>
            <el-option label="发布和订阅" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Topic类" prop="name">
          <div>/{{ productKey }}/${deviceName}/user/</div>
          <el-input v-model="customForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="QOS" prop="qos">
          <el-input v-model="customForm.qos" class="wp100" disabled></el-input>
          <!-- <el-select v-model="customForm.qos" class="wp100" disabled>
            <el-option v-for="(item, key) in TopicQos" :key="key" :value="key" :label="key" ></el-option>
          </el-select> -->
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="customForm.remark"
            autocomplete="off"
            type="textarea"
            rows="5"
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomForm('customDialog')">取 消</el-button>
        <el-button type="primary" @click="submitTopic" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { productCustomEdit, productDelete, customList } from '@/api/product'
import Pagination from '@/components/Pagination'

// import { TopicQos } from '@/data/constants'
export default {
  components: {
    Pagination
  },
  props: {
    productStatus: {
      type: Number,
      default: 0
    }
  },
  data() {
    var accessFlag = true
    var validateName = (rule, value, callback) => {
      var res1 = /^[/]|[/]$/g
      var res2 = /^[\w/]{1,64}$/
      accessFlag = true
      if (value.indexOf('//') !== -1) {
        accessFlag = false
      }
      if (this.customForm.access === 1) {
        res2 = /^[\w/+#]{1,64}$/
        const sy = value.indexOf('#')
        if (sy >= 0) {
          const sy_ct1 =
            value.charAt(sy - 1) === '' || value.charAt(sy - 1) === '/'
          const sy_ct2 = value.charAt(sy + 1) === ''
          if (!sy_ct1 || !sy_ct2) {
            accessFlag = false
          }
        }

        for (let i = 0; i < value.length; i++) {
          if (value[i] === '+') {
            if (value[i - 1] && value[i - 1] !== '/') {
              accessFlag = false
              break
            }
            if (value[i + 1] && value[i + 1] !== '/') {
              accessFlag = false
              break
            }
          }
        }
      }
      if (value === '') {
        callback(new Error('请输入您的Topic类名'))
      } else if (res1.test(value)) {
        callback(
          new Error(
            'Topic类名用/分割，支持英文字母、数字、下划线、+和#（仅权限是订阅时支持），长度限制64'
          )
        )
      } else if (!res2.test(value)) {
        callback(
          new Error(
            'Topic类名用/分割，支持英文字母、数字、下划线、+和#（仅权限是订阅时支持），长度限制64'
          )
        )
      } else if (!accessFlag) {
        callback(
          new Error(
            'Topic类名用/分割，支持英文字母、数字、下划线、+和#（仅权限是订阅时支持），长度限制64'
          )
        )
      } else {
        callback()
      }
    }
    return {
      loading: false,
      submitTopicId: '',
      dialogFormVisible: false,
      productKey: this.$route.params.key,
      customForm: {
        access: 1,
        name: '',
        qos: '0',
        remark: ''
      },
      customData: [],
      customRules: {
        access: [
          { required: true, message: '请选择设备操作权限', trigger: 'change' }
        ],
        name: [
          { required: true, validator: validateName, trigger: 'change' }
        ],
        qos: [
          { required: true, message: '请选择QOS', trigger: 'change' }
        ]
      },
      tableData: {
        pageCount: 0, // 总页数
        total: 0, // 总条数
        pageSize: 10, // 一页大小
        pageNum: 1 // 第几页 从0开始
      }
    }
  },
  created() {
    this.customList()
  },
  methods: {
    // 选择设备操作权限
    topicAccessChange() {
      this.$refs['customDialog'].validateField('name')
    },
    // 编辑topic
    editTopic(row) {
      this.dialogFormVisible = true
      this.customForm.access = row.access
      let arr = row.name.split('/')
      const index = arr.indexOf('user')
      arr = arr.splice(index + 1, arr.length - index - 1)
      this.customForm.name = arr.join('/')
      this.customForm.remark = row.remark || ''
      this.submitTopicId = row.id
    },
    // 定义topic
    customDialog() {
      this.dialogFormVisible = true
      this.submitTopicId = ''
      this.customForm = {
        access: 1,
        name: '',
        remark: '',
        qos: '0'
      }
      setTimeout(() => {
        this.$refs['customDialog'].clearValidate()
      })
    },
    // 取消自定义弹窗
    cancelCustomForm(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    // 删除topic
    deleteTopic(topicId) {
      productDelete({ topicId, productKey: this.productKey })
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.customList()
          }
        })
        .catch(() => {})
    },
    // 列表数据
    customList() {
      this.loading = true
      customList(Object.assign(this.tableData, { productKey: this.productKey }))
        .then(res => {
          this.loading = false
          if (res.code === 200) {
            const { data, ...pagination } = res.data
            this.tableData = pagination
            this.customData = data
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 自定义topic新增、编辑
    submitTopic(id) {
      var obj = {}
      if (this.submitTopicId) {
        obj = Object.assign({}, obj, { id: this.submitTopicId })
      }

      this.$refs['customDialog'].validate(valid => {
        if (valid) {
          this.loading = true
          productCustomEdit(
            Object.assign(
              {},
              obj,
              { productKey: this.productKey },
              this.customForm
            )
          )
            .then(res => {
              this.loading = false
              if (res.code === 200) {
                this.customList()
                this.dialogFormVisible = false
              } else {
                this.$message.warning(res.message)
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error(err)
            })
        } else {
          return false
        }
      })
    },
    // 分页
    changePage() {
      this.customList()
    }
  }
}
</script>
