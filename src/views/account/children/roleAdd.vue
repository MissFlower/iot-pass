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
      <div class="w200 info tc">
        <div class="blue">用户的基础信息</div>
        <div>{{ info.name }}</div>
      </div>
      <div class="pt20 mt15">
        <el-checkbox-group v-model="selectIds">
          <el-checkbox
            v-for="item in roleList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          ></el-checkbox>
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
export default {
  props: ["info"],
  data() {
    return {
      loading: false,
      dialogVisible: true,
      roleList: [
        {
          id: 1,
          name: "超级管理员"
        },
        {
          id: 2,
          name: "管理员"
        },
        {
          id: 3,
          name: "普通用户"
        }
      ],
      selectIds: []
    };
  },
  mounted() {
    console.log(this.info);
  },
  methods: {
    close() {
      this.$emit("close");
    },
    handleCancel() {
      this.close();
    },
    handleSave() {
      this.loading = true;
      setTimeout(() => {
        this.close();
        this.loading = false;
      }, 2000);
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
