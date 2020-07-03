<!-- 
文件作者：wengyoubin
创建日期：2020.6.17
文件说明：新建设备
 -->
<template>
  <el-dialog
    title="批量添加设备"
    :visible.sync="dialogVisible"
    width="500px"
    @close="handleClose"
    v-loading="loading"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="产品：" prop="productSelIndex">
        <el-select class="wp100" v-model="ruleForm.productSelIndex" placeholder="请选择产品" :disabled="selectDisabled">
          <el-option
            v-for="(item,index) in productList"
            :key="index"
            :label="item.productName"
            :value="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备数量：" prop="deviceCount">
        <el-input v-model="ruleForm.deviceCount" placeholder="请输入设备数量" oninput="value=value.replace(/[^\d]/g,'');value=parseInt(value)>1000?'1000':value;"></el-input>
      </el-form-item>
      <el-form-item class="mt20 tr" style="margin-bottom:0;">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { productList,batchCreateDevice } from "@/api/deviceRequest";
export default {
  props: {
    appointProduck: {
      default: {}
    }
  },
  data() {

    const validatorDeviceCount = (rule, value, callback) => {
      if (parseInt(value)<1) {
        callback(new Error('设备数量必须大于0'))
      } else {
        callback()
      }
    }

    return {
      dialogVisible: true,
      productList: [],
      selectDisabled: false,
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
        deviceCount: [
          { required: true, message: '请输入设备数量', trigger: 'blur' },
          { required: true, validator: validatorDeviceCount, trigger: 'change' }
        ]
      }
    };
  },
  mounted() {
    if(this.appointProduck.productName == '全部产品'){
      this.getProductList();
    }else{
      this.selectDisabled = true;
      this.ruleForm.productSelIndex = this.appointProduck.productName;
    }
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
      var productObj;
      if(this.appointProduck.productName == '全部产品'){
        productObj = this.productList[this.ruleForm.productSelIndex];
      }else{
        productObj = this.appointProduck;
      }
      
      batchCreateDevice({
        productKey: productObj.productKey,
        count: this.ruleForm.deviceCount,
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
