<template>
  <div id="roleAuth">
    <div class="ml20 mb20">
      <span>角色权限</span>
      <span v-if="flag" class="f12 blue ml20">(编辑中)</span>
      <i v-else class="el-icon-edit blue fr" @click="flag = 1"></i>
    </div>
    <div v-for="(item, index) in authData" :key="index" class="row_item">
      <div class="w120">
        <el-checkbox :disabled="!flag">{{ item.name }}</el-checkbox>
      </div>
      <div class="row_item_children">
        <div
          v-for="(child, i) in item.children"
          :key="`${index}${i}`"
          class="ml20"
        >
          <el-checkbox :disabled="!flag">{{ child.name }}</el-checkbox>
        </div>
      </div>
    </div>
    <div v-if="flag" class="tc mt20">
      <el-button size="mini" @click="handleCancel">取消</el-button>
      <el-button size="mini" type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["info"],
  data() {
    return {
      flag: 0,
      authData: [
        {
          name: "菜单管理",
          id: 1,
          children: [
            {
              name: "增",
              auth: 1,
              id: 11
            },
            {
              name: "删",
              auth: 2,
              id: 12
            },
            {
              name: "改",
              auth: 4,
              id: 13
            },
            {
              name: "查",
              auth: 8,
              id: 14
            }
          ]
        },
        {
          name: "角色管理",
          id: 2,
          children: [
            {
              name: "增",
              auth: 1,
              id: 21
            },
            {
              name: "删",
              auth: 2,
              id: 22
            },
            {
              name: "改",
              auth: 4,
              id: 23
            },
            {
              name: "查",
              auth: 8,
              id: 24
            }
          ]
        }
      ]
    };
  },
  methods: {
    handleCancel() {
      this.flag = 0;
    },
    handleSave() {
      this.flag = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
#roleAuth {
  .row_item {
    display: flex;
    padding: 15px;
    .row_item_children {
      flex: 1;
      display: flex;
    }
  }
}
</style>

<style lang="scss">
#roleAuth {
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #409eff;
    border-color: #409eff;
    opacity: 0.6;
  }
}
</style>
