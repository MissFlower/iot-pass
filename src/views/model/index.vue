<!--
文件作者：mawenjuan
创建日期：2020.6.28
文件说明：功能定义页面
 -->

<template>
  <div id="model" v-loading="loading">
    <div class="f20 p10">
      <i class="el-icon-back hand" @click.stop="goBack"></i>
      <span style="margin-left:15px">编辑草稿</span>
    </div>
    <div class="f12 c9 df mt10 mb20">
      <div class="df ai_c">
        <div class="b">产品名称：</div>
        <div>{{ productName }}</div>
      </div>
      <div class="df ai_c ml20">
        <div class="b">productKey：</div>
        <div>{{ productKey }}</div>
        <iconToolTip ref="iconToolTip" :content="`复制`" :icon="`el-icon-copy-document`" :copyStr="productKey" class="ml10"></iconToolTip>
      </div>
    </div>
    <div class="mb10">
      <el-button
        v-if="!selectHistory"
        type="primary"
        size="mini"
        @click="handleShowAddStdAbility"
      >添加标准功能</el-button>
      <el-button v-if="!selectHistory" size="mini" @click="handleShowAdd()">添加自定义功能</el-button>
      <el-button v-if="!selectHistory" size="mini" @click="showImport" disabled>快速导入</el-button>
      <el-button size="mini" @click="showCheck">物模型 TSL</el-button>
      <el-dropdown trigger="click">
        <el-button size="mini" class="ml10">
          历史版本
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu>
          <el-dropdown-item v-for="(item, index) in historyList" :key="index">
            <div @click="setSelectHistory(item.version)">
              <i
                class="mr10 blue dib w20"
                :class="selectHistory == item.version ? 'el-icon-check' : ''"
              ></i>
              <span>{{ item.version }}</span>
            </div>
          </el-dropdown-item>
          <el-dropdown-item :disabled="historyList.length == 0" :divided="historyList.length > 0" @click.native="showMoreHistory" class="tc">查看更多</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div v-if="!loading" class="info df ai_c mb5 mt10 c9">
        <i class="el-icon-warning blue mr5"></i>
        您正在编辑的是草稿，需点击发布后，物模型才会正式生效
      </div>
    </div>
    <model-list
      ref="modelList"
      v-if="productKey"
      :productKey="productKey"
      :tableHeight="tableHeight"
      :dataFun="dataFun"
      @getList="setList"
    >
      <el-table-column label="操作" width="90" align="center" slot="operation">
        <template slot-scope="scope">
          <el-link
            :underline="false"
            type="primary"
            class="f12"
            @click="handleShowAdd(scope.row)"
          >编辑</el-link>
          <el-link :underline="false" type="primary" class="f12" @click="showDelete(scope.row)">删除</el-link>
        </template>
      </el-table-column>
    </model-list>
    <div class="mt20" v-if="!selectHistory">
      <el-button type="primary" size="mini" disabled>发布上线</el-button>
      <el-button size="mini" @click="goBack">返回</el-button>
    </div>
    <div class="mt20" v-else>
      <el-button type="primary" size="mini" disabled>恢复此版本</el-button>
      <el-button size="mini" @click.stop="clearVersion">返回</el-button>
    </div>
    <add-custom-ability
      v-if="addFlag"
      :productKey="productKey"
      :editAbility="editAbility"
      @close="closeAddCustomAbility"
      @success="successAddCustomAbility"
    ></add-custom-ability>
    <add-std-ability
      v-if="addStdAbilityFlag"
      :productKey="productKey"
      :identifiers="identifiers"
      @close="closeAddStdAbility"
      @success="successAtdAbility"
    ></add-std-ability>
    <import-ability v-if="importFlag" @close="closeImport"></import-ability>
    <check-model v-if="checkFlag" :productKey="productKey" @close="closeCheck"></check-model>
    <more-list
      v-if="moreFlag"
      :list="historyList"
      :selectVersion="selectHistory"
      @selectVertion="setSelectHistory"
      @close="closeMoreList"
    ></more-list>
  </div>
</template>

