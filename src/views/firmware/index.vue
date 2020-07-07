<!--
文件作者：liuxixiu
创建日期：2020.6.17
文件说明：固件管理
 -->
<template>
  <div id="firmware">
    <h2>固件升级</h2>
    <el-tabs v-model="activeTag" type="card">
      <el-tab-pane label="固件列表" name="first">
        <el-form ref="form" :model="form" label-width="80px" :inline="true">
          <el-form-item>
            <el-button type="primary" @click="addItem">新增固件</el-button>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="productsValue"
              filterable
              :filter-method="userFilter"
              @change="changeSelect"
              clearable
            >
              <el-option label="全部产品" value=""></el-option>
              <el-option
                v-for="item in products"
                :key="item.id"
                :label="item.productName"
                :value="`${item.id}|${item.productName}`"
              ></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item>-->
          <!--<el-select v-model="form.productName">-->
          <!--<el-option label="全部产品" value="1"></el-option>-->
          <!--<el-option label="测试" value="2"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item>
            <el-input
              v-model="form.fmName"
              placeholder="请输入固件名称"
              class="searchInput"
              @keyup.enter.native="searchList"
            >
              <span slot="suffix">
                <i class="el-icon-search hand" @click="searchList"></i>
                <i class="el-icon-close hand" v-if="form.fmName != ''" @click="clearFun"></i>
              </span>
            </el-input>
          </el-form-item>
        </el-form>
        <el-table :data="list" border stripe v-loading="loading">
          <el-table-column label="固件ID" prop="id"></el-table-column>
          <el-table-column label="固件名称" prop="fmName"></el-table-column>
          <el-table-column
            label="产品名称"
            prop="productName"
          ></el-table-column>
          <el-table-column
            label="升级前版本"
            prop="srcVersion"
          ></el-table-column>
          <el-table-column
            label="升级后版本"
            prop="destVersion"
          ></el-table-column>
          <el-table-column label="创建时间" prop="createTime" :formatter="formatCreateTime"></el-table-column>
          <el-table-column
            label="固件状态"
            prop="fmStatus"
            :formatter="formatFmStatus"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a class="oprate_btn" @click="checkFm(scope.row)">验证固件</a>
              |
              <el-tooltip
                class="item"
                effect="dark"
                content="请先验证固件，再进行批量升级"
                placement="top"
                v-if="scope.row.fmStatus !== 2"
              >
                <a class="oprate_btn disabled">批量升级</a>
              </el-tooltip>
              <a
                v-else
                class="oprate_btn"
                @click="upgradeList(scope.row.id, scope.row.fmStatus)"
                >批量升级</a
              >
              |
              <a class="oprate_btn" @click="toDetails(scope.row.id, scope.row.productName)">查看</a> |
              <a class="oprate_btn" @click="delItem(scope.row.id)">删除</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="form.pageNum"
          :page-size="form.pageSize"
          layout="total, prev, pager, next"
          :total="fmTotal"
          class="tr mt20"
        >
        </el-pagination>
      </el-tab-pane>
      <!-- <el-tab-pane label="版本分布" name="second" :disabled="tabDisabled">
        <div>
          <el-form
            :label-position="labelPosition"
            ref="versionControl"
            :model="versionControl"
            :inline="true"
          >
            <el-form-item label="产品">
              <el-select v-model="versionControl.proName">
                <el-option label="测试" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-row :gutter="10">
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <h4 class="version_tit">固件版本分布</h4>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <h4 class="version_tit">固件版本占比</h4>
              </div>
            </el-col>
          </el-row>
        </div>
        <div>
          <h4>设备列表</h4>
          <el-form label-width="80px" :inline="true">
            <el-form-item>
              <el-select v-model="versionControl.devName">
                <el-option label="全部版本" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-table :data="deviceList" border stripe>
            <el-table-column label="设备名称" prop="name"></el-table-column>
            <el-table-column label="固件版本" prop="version"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane> -->
    </el-tabs>
    <AddFirmware
      :dialogFormVisible="dialogFormVisible"
      @changeVisible="changeVisible"
      @changeList="changeList"
    />
    <CheckFirmware
      :checkFmVisible="checkFmVisible"
      :checkFmId="checkFmId"
      :srcVersion="srcVersion"
      :fmDeviceList="fmDeviceList"
      @checkVisible="checkVisible"
      @refreshList="refreshList"
    ></CheckFirmware>
    <UpgradeFirmware
      :upgradeFmVisible="upgradeFmVisible"
      :checkFmId="checkFmId"
      @upgradeVisible="upgradeVisible"
    ></UpgradeFirmware>
  </div>
</template>

