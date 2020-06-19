<!-- 
  文件作者：mawenjuan
  创建日期：2020.6.17
  文件说明：菜单的详情、编辑、创建页面
 -->
<template>
  <div id="menu_right_con">
    <div class="mb20">{{ msg }}</div>
    <el-form
      ref="form"
      :model="info"
      label-width="100px"
      class="mb20"
      :rules="rules"
      v-if="info"
    >
      <el-form-item label="菜单名称" prop="name">
        <el-input
          v-model="info.name"
          placeholder="请输入菜单名称"
          :disabled="!flag"
          class="w200"
        ></el-input>
      </el-form-item>
      <el-form-item label="菜单编号" prop="code">
        <el-input
          v-model="info.code"
          placeholder="请输入菜单编号"
          :disabled="!flag"
          class="w200"
        ></el-input>
      </el-form-item>
      <el-form-item label="上层菜单" prop="pid">
        <el-cascader
          ref="cascader"
          v-model="info.pid"
          :options="list"
          :props="cascaderProps"
          :disabled="!flag"
          placeholder="请选择上层菜单"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="请求地址" prop="url">
        <el-input
          v-model="info.url"
          placeholder="请输入请求地址"
          :disabled="!flag"
          class="w200"
        ></el-input>
      </el-form-item>
      <el-form-item label="菜单标记" prop="menuFlag">
        <el-radio-group v-model="info.menuFlag" :disabled="!flag">
          <el-radio label="Y">是</el-radio>
          <el-radio label="N">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序">
        <el-input
          v-model="info.sort"
          placeholder="请输入菜单排序"
          :disabled="!flag"
          class="w200"
        ></el-input>
      </el-form-item>
      <el-form-item label="图标">
        <el-input
          v-model="info.icon"
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
      <el-button type="primary" @click.stop="handleSave">保存</el-button>
    </div>
    <icon-select-con
      v-if="show"
      :icon="info.icon"
      @select="selectIcon"
      @close="closeSelectIconCon"
    ></icon-select-con>
  </div>
</template>

<script>
import iconSelectCon from "./selectIocn";
import { createMenu, updateMenu } from "@/api/menu";
export default {
  components: { iconSelectCon },
  props: ["activeItem"],
  data() {
    return {
      flag: 0, // 0 展示，1 编辑， 2添加
      show: false,
      list: [],
      cascaderProps: {
        label: "name",
        value: "menuId",
        checkStrictly: true
      },
      createRow: {
        name: "",
        code: "",
        pid: "",
        pcodeName: "",
        menuFlag: "Y",
        url: "",
        icon: ""
      },
      updateRow: {
        menuId: "",
        name: "",
        code: "",
        pid: "",
        pcode: "",
        menuFlag: "",
        url: "",
        icon: "",
        sort: ""
      },
      info: null,
      rules: {
        name: [{ required: true, message: "请输入菜单", trigger: "blur" }],
        code: [{ required: true, message: "请输入编号", trigger: "blur" }],
        pid: [{ required: true, message: "请选择上级菜单", trigger: "blur" }],
        menuFlag: [
          { required: true, message: "请选择菜单标记", trigger: "blur" }
        ],
        url: [{ required: true, message: "请输入请求地址", trigger: "blur" }]
      },
      menuObj: null
    };
  },
  watch: {
    activeItem: function() {
      this.into();
    }
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
  mounted() {
    this.into();
  },
  methods: {
    into() {
      this.list = this.$parent.list;
      this.menuObj = this.$parent.menuObj;
      if (this.activeItem) {
        this.info = JSON.parse(JSON.stringify(this.updateRow));
        for (const key in this.info) {
          this.info[key] = this.activeItem[key];
        }
        this.info.pid = this.findMenuIds(this.activeItem.pcodes);
      } else {
        this.info = JSON.parse(JSON.stringify(this.createRow));
        if (this.list && this.list.length > 0) {
          this.info.pid = this.findMenuIds([this.list[0].code]);
        }
      }
    },
    findMenuIds(codes) {
      const arr = [];
      if (codes && codes.length > 0) {
        codes.forEach(code => {
          arr.push(this.menuObj[code]);
        });
      }
      return arr;
    },
    handleSave() {
      this.$parent.loading = true;
      let promise = null;
      let str = "";
      // 根据父组件传入的值 确认是创建还是编辑
      const row = JSON.parse(JSON.stringify(this.info));
      row.pid = this.info.pid[this.info.pid.length - 1];
      const nodes = this.$refs.cascader.getCheckedNodes();
      row.pcodeName = nodes[0].data.name;
      if (this.info.menuId) {
        // 编辑
        promise = updateMenu;
        str = "编辑";
        // if (row.menuFlag === "Y") {
        //   row.menuFlag = 1;
        // } else {
        //   row.menuFlag = 0;
        // }
      } else {
        promise = createMenu;
        str = "创建";
        const nodes = this.$refs.cascader.getCheckedNodes();
        row.pcodeName = nodes[0].data.name;
      }
      promise(row)
        .then(res => {
          if (res.code === 200) {
            this.$message.success(`菜单${str}成功`);
            this.$parent.getData();
            this.$parent.flag = 1;
            this.flag = 0;
          } else {
            this.$message.error(res.message);
          }
          this.$parent.loading = false;
        })
        .catch(() => {
          this.$message.error(`菜单${str}失败`);
          this.$parent.loading = false;
        });
    },
    handleCancel() {
      this.flag = 0;
      this.$parent.flag = 1;
    },
    handleShowIcons() {
      this.show = true;
    },
    selectIcon(icon) {
      this.info.icon = icon;
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
