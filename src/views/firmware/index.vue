<template>
  <div id="firmware">
    <h2>固件升级</h2>
    <el-tabs v-model="activeTag" type="card" @tab-click="handleClick">
      <el-tab-pane label="固件列表" name="first">
        <el-form ref="form" :model="form" label-width="80px" :inline="true">
          <el-form-item>
            <el-button type="primary" @click="addItem">新增固件</el-button>
            <el-button>安全升级</el-button>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.productName">
              <el-option label="全部产品" value="1"></el-option>
              <el-option label="测试" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.fmName"
              placeholder="请输入固件名称"
              @keyup.enter.native="searchList"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-table :data="list" border stripe>
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
          <el-table-column label="创建时间" prop="createTime"></el-table-column>
          <el-table-column
            label="固件状态"
            prop="fmStatus"
            :formatter="formatFmStatus"
          ></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <a
                class="oprate_btn"
                @click="checkFm(scope.row.id, scope.row.fmStatus)"
                >验证固件</a
              >
              |
              <a
                class="oprate_btn"
                :class="scope.row.fmStatus !== 2 ? 'disabled' : ''"
                @click="upgradeList(scope.row.id, scope.row.fmStatus)"
                >批量升级</a
              >
              |
              <a class="oprate_btn" @click="toDetails(scope.row.id)">查看</a> |
              <a class="oprate_btn" @click="delItem(scope.row.id)">删除</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="form.pageNum"
          :page-size="100"
          layout="total, prev, pager, next"
          :total="total"
          class="tr mt20"
          v-if="form.pageNum > 1"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="版本分布" name="second">
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
      </el-tab-pane>
    </el-tabs>
    <AddFirmware
      :dialogFormVisible="dialogFormVisible"
      @changeVisible="changeVisible"
      @changeList="changeList"
    />
    <CheckFirmware
      :checkFmVisible="checkFmVisible"
      :checkFmId="checkFmId"
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
import { getFmList, deleteFm } from "@/api/fireware";
export default {
  data() {
    return {
      list: [],
      total: 0,
      activeTag: "first",
      form: {
        fmName: "",
        productName: "1",
        pageNum: 1
      },
      versionControl: {
        proName: "1",
        devName: "1"
      },
      checkFmId: "",
      deviceList: [],
      labelPosition: "left",
      dialogFormVisible: false,
      checkFmVisible: false,
      upgradeFmVisible: false
    };
  },
  components: {
    AddFirmware,
    CheckFirmware,
    UpgradeFirmware
  },
  mounted() {
    this.fetchFmList();
  },
  methods: {
    fetchFmList() {
      getFmList({
        pageNum: this.form.pageNum,
        pageSize: 10,
        productName: this.form.productName,
        fmName: this.form.fmName
      })
        .then(res => {
          if (res.code === 200) {
            this.list = res.data.list;
          } else if (res.code === 9321) {
            this.$message.warning(res.message);
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    searchList() {
      this.form.pageNum = 1;
      this.fetchFmList();
    },
    /**
     * 验证固件
     */
    checkFm(fmId, fmStatus) {
      if (fmStatus === 0) {
        this.checkFmVisible = true;
        this.checkFmId = String(fmId);
      } else {
        this.openCheckFm(fmStatus);
      }
    },
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
    upgradeList(fmId, fmStatus) {
      if (fmStatus === 2) {
        this.upgradeFmVisible = true;
        this.checkFmId = String(fmId);
      }
    },
    upgradeVisible() {
      this.upgradeFmVisible = false;
    },
    formatFmStatus(row) {
      return row.fmStatus === 0
        ? "未验证"
        : row.fmStatus === 1
        ? "验证中"
        : "已验证";
    },
    handleCurrentChange() {},
    handleClick(tab, event) {
      console.log(tab, event);
    },
    addItem() {
      this.dialogFormVisible = true;
    },
    changeVisible() {
      this.dialogFormVisible = false;
    },
    changeList() {
      this.fetchFmList();
    },
    toDetails(id) {
      this.$router.push({
        path: "details",
        query: {
          id: id
        }
      });
    },
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