<script>
import AddFirmware from "@/components/firmware/addFirmware";
import CheckFirmware from "@/components/firmware/checkFirmware";
import UpgradeFirmware from "@/components/firmware/upgradeFirmware";
import {
  getFmList,
  deleteFm,
  getProducts,
  getVerifyFirmInfo
} from "@/api/fireware";
export default {
  data() {
    return {
      loading: true,
      list: [],
      activeTag: "first",
      form: {
        fmName: "",
        productId: "",
        pageSize: 20,
        pageNum: 1
      },
      versionControl: {
        proName: "1",
        devName: "1"
      },
      productForm: {
        pageNum: 1,
        pageSize: 50,
        productName: ""
      },
      products: [],
      productsValue: "",
      fmTotal: 0,
      checkFmId: "",
      srcVersion: "",
      fmDeviceList: [],
      deviceList: [],
      labelPosition: "left",
      dialogFormVisible: false,
      checkFmVisible: false,
      upgradeFmVisible: false,
      tabDisabled: true
    };
  },
  components: {
    AddFirmware,
    CheckFirmware,
    UpgradeFirmware
  },
  mounted() {
    this.fetchFmList();
    this.getProductList();
  },
  methods: {
    // 获取固件列表
    fetchFmList() {
      let formData = {
        "pageNum": this.form.pageNum,
        "pageSize": this.form.pageSize,
        "productId": this.form.productId,
        "fmName": this.form.fmName
      };
      getFmList(formData)
        .then(res => {
          if (res.code === 200) {
            this.list = res.data.data;
            this.fmTotal = res.data.total;
            this.loading = false;
          } else if (res.code === 9321) {
            this.$message.warning(res.message);
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    clearFun () {
      this.form.fmName = ''
      this.searchList()
    },
    // 搜索固件列表
    searchList() {
      this.fetchFmList();
    },
    // 筛选产品数据
    userFilter(query = "") {
      let arr = this.products.filter(item => {
        return item.productName.includes(query);
      });
      if (arr.length > 50) {
        this.products = arr.slice(0, 50);
      } else {
        this.products = arr;
      }
    },
    // 获取产品列表
    getProductList() {
      this.form.productId = this.productsValue.split("|")[0]
        ? this.productsValue.split("|")[0]
        : "";
      let data = this.productForm;
      getProducts(data).then(res => {
        this.products = res.data.data;
        this.userFilter();
      });
    },
    changeSelect() {
      this.form.productId = this.productsValue.split("|")[0];
      this.searchList();
    },
    /**
     * 验证固件
     */
    checkFm(row) {
      // 未验证的固件进行验证，验证中或已验证的固件弹窗提示
      if (row.fmStatus === 0) {
        this.checkFmId = String(row.id);
        this.srcVersion = row.srcVersion;
        this.getVerifyFirmInfo(this.checkFmId, this.srcVersion);
      } else {
        this.openCheckFm(row.fmStatus);
      }
    },
    // 验证固件前校验是否存在设备
    getVerifyFirmInfo(fmId, versions) {
      let data = {
        "pageNum": 1,
        "pageSize": 10,
        "fmId": fmId,
        "srcVersions": versions
      };
      getVerifyFirmInfo(data).then(res => {
        if (res.code === 200) {
            this.fmDeviceList = res.data.data;
            this.checkFmVisible = true;
        } else if (res.code === 9003) {
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定",
            type: "warning",
            callback: action => {
            }
          });
        } else {
            this.$message({
                type: "warning",
                message: res.message
            });
        }
      });
    },
    // 验证固件组件
    checkVisible() {
      this.checkFmVisible = false;
    },
    openCheckFm(status) {
      let title = status === 1 ? "固件验证中" : "固件验证成功";
      this.$alert(`${title}`, "验证固件", {
        confirmButtonText: "关闭"
      });
    },
    refreshList() {
      this.fetchFmList();
    },
    // 升级固件组件
    upgradeList(fmId, fmStatus) {
      if (fmStatus === 2) {
        this.upgradeFmVisible = true;
        this.checkFmId = String(fmId);
      }
    },
    upgradeVisible() {
      this.upgradeFmVisible = false;
    },
    // 格式化表格数据
    formatFmStatus(row) {
      return row.fmStatus === 0
        ? "未验证"
        : row.fmStatus === 1
        ? "验证中"
        : "已验证";
    },
    formatCreateTime (row) {
      return row.createTime ? this.$fun.dateFormat(
          this.$fun.strFormatDate(row.createTime),
          "yyyy-MM-dd hh:mm:ss"
      ): ''
    },
    // 分页
    handleCurrentChange() {
      this.fetchFmList();
    },
    addItem() {
      this.dialogFormVisible = true;
    },
    // 添加固件组件传值
    changeVisible() {
      this.dialogFormVisible = false;
    },
    changeList() {
      this.fetchFmList();
    },
    // 查看详情
    toDetails(id, productName) {
      this.$router.push({
        path: "details",
        query: {
          id: id,
          productName: productName
        }
      });
    },
    // 删除固件
    deleteFm(fmId) {
      let formData = new FormData();
      formData.append("fmId", fmId);
      deleteFm(formData).then(res => {
        if (res.code === 200) {
          this.fetchFmList();
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    // 删除固件
    delItem(fmId) {
      this.$confirm("您确定要删除此固件吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteFm(fmId);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
$default: #409eff;
#firmware {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
}
.oprate_btn {
  color: $default;
  cursor: pointer;
}
.disabled {
  color: #999;
  cursor: text;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple {
  border: 1px solid #d3dce6;
}
.grid-content {
  border-radius: 4px;
  min-height: 320px;
  box-sizing: border-box;
  padding: 20px;
  .version_tit {
    margin: 0;
    padding: 0;
  }
}
</style>
