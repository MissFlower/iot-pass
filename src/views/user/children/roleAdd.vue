<!--
  文件作者：mawenjuan
  创建日期：2020.6.19
  文件说明：用户的角色编辑列表
-->

<template>
  <el-dialog
    id="accRole"
    title="用户角色配置"
    :visible.sync="dialogVisible"
    @close="close"
    v-loading="loading"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div class="df">
      <div class="w200 info">
        <div class="blue tc">用户的基础信息</div>
        <div class="df">
          <div class="w50">账号:</div>
          {{ info.account }}
        </div>
        <div class="df">
          <div class="w50">姓名:</div>
          {{ info.name }}
        </div>
        <div class="df">
          <div class="w50">邮箱:</div>
          {{ info.email }}
        </div>
        <div class="df">
          <div class="w50">电话:</div>
          {{ info.phone }}
        </div>
      </div>
      <div class="pt20 mt15">
        <el-checkbox-group v-model="selectIds">
          <el-checkbox
            v-for="item in roleList"
            :key="item.roleId"
            :label="item.roleId"
          >
            {{ item.name ? item.name : item.account }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="tr mt20">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { userRoleList, updateRoleforUser } from "@/api/user";
export default {
  props: ["info"],
  inject: ["reload"],
  data() {
    return {
      loading: false,
      dialogVisible: true,
      roleList: [],
      selectIds: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() { // 获取用户的角色列表
      this.loading = true;
      this.roleList = [];
      this.selectIds = [];
      userRoleList({
        userId: this.info.id
      })
        .then(res => {
          if (res.code === 200) {
            if (res.data.roles.length > 0) {
              res.data.roles.forEach(item => {
                if (item.checked) {
                  this.selectIds.push(item.roleId);
                }
              });
            }
            this.roleList = res.data.roles;
          } else {
            this.$message.error(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.$message.error("角色列表获取失败");
          this.loading = false;
        });
    },
    close() {
      this.$emit("close");//  触发父级函数
    },
    handleCancel() {
      this.close();
    },
    handleSave() { // 角色配置提交
      if (this.selectIds.length > 10) {
        this.$message.warning("一个用户最多配置10个角色");
        return;
      }
      this.loading = true;
      updateRoleforUser({
        userId: this.info.id,
        roleIds: this.selectIds.join(",")
      })
        .then(res => {
          if (res.code === 200) {
            this.$message.success("用户的角色设置成功");
            this.reload(1);
            this.close();
          } else {
            this.$message.error(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.$message.error("用户的角色设置失败");
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#accRole {
  .info {
    width: 200px;
    border-right: 1px solid #efefef;
    margin-right: 20px;
    div + div {
      margin-top: 20px;
    }
  }
}
</style>
