<template>
  <div id="menu_right_con">
    <div class="mb20">{{ msg }}</div>
    <el-form :model="activeItem" label-width="100px" class="mb20">
      <el-form-item label="菜单名称">
        <el-input
          v-model="activeItem.title"
          placeholder="请输入菜单名称"
          :disabled="!flag"
          class="w200"
        ></el-input>
      </el-form-item>
      <el-form-item label="上层菜单">
        <el-cascader
          v-model="activeItem.pid"
          :options="list"
          :props="cascaderProps"
          :disabled="!flag"
          placeholder="请选择上层菜单"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="请求地址">
        <el-input
          v-model="activeItem.path"
          placeholder="请输入请求地址"
          :disabled="!flag"
          class="w200"
        ></el-input>
      </el-form-item>
      <el-form-item label="菜单标记">
        <el-radio-group v-model="activeItem.flag" :disabled="!flag">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图标">
        <el-input
          v-model="activeItem.icon"
          placeholder="请输入图标"
          :disabled="!flag"
          class="w200"
          @focus="handleShowIcons"
        ></el-input>
      </el-form-item>
    </el-form>
    <div v-if="flag == 0" class="tc">
      <!-- <el-button type="danger">删除</el-button> -->
      <!-- <el-button type="primary" @click="handleEdit">编辑</el-button> -->
    </div>
    <div v-else class="tc">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
    <icon-select-con
      v-if="show"
      :icon="activeItem.icon"
      @select="selectIcon"
      @close="closeSelectIconCon"
    ></icon-select-con>
  </div>
</template>

<script>
import iconSelectCon from "./selectIocn";
export default {
  components: { iconSelectCon },
  props: ["activeItem"],
  data() {
    return {
      flag: 0, // 0 展示，1 编辑， 2添加
      show: false,
      list: [
        {
          icon: "menu",
          title: "菜单管理",
          path: "/menu",
          pid: "",
          id: "1",
          flag: "1" // 1 菜单 0 功能
        },
        {
          title: "角色管理",
          path: "/role",
          icon: "role",
          pid: "",
          id: "2",
          flag: "1"
        },
        {
          title: "用户管理",
          path: "/account",
          icon: "account",
          pid: "",
          id: "3",
          flag: "1"
        },
        {
          title: "产品管理",
          path: "/product",
          icon: "product",
          pid: "",
          id: "4",
          flag: "1"
        },
        {
          title: "设备管理",
          path: "/device",
          icon: "equ",
          pid: "",
          id: "5",
          flag: "1"
        },
        {
          title: "固件管理",
          path: "/firmware",
          icon: "firmware",
          pid: "",
          id: "6",
          flag: "1"
        },
        {
          title: "日志管理",
          path: "/log",
          icon: "log",
          pid: "",
          id: "7",
          flag: "1"
        }
      ],
      cascaderProps: {
        label: "title",
        value: "id",
        checkStrictly: true
      }
    };
  },
  computed: {
    msg() {
      let str = "";
      switch (this.flag) {
        case 0:
          str = "菜单详情";
          break;
        case 1:
          str = "菜单编辑";
          break;
        case 2:
          str = "添加菜单";
          break;
      }
      return str;
    }
  },
  methods: {
    handleEdit() {
      this.flag = 1;
      this.$parent.flag = 0;
    },
    handleSave() {
      this.$parent.loading = true;
      setTimeout(() => {
        this.flag = 0;
        this.$parent.loading = false;
        this.$parent.flag = 1;
      }, 2000);
    },
    handleCancel() {
      this.flag = 0;
      this.$parent.flag = 1;
    },
    handleShowIcons() {
      this.show = true;
    },
    selectIcon(icon) {
      this.activeItem.icon = icon;
    },
    closeSelectIconCon() {
      this.show = false;
    }
  }
};
</script>

<style lang="scss">
#menu_right_con .el-form-item--small.el-form-item {
  display: inline-block;
  width: 50%;
}
</style>
