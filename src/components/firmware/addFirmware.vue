<!--
文件作者：liuxixiu
创建日期：2020.6.17
文件说明：新增固件
 -->
<template>
  <div>
    <el-dialog
      title="添加固件"
      :visible.sync="dialogFormVisible"
      width="30%"
      :before-close="closeDialog"
    >
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="固件类型" required>
          <el-radio-group v-model="ruleForm.fmType">
            <el-radio-button label="1">整包</el-radio-button>
            <el-radio-button label="2">差分</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="固件名称" prop="fmName" required>
          <el-input type="text" v-model="ruleForm.fmName"></el-input>
        </el-form-item>
        <el-form-item label="所属产品" required>
          <el-select
            v-model="productsValue"
            filterable
            :filter-method="userFilter"
            @change="changeSelect"
            clearable
          >
            <el-option
              v-for="item in products"
              :key="item.id"
              :label="item.productName"
              :value="`${item.id}|${item.productName}`"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="固件产品类型" required>
          <el-select v-model="ruleForm.type" placeholder="固件产品类型">
            <el-option label="Md5" value="1"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="固件模块" required>-->
        <!--<el-radio v-model="ruleForm.typel" label="1">选择模块</el-radio>-->
        <!--<el-radio v-model="ruleForm.typel" label="2">新增模块</el-radio>-->
        <!--<el-select v-model="typelTag">-->
        <!--<el-option label="default" value="1"></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="待升级版本号" prop="srcVersion" required>
          <el-input type="text" v-model="ruleForm.srcVersion"></el-input>
        </el-form-item>
        <el-form-item label="升级后版本号" prop="destVersion" required>
          <el-input type="text" v-model="ruleForm.destVersion"></el-input>
        </el-form-item>
        <el-form-item label="签名算法" required>
          <el-select v-model="ruleForm.signMethod" placeholder="请选择签名算法">
            <el-option label="Md5" value="1"></el-option>
            <el-option label="SHA256" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择固件" required>
          <el-upload
            class="upload-demo"
            action="111"
            :before-upload="beforeUpload"
            multiple
            :limit="3"
            :file-list="fileList"
            accept=".zip,.tar,.tar.gz,.gzip,.bin"
          >
            <el-button size="small">{{ uploadText }}</el-button>
            <div slot="tip" class="el-upload__tip">
              仅支持bin、tar、gz、tar.gz、zip、gzip类型的文件
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="固件描述" prop="fmDesc">
          <el-input type="textarea" v-model="ruleForm.fmDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addFmSubmit('ruleForm')"
          >确 定</el-button
        >
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { uploadFile, saveFm, getProducts, getFmType } from "@/api/fireware";
export default {
  props: {
    dialogFormVisible: {
      type: Boolean
    }
  },
  data() {
    return {
      fileList: [],
      uploadText: "点击上传",
      ruleForm: {
        fmType: 1, // 固件名称 1整包、2差分
        productId: "", // 固件所属产品id
        productName: "", // 固件所属产品名称
        type: "1", // 固件模块类型
        srcVersion: "", // 待升级版本号
        destVersion: "", // 升级后固定版本
        fmName: "", // 固件名称
        fmSign: "",
        fmSize: "",
        fmUrl: "", // url
        signMethod: "1", //签名算法 1md5 2SHA256
        fmDesc: "", // 固件描述
        fmStatus: 1,
        delFlag: 0
      },
      typelTag: "1",
      products: [],
      timeout: null,
      productForm: {
        pageNum: 1,
        pageSize: 50,
        productName: ""
      },
      productsValue: ""
    };
  },
  mounted() {
    this.getProductList();
    this.getFmType();
  },
  methods: {
    // 提交新增固件
    addFmSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveFm(this.ruleForm)
            .then(res => {
              if (res.code === 200) {
                this.$emit("changeVisible", this.dialogFormVisible);
                this.$emit("changeList", true);
                this.$refs["ruleForm"].resetFields(); // 清空弹出框校验
              } else {
                this.$message.warning(res.message);
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取固件产品类型
    getFmType() {
      getFmType().then(res => {
        console.log(res);
      });
    },
    closeDialog() {
      this.$refs["ruleForm"].resetFields(); // 清空弹出框校验
      this.$emit("changeVisible", this.dialogFormVisible);
    },
    // 上传文件
    beforeUpload(file) {
      let fromData = new FormData();
      fromData.append("file", file);
      uploadFile(fromData)
        .then(res => {
          this.ruleForm.fmUrl = res.data.fmUrl;
          this.ruleForm.fmSign = res.data.fmSign;
          this.ruleForm.fmName = res.data.fmName;
          this.ruleForm.fmSize = res.data.fmSize;
          this.uploadText = "重新上传";
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
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
      this.productForm.productName = this.productsValue.split("|")[1]
        ? this.productsValue.split("|")[1]
        : "";
      let data = this.productForm;
      getProducts(data).then(res => {
        this.products = res.data.data;
        this.userFilter();
      });
    },
    changeSelect() {
      this.ruleForm.productId = this.productsValue.split("|")[0];
      this.ruleForm.productName = this.productsValue.split("|")[1];
    }
  }
};
</script>
<style lang="scss" scoped></style>
