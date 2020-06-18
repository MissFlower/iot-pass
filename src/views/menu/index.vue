<!-- 
  文件作者：mawenjuan
  创建日期：2020.6.17
  文件说明：菜单管理的主体
 -->

<template>
  <div id="menu" v-loading="loading">
    <div class="con">
      <div class="left-con" v-show="flag">
        <div class="tr mt10 mr5 mb10">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            @click.stop="handleAdd"
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
            <span class="tree-label">{{ data.name }}</span>
            <span class="tree-check-icon">
              <i
                class="el-icon-close red hand"
                @click.stop="handleClose(data)"
              ></i>
              <i
                class="el-icon-edit blue hand ml10"
                @click.stop="handleEdit(data)"
              ></i>
            </span>
          </span>
        </el-tree>
      </div>
      <div class="right-con">
        <right-con v-if="!loading" ref="right" :activeItem="activeItem"></right-con>
      </div>
    </div>
  </div>
</template>

<script>
import rightCon from "./children/rightCon";
import { addBreadCrumbFun, dealFun } from "@/data/fun";
import { getMenuList, delMenu } from "@/api/menu";
export default {
  components: { rightCon },
  data() {
    return {
      flag: 1,
      loading: false,
      formData: {
        pageNum: 1,
        pageSize: 1000,
        name: "",
        code: ""
      },
      path: "/menu",
      list: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      activeItem: {},
      menuObj: {}
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.activeItem = JSON.parse(
        JSON.stringify(this.$refs.tree.getCurrentNode())
      );
    });
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      getMenuList(this.formData).then(res => {
        if (res.code === 200) {
          if (res.data.list) {
            if (res.data.list.length > 0) {
              // 处理返回父级菜单数组
              res.data.list.forEach(item => {
                this.menuObj[item.code] = item.menuId;
                if (item.pcodes) {
                  let arr = item.pcodes.split(",");
                  item.pcodes = arr.map(item => {
                    let str = item.replace(/\[|\]/g, "");
                    return item ? str : "";
                  });
                  item.pcodes.splice(item.pcodes.length - 1, 1);
                  item.pcodes.splice(0, 1);
                }
              });
            }
            this.list = dealFun(res.data.list);
          }
        }
        this.loading = false;
      });
    },
    handleNodeClick(data) {
      this.activeItem = JSON.parse(JSON.stringify(data));
    },
    handleAdd() {
      this.activeItem = null;
      this.$refs.right.flag = 2;
      this.flag = 0;
      addBreadCrumbFun({
        name: "新增菜单",
        path: ""
      });
    },
    handleEdit(row) {
      this.activeItem = row;
      this.$refs.right.flag = 1;
      this.flag = 0;
    },
    handleClose(row) {
      const str = "确认删除该菜单吗？";
      this.$confirm(str, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          delMenu({
            id: row.menuId
          })
            .then(res => {
              if (res.code === 200) {
                this.$message.success("菜单删除成功");
                this.getData();
              } else {
                this.$message.error(res.message);
              }
              this.loading = false;
            })
            .catch(() => {
              this.$message.error("菜单删除失败");
              this.loading = false;
            });
        })
        .catch(() => {
          this.$message("操作已取消");
        });
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
