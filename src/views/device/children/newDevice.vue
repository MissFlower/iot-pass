<!-- 
文件作者：wengyoubin
创建日期：2020.6.17
文件说明：新建设备
 -->
<template>
  <el-dialog
    title="新建设备"
    :visible.sync="dialogVisible"
    width="500px"
    @close="handleClose"
    v-loading="loading"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="产品：" prop="productSelIndex">
        <el-select class="wp100" v-model="ruleForm.productSelIndex" placeholder="请选择产品">
          <el-option
            v-for="(item,index) in productList"
            :key="index"
            :label="item.productName"
            :value="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备名称：" prop="deviceName">
        <el-input v-model="ruleForm.deviceName" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item label="备注名称：" prop="nickName">
        <el-input v-model="ruleForm.nickName" placeholder="请输入备注名称"></el-input>
      </el-form-item>
      <el-form-item class="mt20 tr" style="margin-bottom:0;">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { productList,createDevice } from "@/api/deviceRequest";
export default {
  data() {
    return {
      dialogVisible: true,
      productList: [],
      loading: false,
      ruleForm:{
        productSelIndex: null,
        deviceName: '',
        nickName: '',
      },
      rules: {
        productSelIndex: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ],
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入备注名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    this.getProductList();
  },

  methods: {

    //获取产品列表
    getProductList(){
      productList({
        pageNum: 1,
        pageSize: 100,
        productName: ''
      })
      .then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.productList = res.data.data;
          }
        }
      })
      .catch(() => {
      });
    },


    //取消
    handleCancel() {
      this.$parent.newDeviceClose();
    },

    //验证所填信息
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleSave();
        } else {
          return false;
        }
      });
    },

    //保存
    handleSave() {
      this.loading = true;
      var productObj = this.productList[this.ruleForm.productSelIndex];
      
      createDevice({
        productId: productObj.id,
        productKey: productObj.productKey,
        deviceName: this.ruleForm.deviceName,
        nickName: this.ruleForm.nickName,
      })
        .then(res => {
          this.loading = false;
          if (res.code === 200) {
            this.$parent.newDeviceClose(true);
          }
          this.$message({
            type: res.code == 200?"success":'warning',
            message: res.message
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },

    //窗口关闭
    handleClose() {
      this.handleCancel();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
