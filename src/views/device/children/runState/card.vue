<!--
 * @Description: 运行状态卡片组件
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-07-31 15:42:42
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-04 15:00:51
-->
<template>
  <div class="card-container">
    <ElCard class="box-card">
      <div slot="header" class="clearfix">
        <span class="f14">{{ `卡片名称` }}</span>
        <ElButton type="text" class="f12 view-data-button" @click="viewDataHandler">查看数据</ElButton>
      </div>
      <div>
        <div class="f18 card-unit">
          <span class="card-unit-text">
            --uS/cm
            <ElTooltip
              content="期望值--"
              placement="top"
              effect="light"
              popper-class="custom-tooltip-style"
            >
              <i class="el-icon-info card-icon" />
            </ElTooltip>
          </span>
        </div>
        <div class="f14 card-value">--</div>
      </div>
    </ElCard>
  </div>
</template>

<script>
export default {
  name: 'RunStateCard',
  data() {
    return {}
  },
  methods: {
    viewDataHandler() {
      this.$parent.runStateDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  width: calc(25% - 12px);
  margin-right: 16px;
  margin-bottom: 16px;
  &:nth-child(4n) {
    margin-right: 0;
  }

  .view-data-button {
    float: right;
    margin-top: -7px;
  }

  .card-unit {
    color: #333;
    height: 24px;
    line-height: 24px;
    margin-bottom: 12px;

    .card-unit-text {
      position: relative;

      .card-icon {
        font-size: 12px;
        color: #ccc;
        position: absolute;
        right: -14px;
        top: 4px;
        cursor: pointer;

        &:hover {
          color: #555;
        }
      }
    }
  }

  .card-value {
    color: #999;
  }
}
/deep/ .el-card__header {
  padding: 8px 16px;
}
</style>
<style>
.custom-tooltip-style.is-light {
  border: 1px solid #999;
}
</style>
