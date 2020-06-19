<template>
  <div id="menu" v-loading="loading">
    <div class="con">
      <div class="left-con" v-show="flag">
        <div class="tr mt10 mr5 mb10">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            @click="handleAdd"
          ></el-button>
        </div>
        <el-tree
          ref="tree"
          :data="list"
          :props="defaultProps"
          node-key="path"
          highlight-current
          :current-node-key="path"
          @node-click="handleNodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="tree-label">{{ data.title }}</span>
            <span class="tree-check-icon">
              <i class="el-icon-close red hand"></i>
              <i
                class="el-icon-edit blue hand ml10"
                @click.stop="handleEdit"
              ></i>
            </span>
          </span>
        </el-tree>
      </div>
      <div class="right-con">
        <right-con ref="right" :activeItem="activeItem"></right-con>
      </div>
    </div>
  </div>
</template>

<script>
import rightCon from "./children/rightCon";
import { addBreadCrumbFun } from "@/data/fun"
export default {
  components: { rightCon },
  data() {
    return {
      flag: 1,
      loading: false,
      path: "/menu",
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
          flag: "1",
          children: [
            {
              title: "角色管理1",
              path: "/role1",
              icon: "role1",
              pid: "",
              id: "2-1",
              flag: "1",
              children: [
                {
                  title: "角色管理1-1",
                  path: "/role11",
                  icon: "role11",
                  pid: "",
                  id: "2-1-1",
                  flag: "1"
                },
                {
                  title: "角色管理1-2",
                  path: "/role12",
                  icon: "role12",
                  pid: "",
                  id: "2-1-2",
                  flag: "1"
                }
              ]
            },
            {
              title: "角色管理2",
              path: "/role2",
              icon: "role2",
              pid: "",
              id: "2-2",
              flag: "1"
            }
          ]
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
      defaultProps: {
        children: "children",
        label: "title"
      },
      activeItem: {}
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.activeItem = JSON.parse(
        JSON.stringify(this.$refs.tree.getCurrentNode())
      );
    });
  },
  methods: {
    handleNodeClick(data) {
      this.activeItem = JSON.parse(JSON.stringify(data));
    },
    handleAdd() {
      for (let key in this.activeItem) {
        this.activeItem[key] = "";
      }
      this.$refs.right.flag = 2;
      this.flag = 0;
      addBreadCrumbFun({
        name: "新增菜单",
        path: ""
      });
    },
    handleEdit() {
      this.$refs.right.flag = 1;
      this.flag = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
#menu {
  position: relative;
  width: 100%;
  height: 100%;
  .con {
    display: flex;
    position: relative;
    height: 100%;
    width: 100%;
    .left-con {
      width: 260px;
      // border-right: 1px solid #e6e6e6;
      overflow: auto;
    }
    .right-con {
      padding: 10px 20px;
      flex: 1;
    }
  }
}
</style>
<style lang="scss">
#menu > .con > .left-con {
  .el-button--mini {
    padding: 3px 7px;
  }
  .el-tree {
    .el-tree-node__content {
      height: 40px;
      padding-right: 20px;
    }
    .tree-label {
      font-size: 13px !important;
    }
    .el-tree-node.is-current {
      & > .el-tree-node__content .tree-check-icon {
        display: inline-block;
      }
    }
    .tree-check-icon {
      position: absolute;
      right: 20px;
      display: none;
    }
  }
}
</style>