<script>
import { getModelByproductKey, deleteAbility } from '@/api/model'
import addCustomAbility from './addCustomAbility'
import addStdAbility from './addStdAbility'
import importAbility from './importAbility'
import checkModel from './checkModel'
import modelList from './children/list'
import moreList from './children/historyList'
import iconToolTip from '@/components/iconToolTip'

export default {
  components: { addCustomAbility, addStdAbility, importAbility, checkModel, modelList, moreList, iconToolTip },
  data() {
    return {
      loading: false,
      list: [],
      addFlag: false,
      productKey: '',
      productName: '',
      dataFun: getModelByproductKey,
      editAbility: null,
      addStdAbilityFlag: false,
      importFlag: false,
      checkFlag: false,
      identifiers: [],
      historyList: [
        // {
        //   version: '111111111111111111111'
        // },
        // {
        //   version: '2222222'
        // },
        // {
        //   version: '3333333'
        // }
      ],
      moreFlag: false,
      selectHistory: '',
      tableHeight: window.innerHeight - 290
    }
  },
  mounted() {
    if (this.$route.query.key) {
      this.productKey = this.$route.query.key
    }
    if (this.$route.query.name) {
      this.productName = this.$route.query.name
    }
  },
  methods: {
    // list 返回函数
    setList(data) {
      this.list = data
    },
    // 添加自定义功能、编辑功能
    handleShowAdd(row) {
      if (row) {
        this.editAbility = JSON.parse(JSON.stringify(row))
      } else {
        this.editAbility = null
      }
      this.addFlag = true
    },
    successAddCustomAbility() {
      this.closeAddCustomAbility()
      this.$refs.modelList.getData()
    },
    closeAddCustomAbility() {
      this.addFlag = false
      this.editAbility = null
    },
    // 添加标准功能
    handleShowAddStdAbility() {
      this.identifiers = this.$refs.modelList.identifiers
      this.addStdAbilityFlag = true
    },
    // 返回上级
    goBack() {
      this.$router.push({ path: `/product/detail/${this.productKey}?activetab=second` })
    },
    showDelete(row) {
      const str = '确认删除该功能吗？'
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          deleteAbility({
            productKey: this.productKey,
            abilityType: row.abilityType,
            identifier: row.identifier
          })
            .then(res => {
              if (res.code === 200) {
                this.$message.success('功能删除成功')
                this.$refs.modelList.getData()
              } else {
                this.$message.error(res.message)
              }
              this.loading = false
            })
            .catch(() => {
              this.$message.error('功能删除失败')
              this.loading = false
            })
        })
        .catch(() => {
          this.$message('操作已取消')
        })
    },
    // 关闭添加标准功能的回调
    closeAddStdAbility() {
      this.addStdAbilityFlag = false
    },
    // 添加标准功能成功的回调
    successAtdAbility() {
      this.closeAddStdAbility()
      this.$refs.modelList.getData()
    },
    // 导入弹框展示
    showImport() {
      this.importFlag = true
    },
    // 导入弹框的关闭回调
    closeImport() {
      this.importFlag = false
    },
    // 查看弹框展示
    showCheck() {
      this.checkFlag = true
    },
    // 查看弹框关闭回调
    closeCheck() {
      this.checkFlag = false
    },
    // 显示更多的显示函数
    showMoreHistory() {
      this.moreFlag = true
    },
    // 历史记录的更多弹框的关闭回调
    closeMoreList() {
      this.moreFlag = false
    },
    // 选择历史版本
    setSelectHistory(version) {
      this.selectHistory = version
    },
    // 退出历史版本模式
    clearVersion() {
      this.selectHistory = ''
    }
  }
}
</script>

<style lang="scss" scoped>
#model {
  width: 100%;
  padding: 0 10px;
  .info {
    font-size: 12px;
    background-color: #e5f3ff;
    padding: 8px;
    padding-left: 16px;
    padding-right: 12px;
  }
  .el-link + .el-link {
    margin-left: 10px;
  }
}
.el-dropdown-menu--small .el-dropdown-menu__item {
  padding-left: 5px;
}
</style>
