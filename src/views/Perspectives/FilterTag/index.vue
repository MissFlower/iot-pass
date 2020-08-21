<!--
 * @Description: FilterTag 过滤组件
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-21 16:51:04
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-21 19:06:36
-->
<template>
  <div class="filter-tag-container">
    <span class="operation-text">Filter</span>
    <ElSelect v-model="tag" popper-class="filter-tag-select">
      <ElOption
        v-for="item in tagOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </ElOption>
    </ElSelect>
    <div v-show="tag" class="tag-search-container">
      <ElInput v-model="searchValue" placeholder="请输入内容" />
      <div class="tag-value-container">
        <el-scrollbar style="height:100%;">
          <ul class="checked-tag-container">
            <li>选中tag</li>
            <li>选中tag</li>
            <li>选中tag</li>
            <li>选中tag</li>
            <li>选中tag</li>
            <li>选中tag</li>
            <li>选中tag</li>
            <li>选中tag</li>
            <li>选中tag</li>
          </ul>
          <ul class="no-checked-tag-container">
            <li></li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FilterTag',
  props: {
    tagOptions: {
      type: Array,
      default: () => {
        return [
          {
            label: 'tag1',
            value: 1
          },
          {
            label: 'tag2',
            value: 2
          },
          {
            label: 'tag3',
            value: 3
          },
          {
            label: 'tag4',
            value: 4
          },
          {
            label: 'tag5',
            value: 5
          },
          {
            label: 'tag6',
            value: 6
          }
        ]
      }
    }
  },
  data() {
    return {
      tag: '', // 选中的tag
      searchValue: '' // 用户输入的搜索值
    }
  }
}
</script>

<style lang="scss" scoped>
  .filter-tag-container {
    padding: 8px;
    border: 1px solid #999;
    border-left: none;
    height: 100%;
  }
  .operation-text {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
  }
  .tag-search-container {
    margin-top: 2px;
    height: calc(100% - 48px);
  }
  /deep/.tag-value-container {
    height: calc(100% - 32px);
    border: 1px solid #DCDFE6;
    border-top: none;
    border-radius: 4px;
    margin-top: -1px;
    .el-scrollbar__wrap{
      overflow-x:hidden;
    }

    li {
      padding: 5px 10px;
      height: 20px;
      line-height: 20px;
      cursor: pointer;
      border-bottom: 1px dashed #ddd;
    }

    .checked-tag-container li {
      &:last-child {
        border-bottom-style: solid;
      }
    }

    .no-checked-tag-container li {
      &:last-child {
        border-bottom: none;
      }
    }
  }
</style>
<style>
.filter-tag-select .el-select-dropdown__wrap {
  max-height: 200px;
}
</style>
