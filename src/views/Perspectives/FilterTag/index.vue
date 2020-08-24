<!--
 * @Description: FilterTag 过滤组件
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-21 16:51:04
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-24 19:12:08
-->
<template>
  <div class="filter-tag-container">
    <div class="icon-container">
      <span class="operation-text">Filter</span>
      <i v-if="show" class="el-icon-close delete-filter-btn" @click="deleteFilter" />
    </div>
    <ElSelect v-model="tag" popper-class="filter-tag-select" @change="tagChange">
      <ElOption
        v-for="item in tagOptions"
        :key="item.id"
        :label="item.label"
        :value="item.id"
      >
      </ElOption>
    </ElSelect>
    <div v-show="tag" class="tag-search-container">
      <ElInput v-model="searchValue" placeholder="请输入内容" @change="searchTagValue" />
      <div class="tag-value-container">
        <el-scrollbar style="height:100%;">
          <ul class="checked-tag-container">
            <li v-for="item in checkedTagsValue" :key="item.id">
              <el-checkbox v-model="item.checked" @change="checkboxChange(item)">{{ item.tagName }}</el-checkbox>
            </li>
          </ul>
          <ul class="no-checked-tag-container">
            <li v-for="item in uncheckedTagsValue" :key="item.id">
              <el-checkbox v-model="item.checked" @change="checkboxChange(item)">{{ item.tagName }}</el-checkbox>
            </li>
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
        return []
      }
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
      tag: '', // 选中的tag
      searchValue: '', // 用户输入的搜索值
      checkedTagsValue: [], // 选中的tagValue
      uncheckedTagsValue: [ // 未选中的tagValue
        {
          id: 1,
          checked: false,
          tagName: '选中的tag1'
        },
        {
          id: 2,
          checked: false,
          tagName: '选中的tag2'
        },
        {
          id: 3,
          checked: false,
          tagName: '未选中的tag3'
        },
        {
          id: 4,
          checked: false,
          tagName: '未选中的tag4'
        },
        {
          id: 5,
          checked: false,
          tagName: '未选中的tag5'
        },
        {
          id: 6,
          checked: false,
          tagName: '未选中的tag6'
        }
      ]
    }
  },
  methods: {
    checkboxChange(data) {
      // checkbox勾选事件逻辑处理
      if (data.checked) {
        const index = this.uncheckedTagsValue.findIndex(item => item.id === data.id)
        this.uncheckedTagsValue.splice(index, 1)
        this.checkedTagsValue.unshift(data)
      } else {
        const index = this.checkedTagsValue.findIndex(item => item.id === data.id)
        this.checkedTagsValue.splice(index, 1)
        this.uncheckedTagsValue.unshift(data)
      }
      // 每次勾选需要将该tag下的 value 和 tag 传回父级
      this.$emit('change', this.id, {
        tag: this.tag, // tag 的 id
        value: this.checkedTagsValue
      })
    },
    searchTagValue(value) {
      // 根据搜索条件查询tag下面的value值 调用后台接口 返回数据 需要 和 之前选中的数据进行对比过滤
      console.log(value)
    },
    tagChange() {
      // tag选择更改
      this.$emit('change', this.id, {
        tag: this.tag,
        value: this.checkedTagsValue
      })
      this.$emit('tagChange', this.tagOptions.find(item => item.id === this.tag))
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
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
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
