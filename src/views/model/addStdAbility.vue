<template>
  <el-dialog
    :visible.sync="dialogVisible"
    class="dialogVisibleDialog"
    title="添加标准功能"
    @close="close"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div class="con df ai_c" v-loading="loading">
      <div class="pr" style="width: 45%">
        <div class="f12 mb5">选择功能</div>
        <div class="con-item">
          <el-radio-group v-model="type" @change="handleChange">
            <el-radio-button label="1">自定义品类</el-radio-button>
            <el-radio-button label="2">其他类型</el-radio-button>
          </el-radio-group>
          <el-input
            v-model="name"
            placeholder="请输入功能名称"
            suffix-icon="el-icon-search"
            @keyup.enter.native="handleChange"
            :clearable="name ? true : false"
          ></el-input>
          <div
            v-for="(item, index) in list"
            :key="index"
            class="con-item-ability wp100 df ai_c hand"
            @click.stop="selectAbility(item)"
            :class="identifiers.indexOf(item.identifier) > -1 ? 'dn' : ''"
          >
            <div class="w20 blue mr5 b f18">
              <i class="el-icon-check" :class="selelectIds.indexOf(item.id) > -1 ? '' : 'vh'"></i>
            </div>
            <div class="pr wp100">
              <div>
                {{ item.name }}
                <span
                  class="tag dib blue ml10"
                  :class="`tag${item.type}`"
                >{{ abilityTypeObj[item.type] }}</span>
              </div>
              <div
                class="f12 c9 mt5 ellipsis"
                style="width: calc(100% - 40px)"
              >标识符： {{ item.identifier }} 所属品类： {{ item.categoryName }}</div>
            </div>
          </div>
          <div v-if="list.length == 0" class="tc f12" style="margin-top: 100px">
            <svg-icon icon-class="empty1" class="empty"></svg-icon>
            <div>无符合功能</div>
          </div>
        </div>
      </div>
      <div class="df p20 fd_c">
        <el-tag type="info" effect="plain" class="mb10">
          <i class="el-icon-arrow-right"></i>
        </el-tag>
        <el-tag type="info" effect="plain">
          <i class="el-icon-arrow-left"></i>
        </el-tag>
      </div>
      <div class="pr" style="width: 45%">
        <div class="mb5">
          <span class="f12">已选功能</span>
          <el-link type="primary" class="f12 fr" @click.stop="deleteAbility()">全选删除</el-link>
        </div>
        <div class="con-item">
          <div
            v-for="(item, index) in selelectList"
            :key="index"
            class="con-item-ability wp100 df ai_c"
          >
            <div class="pr wp80 flex1">
              <div>
                {{ item.name }}
                <span
                  class="tag dib blue ml10"
                  :class="`tag${item.type}`"
                >{{ abilityTypeObj[item.type] }}</span>
              </div>
              <div
                class="f12 c9 mt5 ellipsis"
                style="width: calc(100% - 40px)"
              >标识符： {{ item.identifier }} 所属品类： {{ item.categoryName }}</div>
            </div>
            <div class="w20 mr5 b f18" @click.stop="deleteAbility(index)">
              <i class="el-icon-close"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tr">
      <el-button
        type="primary"
        size="mini"
        :disabled="selelectList.length == 0 || loading"
        @click.stop="handleSave"
      >确定</el-button>
      <el-button size="mini" @click.stop="close" :disabled="loading">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addStdAbility, baseModelList } from '@/api/model'

import { abilityTypeObj } from '@/data/constants'

export default {
  props: {
    productKey: {
      type: String,
      default: ''
    },
    identifiers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: true,
      loading: false,
      type: '1',
      name: '',
      list: [],
      submitObj: {
        productKey: ''
      },
      baseModelIds: {
        propertyIds: [],
        serviceIds: [],
        eventIds: []
      },
      selelectList: [],
      selelectIds: [],
      abilityTypeObj
    }
  },
  watch: {
    name(newVal) {
      if (newVal === '') {
        this.handleChange()
      }
    }
  },
  mounted() {
    this.submitObj.productKey = this.productKey
    this.handleChange()
  },
  methods: {
    close() {
      this.$emit('close')
    },
    selectAbility(row) {
      if (this.selelectIds.indexOf(row.id) > -1) {
        return
      } else {
        this.selelectList.push(row)
        this.selelectIds.push(row.id)
      }
    },
    deleteAbility(index) {
      if (index === 0 || index) {
        this.selelectList.splice(index, 1)
        this.selelectIds.splice(index, 1)
      } else {
        this.selelectList = []
        this.selelectIds = []
      }
    },
    handleChange() {
      if (this.type === '1') {
        this.list = []
      } else {
        this.getData()
      }
    },
    getData() {
      this.list = []
      this.loading = true
      baseModelList({
        name: this.name
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.$message.error('列表获取失败')
      })
    },
    handleSave() {
      this.selelectList.forEach(item => {
        if (item.type === '1') {
          this.baseModelIds.propertyIds.push(item.id)
        } else if (item.type === '2') {
          this.baseModelIds.serviceIds.push(item.id)
        } else if (item.type === '3') {
          this.baseModelIds.eventIds.push(item.id)
        }
      })
      this.submitObj.baseModelIds = JSON.stringify(this.selelectIds)
      this.loading = true
      addStdAbility(this.submitObj).then(res => {
        if (res.code === 200) {
          this.$message.success('功能添加成功')
          this.$emit('success')
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.$message.error('标准功能添加失败')
      })
    }
  }
}
</script>

<style lang="scss">
.dialogVisibleDialog {
  .el-dialog__body {
    padding: 0 20px 20px;
  }
  .con {
    height: 370px;
    width: 100%;
    .svg-icon {
      width: 50px;
      height: 50px;
    }
    .con-item {
      height: 300px;
      border: 1px solid #d7d8d9;
      padding: 12px 16px;
      overflow-y: auto;
      .tag {
        border: 1px solid;
        min-width: 40px;
        height: 16px;
        font-size: 12px;
        text-align: center;
        line-height: 16px;
        display: inline-block;
        border-radius: 14px;
      }
      .tag1 {
        color: #1890ff;
        border-color: #1890ff;
      }
      .tag3 {
        color: #44cb42;
        border-color: #44cb42;
      }
      .tag2 {
        color: #ff8a00;
        border-color: #ff8a00;
      }
      .el-radio-group {
        width: 100%;
        margin-bottom: 5px;
        .el-radio-button {
          width: 50%;
          position: relative;
          .el-radio-button__inner {
            width: 100%;
          }
        }
      }
      .con-item-ability {
        padding: 8px 0;
      }
    }
  }
}
</style>
