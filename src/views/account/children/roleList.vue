<template>
  <div id="accRoleList">
    <div class="pl20 mb20">
      <span>{{ info.name }}的角色列表</span>
      <svg-icon
        icon-class="roleSet"
        class="success orange f16 ml20"
        @click.stop="handleShowAddRole"
      ></svg-icon>
    </div>
    <el-table :data="roleList" border class="w400">
      <el-table-column label="ID" prop="roleId"></el-table-column>
      <el-table-column label="角色名称" prop="name"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: ["info"],
  data() {
    return {
      roleList: [
        {
          roleId: 1,
          name: "管理员"
        }
      ]
    };
  },
  methods: {
    handleShowAddRole() {
      this.$parent.showAddRole(this.info);
    }
  }
};
</script>
