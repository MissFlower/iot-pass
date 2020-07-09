<!-- 
  文件作者：mawenjuan
  创建日期：2020.6.18
  文件说明：角色的菜单权限的展示、编辑
 -->
<template>
  <div id="roleAuth" v-loading="loading">
    <div class="ml20 mb20">
      <span>角色权限</span>
      <span v-if="flag" class="f12 blue ml20">(编辑中)</span>
      <i v-else class="el-icon-edit blue fr" @click="handleEdit"></i>
    </div>
    <div class="main">
      <!-- <el-checkbox-group v-model="ids" :disabled="!flag">
        <selectPart :list="authData" :type="0"></selectPart>
      </el-checkbox-group> -->
      <el-tree
        ref="tree"
        :data="authData"
        default-expand-all
        show-checkbox
        node-key="id"
        :expand-on-click-node="false"
        :default-checked-keys="ids"
        :props="defaultProps"
        check-strictly
      >
      </el-tree>
    </div>
    <div v-if="flag" class="tc mt20">
      <el-button size="mini" @click="handleCancel">取消</el-button>
      <el-button size="mini" type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getMenusTree, setAuthorityForRole } from "@/api/role";
import { dealAuthTreeFun } from "@/data/fun";
// import selectPart from './selectPart'
export default {
  props: ["info"],
  inject: ["reload"],
  // components: {selectPart},
  data() {
    return {
      flag: 0,
      loading: false,
      authData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      ids: [],
      allList: null // 用户编辑状态的切换
    };
  },
  mounted() {
    this.getAuth();
  },
  methods: {
    // 获取角色权限
    getAuth() {
      this.loading = true;
      this.authData = [];
      this.ids = [];
      getMenusTree({
        roleId: this.info.roleId
      })
        .then(res => {
          if (res.code === 200) {
            if (res.data && res.data.length > 0) {
              res.data.forEach(item => {
                if (item.checked) {
                  this.ids.push(item.id);
                }
                item.disabled = true;
              });
              this.allList = res.data;
              this.authData = dealAuthTreeFun(res.data);
            }
          }
          this.loading = false;
        })
        .catch(() => {
          this.$message.error("角色的菜单权限获取失败");
          this.loading = false;
        });
    },
    handleEdit() {
      this.allList.forEach(item => {
        item.disabled = false;
      });
      this.flag = 1;
    },
    // 取消函数
    handleCancel() {
      // this.allList.forEach(item => {
      //   item.disabled = true;
      // });
      this.getAuth();
      this.flag = 0;
    },
    // 提交函数
    handleSave() {
      this.ids = this.$refs.tree.getCheckedKeys();
      this.loading = true;
      setAuthorityForRole({
        roleId: this.info.roleId,
        ids: this.ids.join(",")
      })
        .then(res => {
          if (res.code === 200) {
            this.$message.success("角色的菜单权限设置成功");
            this.reload(1);
            this.flag = 0;
            this.getAuth();
          } else {
            this.$message.error(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.$message.error("角色的菜单权限设置失败");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#roleAuth {
  position: relative;
  width: 100%;
  height: 100%;
  .main {
    position: relative;
    height: calc(100% - 80px);
    overflow: auto;
    padding: 0 20px;
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
  .el-checkbox__label {
    font-weight: 400;
    color: #606266;
  }
  .el-tree-node__expand-icon.expanded {
    display: none;
  }
  .el-tree .el-tree-node__children > .el-tree-node .el-tree-node__children {
    display: flex;
    flex-wrap: wrap;
    // align-items: center;
  }
  .el-tree {
    .el-tree-node__content {
      height: 40px;
    }
  }
}
</style>
