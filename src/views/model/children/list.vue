<template>
  <div class="modelList">
    <el-table :data="list" border>
      <div slot="empty" class="mt30 mb20 df jc_c">
        <svg-icon icon-class="empty" class="empty"></svg-icon>
        <div class="lh16 w300 tl ml20">
          <div class="b">尚未添加任何功能</div>
          <div class="c9 f12 mt10">您可以通过添加属性、事件、服务三类功能完成产品物模型的定义，产品下的设备都会继承该模型。</div>
          <div class="mt20">
            <el-button type="primary" size="mini">编辑草稿</el-button>
            <el-button size="mini">了解更多</el-button>
          </div>
        </div>
      </div>
      <el-table-column label="功能类型">
        <template slot-scope="scope">
          {{abilityTypeObj[scope.row.abilityType]}}
        </template>
      </el-table-column>
      <el-table-column prop="name">
        <span slot="header">
          功能名称（{{type ? `${typeObj[type]}` : '全部'}}）
          <!-- <el-popover
            placement="bottom"
            width="100"
            trigger="click"
            @show="selectType = type"
            >
            <div class="conHeader">
              <div @click.stop="setSelectType('')">
                <i class="mr10 blue dib w20" :class="selectType == '' ? 'el-icon-check' : ''"></i>
                <span>全部</span>
              </div>
              <div v-for="(item, key) in typeObj" :key="key" @click.stop="setSelectType(key)">
                <i class="mr10 blue dib w20" :class="selectType == key ? 'el-icon-check' : ''"></i>
                <span>{{item}}{{selectType}}</span>
              </div>
              <div class="mt10 tc">
                <el-button type="primary" size="mini" @click="setSelectTypeConfrim">确认</el-button>
                <el-button size="mini" @click="resetSelectType">重置</el-button>
              </div>
            </div>
            <svg-icon icon-class="screen" slot="reference"></svg-icon>
          </el-popover> -->
        </span>
        <template slot-scope="scope">
          {{scope.row.name}}
          <el-tag>{{typeObj[scope.row.type]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标识符" prop="identifier"></el-table-column>
      <el-table-column label="数据类型">
        <template slot-scope="scope">
          {{scope.row.dataType ? dataTypeTextObj[scope.row.dataType.type] : ''}}
        </template>
      </el-table-column>
      <el-table-column label="数据定义">
        <template slot-scope="scope">
          <div class="ellipsis">{{scope.row.dataType ? scope.row.dataType.specs : ''}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" align="center">
        <template slot-scope="scope">
          <el-link :underline="false" type="primary" class="f12" @click="handleShowAdd(scope.row)">编辑</el-link>
          <el-link :underline="false" type="primary" class="f12" @click="showDelete(scope.row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: ['list'],
  methods: {
    handleShowAdd (row) {
      this.$emit('showAdd', row)
    },
    showDelete (row) {
      this.$emit('showDelete', row)
    }
  }
}
</script>