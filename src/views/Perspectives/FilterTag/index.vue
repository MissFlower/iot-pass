<!--
 * @Description: FilterTag 过滤组件
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-21 16:51:04
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-28 13:49:57
-->
<template>
  <div class="filter-tag-container">
    <div class="icon-container">
      <span class="operation-text">Filter</span>
      <i v-if="show" class="el-icon-close delete-filter-btn" @click="deleteFilter" />
    </div>
    <ElSelect v-model="tagKey" popper-class="filter-tag-select" @change="tagChange">
      <ElOption
        v-for="item in tagOptions"
        :key="item"
        :label="item"
        :value="item"
      >
      </ElOption>
    </ElSelect>
    <div v-show="tagKey" class="tag-search-container">
      <ElInput v-model.trim="searchValue" placeholder="请输入内容" @input="searchTagValue" />
      <div class="tag-value-container">
        <ElScrollbar style="height:100%;">
          <ul class="checked-tag-container">
            <li v-for="item in checkedTagsValue" :key="item.value">
              <ElCheckbox v-model="item.checked" @change="checkboxChange(item)">{{ item.value }}</ElCheckbox>
            </li>
          </ul>
          <ul class="no-checked-tag-container">
            <li v-for="item in uncheckedTagsValue" :key="item.value">
              <ElCheckbox v-model="item.checked" @change="checkboxChange(item)">{{ item.value }}</ElCheckbox>
            </li>
          </ul>
        </ElScrollbar>
      </div>
    </div>
  </div>
</template>
<script>
import { getTagValueByTagkey } from 'src/api/perspectives'
import { throttle } from 'src/utils'
export default {
  name: 'FilterTag',
  props: {
    tagOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    productKey: {
      type: String,
      required: true
    },
    measureKey: {
      type: Object,
      required: true
    },
    id: {
      type: [String, Number],
      required: true
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tagKey: '', // 选中的tag
      searchValue: '', // 用户输入的搜索值
      checkedTagsValue: [], // 选中的tagValue
      uncheckedTagsValue: [], // 未选中的tagValue
      saveUncheckedTagsValue: [],
      $_searchTagValueHandler: null
    }
  },
  mounted() {
    // 搜索 value 进行 绑定 节流函数
    this.$_searchTagValueHandler = throttle(this.filterUncheckedTagsValue, 300)
  },
  methods: {
    checkboxChange(data) {
      // checkbox勾选事件逻辑处理
      if (data.checked) {
        const index = this.uncheckedTagsValue.findIndex(item => item.value === data.value)
        this.uncheckedTagsValue.splice(index, 1)
        this.checkedTagsValue.unshift(data)
      } else {
        const index = this.checkedTagsValue.findIndex(item => item.value === data.value)
        this.checkedTagsValue.splice(index, 1)
        this.uncheckedTagsValue.unshift(data)
      }
      // 每次勾选需要将该tag下的 value 和 tag 传回父级
      this.$emit('change', this.id, {
        tag: this.tagKey, // tag 的 id
        values: this.checkedTagsValue
      })
    },
    async getTagValueList() {
      // 获取 tagvalue 列表
      const { data } = await getTagValueByTagkey({
        productKey: this.productKey,
        tagKey: this.tagKey,
        tagValuePre: this.searchValue
      })
      return data ? data.map(item => { return { checked: false, value: item } }) : []
    },
    searchTagValue() {
      // 根据条件搜索value
      // 空条件 赋予最初列表 并 return
      if (!this.searchValue) {
        // 搜索条件为空时 进行列表还原
        const checkedValueIdList = this.checkedTagsValue.map(item => item.value)
        this.uncheckedTagsValue = [...this.saveUncheckedTagsValue.filter(item => !checkedValueIdList.includes(item.value))]
        return
      }
      this.$_searchTagValueHandler()
    },
    async filterUncheckedTagsValue() {
      // 根据搜索条件查询tag下面的value值 调用后台接口 返回数据 需要 和 之前选中的数据进行对比过滤
      const matchValue = await this.getTagValueList()
      // 和选中的数据进行对比 再次过滤
      const checkedValueIdList = this.checkedTagsValue.map(item => item.value)
      this.uncheckedTagsValue = [...matchValue.filter(item => !checkedValueIdList.includes(item.value))]
    },
    async tagChange() {
      // tag选择更改 请求接口 获取tag下value列表
      this.searchValue = ''
      const tagValueList = await this.getTagValueList()
      this.uncheckedTagsValue = [...tagValueList]
      this.saveUncheckedTagsValue = [...tagValueList]
      // 将原来选中的tag value 和 搜索关键字 清空
      this.checkedTagsValue = []
      // 更改tag 向父级传回最新的选择结果
      this.$emit('change', this.id, {
        tag: this.tagKey,
        values: this.checkedTagsValue
      })
      this.$emit('tagChange', this.tagOptions.find(item => item === this.tagKey))
    },
    deleteFilter() {
      // 删除过滤条件
      this.$confirm('此操作将删除该条Filter, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('deleteFilter', this.id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .filter-tag-container {
    padding: 4px 8px;
    border: 1px solid #999;
    border-left: none;
    height: 100%;
  }
  .icon-container {
    display: flex;
    justify-content: space-between;

    .operation-text {
      display: inline-block;
      line-height: 24px;
      font-size: 14px;
    }

    .delete-filter-btn {
      width: 24px;
      height: 24px;
      text-align: center;
      line-height: 24px;
      cursor: pointer;
      transform: rotate(0);
      transition: 0.3s all ease-in-out;
      transform-origin: center;
      &:hover {
        transform: rotate(90deg)
      }
    }
  }
  .tag-search-container {
    margin-top: 2px;
    height: calc(100% - 65px);
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
