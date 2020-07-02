<template>
  <el-dialog :visible.sync="dialogVisible" class="dialogVisibleDialog" title="添加标准功能" @close="close">
    <div class="con df ai_c">
      <div class="pr" style="width: 45%">
        <div class="f12 mb5">选择功能</div>
        <div class="con-item">
          <el-radio-group v-model="type">
            <el-radio-button label="自定义品类"></el-radio-button>
            <el-radio-button label="其他类型"></el-radio-button>
          </el-radio-group>
          <el-input placeholder="请输入功能名称" suffix-icon="el-icon-search"></el-input>
          <div v-for="(item, index) in list" :key="index" class="con-item-ability wp100 df ai_c hand" @click.stop="selectAbility(item)">
            <div class="w20 blue mr5 b f18"><i class="el-icon-check" :class="selelectIds.indexOf(item.id) > -1 ? '' : 'vh'"></i></div>
            <div class="pr wp100">
              <div>{{item.name}}<span class="dib blue f12">{{item.type}}</span></div>
              <div class="f12 c9 mt5 ellipsis" style="width: calc(100% - 40px)">标识符： {{item.ids}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="df p20 fd_c">
        <el-tag type="info" effect="plain" class="mb10"><i class="el-icon-arrow-right"></i></el-tag>
        <el-tag type="info" effect="plain"><i class="el-icon-arrow-left"></i></el-tag>
      </div>
      <div class="pr" style="width: 45%">
        <div class="mb5">
          <span class="f12">已选功能</span>
          <el-link type="primary" class="f12 fr" @click.stop="deleteAbility()">全选删除</el-link>
        </div>
        <div class="con-item">
          <div v-for="(item, index) in selelectList" :key="index" class="con-item-ability wp100 df ai_c">
            <div class="pr wp80 flex1">
              <div>{{item.name}}<span class="dib blue f12">{{item.type}}</span></div>
              <div class="f12 c9 mt5 ellipsis" style="width: calc(100% - 40px)">标识符： {{item.ids}}</div>
            </div>
            <div class="w20 mr5 b f18" @click.stop="deleteAbility(index)"><i class="el-icon-close"></i></div>
          </div>
        </div>
      </div>
    </div>
    <div class="tr">
      <el-button type="primary" size="mini" :disabled="selelectList.length == 0" @click.stop="handleSave">确定</el-button>
      <el-button size="mini" @click.stop="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addStdAbility } from "@/api/model"

export default {
  props: ['productKey'],
  data () {
    return {
      dialogVisible: true,
      type: '',
      list: [
        {
          name: 'ceshi',
          id: 'ceshi',
          type: '1',
          ids: ['sad', 'dsaa1213213431233333333333333333333333333333333333']
        }, {
          name: 'ceshi1',
          id: 'ceshi1',
          type: '1',
          ids: ['sad', 'dsaa']
        }, {
          name: 'ceshi',
          id: 'ceshi2',
          type: '1',
          ids: ['sad', 'dsaa111111111111111sddddddddddddddddddddddd']
        }
      ],
      submitObj: {
        productKey: '',
        propertyIds: [],
        serviceIds: [],
        eventIds: []
      },
      selelectList: [],
      selelectIds: []

    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    selectAbility (row) {
      if (this.selelectIds.indexOf(row.id) > -1) {
        return
      } else {
        this.selelectList.push(row)
        this.selelectIds.push(row.id)
      }
    },
    deleteAbility (index) {
      if (index === 0 || index) {
        this.selelectList.splice(index, 1)
        this.selelectIds.splice(index, 1)
      } else {
        this.selelectList = []
        this.selelectIds = []
      }
    },
    handleSave () {}
  }
}
</script>

<style lang="scss">
.dialogVisibleDialog {
  .con {
    height: 400px;
    width: 100%;
    .con-item {
      height: 360px;
      border: 1px solid #d7d8d9;
      padding: 12px 16px;
      overflow-y: auto;
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