<!-- 
文件作者：mawenjuan
创建日期：2020.6.28
文件说明：功能定义页面
 -->

<template>
  <div id="model" v-loading="loading">
    <div class="f20 p10">
      <i class="el-icon-back hand" @click="goBack"></i><span style="margin-left:15px">编辑草稿</span>
    </div>
    <div class="f12 c9 df mt10 mb10">
      <!-- <div class="flex1 df ai_c">
        <div class="w120">产品名称</div>
        <div>ceshi</div>
      </div> -->
      <div class="flex1 df ai_c">
        <div class="w120">productKey</div>
        <div>{{productKey}}</div>
      </div>
    </div>
    <div class="mb10">
      <el-button type="primary" size="mini" @click="handleShowAddStdAbility">添加标准功能</el-button>
      <el-button size="mini" @click="handleShowAdd()">添加自定义功能</el-button>
      <el-button size="mini" @click="showImport" disabled>快速导入</el-button>
      <el-button size="mini" @click="showCheck">物模型 TSL</el-button>
      <el-button size="mini" disabled>历史版本</el-button>
      <div v-if="!loading" class="info df ai_c mb5 mt10 c9">
        <i class="el-icon-warning blue mr5"></i>
        您正在编辑的是草稿，需点击发布后，物模型才会正式生效
      </div>
    </div>
    <model-list ref="modelList" v-if="productKey" :productKey="productKey" :dataFun="dataFun">
      <el-table-column label="操作" width="90" align="center" slot="operation">
        <template slot-scope="scope">
          <el-link :underline="false" type="primary" class="f12" @click="handleShowAdd(scope.row)">编辑</el-link>
          <el-link :underline="false" type="primary" class="f12" @click="showDelete(scope.row)">删除</el-link>
        </template>
      </el-table-column>
    </model-list>
    <add-custom-ability v-if="addFlag" :productKey="productKey" :editAbility="editAbility" @close="closeAddCustomAbility" @success="successAddCustomAbility"></add-custom-ability>
    <add-std-ability v-if="addStdAbilityFlag" :productKey="productKey" :identifiers="identifiers" @close="closeAddStdAbility" @success="successAtdAbility"></add-std-ability>
    <import-ability v-if="importFlag" @close="closeImport"></import-ability>
    <check-model v-if="checkFlag" :productKey='productKey' @close="closeCheck"></check-model>
  </div>
</template>

<script>
import { getModelByproductKey, deleteAbility } from '@/api/model'
import addCustomAbility from './addCustomAbility'
import addStdAbility from './addStdAbility'
import importAbility from './importAbility'
import checkModel from './checkModel'
import modelList from './children/list'

export default {
  components: {addCustomAbility, addStdAbility, importAbility, checkModel, modelList},
  data () {
    return {
      loading: false,
      addFlag: false,
      productKey: '',
      dataFun: getModelByproductKey,
      editAbility: null,
      addStdAbilityFlag: false,
      importFlag: false,
      checkFlag: false,
      identifiers: []
    }
  },
  mounted () {
    if (this.$route.query.key) {
      this.productKey = this.$route.query.key
    }
  },
  methods: {
    // 添加自定义功能、编辑功能
    handleShowAdd (row) {
      if (row) {
        this.editAbility = JSON.parse(JSON.stringify(row))
      } else {
        this.editAbility = null
      }
      this.addFlag = true
    },
    successAddCustomAbility () {
      this.closeAddCustomAbility()
      this.$refs.modelList.getData()
    },
    closeAddCustomAbility () {
      this.addFlag = false
      this.editAbility = null
    },
    // 添加标准功能
    handleShowAddStdAbility () {
      this.identifiers = this.$refs.modelList.identifiers
      this.addStdAbilityFlag = true
    },
    // 返回上级
    goBack () {
      this.$router.push({path: `/product/detail/${this.productKey}?activetab=second`})
    },
    showDelete (row) {
      const str = "确认删除该功能吗？";
      this.$confirm(str, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          deleteAbility({
            productKey: this.productKey,
            abilityType: row.abilityType,
            identifier: row.identifier
          })
            .then(res => {
              if (res.code === 200) {
                this.$message.success("功能删除成功");
                this.$refs.modelList.getData();
              } else {
                this.$message.error(res.message);
              }
              this.loading = false;
            })
            .catch(() => {
              this.$message.error("功能删除失败");
              this.loading = false;
            });
        })
        .catch(() => {
          this.$message("操作已取消");
        });
    },
    // 关闭添加标准功能的回调
    closeAddStdAbility () {
      this.addStdAbilityFlag = false
    },
    // 添加标准功能成功的回调
    successAtdAbility () {
      this.closeAddStdAbility()
      this.$refs.modelList.getData()
    },
    // 导入弹框展示
    showImport () {
      this.importFlag = true
    },
    // 导入弹框的关闭回调
    closeImport () {
      this.importFlag = false
    },
    // 查看弹框展示
    showCheck () {
      this.checkFlag = true
    },
    // 查看弹框关闭回调
    closeCheck () {
      this.checkFlag = false
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
  .conHeader {
      width: 180px;
      position: absolute;
      border: 1px solid #efefef;
      top: 0px;
      z-index: 1;
    }
  .header-popover {
    color: red;
    .conHeader {
      width: 180px;
      position: absolute;
      border: 1px solid #efefef;
      top: 0px;
      z-index: 1;
    }
  }
}
</style>
