<!-- 
  文件作者：mawenjuan
  创建日期：2020.6.18
  文件说明：用户管理主体页面
 -->
<template>
  <div id="account">
    <i
      v-if="activeIndex == 3 || activeIndex == 1"
      class="el-icon-back b pre-icon"
      @click="switchCon(0)"
    ></i>
    <account-list v-if="activeIndex == 0"></account-list>
    <add-account v-if="activeIndex == 1" :info="selectRow"></add-account>
    <role-list
      ref="roleList"
      v-if="activeIndex == 3"
      :info="selectRow"
    ></role-list>
    <add-role v-if="roleFlag" :info="roleRow" @close="dialogClose"></add-role>
  </div>
</template>

<script>
import accountList from "./children/list";
import addAccount from "./children/add";
import roleList from "./children/roleList";
import addRole from "./children/roleAdd";
export default {
  components: { accountList, addAccount, roleList, addRole },
  data() {
    return {
      roleFlag: false,
      roleRow: null,
      activeIndex: 0,
      selectRow: null
    };
  },
  methods: {
    switchCon(key, row) {
      if (row) {
        this.selectRow = row;
      } else {
        this.selectRow = null;
      }
      this.activeIndex = key;
    },
    showAddRole(row) {
      this.roleRow = row;
      this.roleFlag = true;
    },
    dialogClose() {
      this.roleFlag = false;
      this.$nextTick(() => {
        if (this.$refs.roleList) {
          this.$refs.roleList.getData();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#account {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
