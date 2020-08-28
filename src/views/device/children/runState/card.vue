<!--
 * @Description: 运行状态卡片组件
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-07-31 15:42:42
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-28 13:26:06
-->
<template>
  <div class="card-container">
    <ElCard class="box-card">
      <div slot="header" class="card-header">
        <span class="f14">{{ cardData.name }}</span>
        <ElButton type="text" class="f12" @click="viewDataHandler(cardData)">查看数据</ElButton>
      </div>
      <div>
        <div class="f18 card-unit">
          <DynamicToolTip :content="cardValueUnit" effect="light">
            <span class="card-unit-text" slot="content" :style="{'font-size': valueFontSize}">
              {{ cardValue }}
              <span :style="{'font-size': unitFontSize}">{{ cardData.unit }}</span>
            </span>
          </DynamicToolTip>
        </div>
        <div class="f14 card-value">{{ cardData.time || '--' | parseMillTime }}</div>
      </div>
    </ElCard>
  </div>
</template>

<script>
import DynamicToolTip from 'src/components/DynamicToolTip'
export default {
  name: 'RunStateCard',
  components: {
    DynamicToolTip
  },
  props: {
    /**
     * @description: 卡片数据 必传项
     * @type Object
     * @参考值 {}
     */
    cardData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    cardValueUnit() {
      let result = ''
      // dataType 如果等于 bool | enum 时 后端返回的有描述 将描述用()展示
      if (this.cardData.dataType === 'bool' || this.cardData.dataType === 'enum') {
        result = (this.cardData.value ? this.cardData.value : '--') + ' (' + this.cardData.unit + ')'
      } else {
        result = (this.cardData.value ? this.cardData.value : '--') + ' ' + this.cardData.unit
      }
      return result
    },
    valueFontSize() {
      // 值字体大小设置
      return this.cardData.value.length > 12 ? '14px' : '28px'
    },
    unitFontSize() {
      // 单位字体大小设置
      return (this.cardData.dataType === 'bool' || this.cardData.dataType === 'enum') ? '28px' : '18px'
    },
    cardValue() {
      // 处理value展示
      return (this.cardData.value || this.cardData.value === 0) ? this.cardData.value : '--'
    }
  },
  methods: {
    viewDataHandler(identifier) {
      // 查看数据
      this.$parent.viewDataHandler(identifier)
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

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-unit {
    color: #333;
    height: 35px;
    line-height: 35px;
    margin-bottom: 12px;

    .card-unit-text {
      position: relative;
      cursor: pointer;

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
/deep/ {
  .el-card__header {
    padding: 4px 16px;
  }
  .el-card__body {
    padding: 16px 20px;
  }
}
</style>
