<template>
  <div id="basicInfo" class="mt20">
    <div class="title">
      <h5>基本资料</h5>
    </div>
    <div class="info">请完善以下信息,方便我们更好的为您服务</div>
    <el-form :model="formData" label-width="150px" :rules="rules">
      <div class="mt20 mb10">基本信息</div>
      <el-form-item label="会员身份：" prop="identity">
        {{ formData.identity }}
      </el-form-item>
      <el-form-item label="真实姓名：" prop="name">
        {{ formData.name }}
      </el-form-item>
      <div class="mt20 mb10">业务信息</div>
      <el-form-item label="主要行业应用：" prop="identity">
        <el-select />
      </el-form-item>
      <el-form-item label="主营业务：" prop="name">
        {{ formData.name }}
        <el-input placeholder="产品名" />
      </el-form-item>
      <el-form-item label="网址：">
        <el-input placeholder="www.yourwebsite.com" />
      </el-form-item>
      <div class="mt20 mb10">联系信息</div>
      <el-form-item label="国家/地区：">
        <el-input placeholder="中国" disabled />
      </el-form-item>
      <el-form-item label="所在地区：" prop="name">
        <el-select />
        <el-select />
      </el-form-item>
      <el-form-item label="街道地址：">
        <el-input />
      </el-form-item>
      <el-form-item label="街道地址2：">
        <el-input />
      </el-form-item>
      <el-form-item label="联系电话：" prop="name">
        {{ formData.name }}
        <el-input placeholder="例如：0571-88888888" />
      </el-form-item>
      <el-form-item label="传真：">
        <el-input placeholder="例如：86057188888888" />
      </el-form-item>
    </el-form>
    开发中。。。。
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        identity: '个人',
        name: '000'
      },
      rules: {
        identity: [{ required: true }],
        name: [{ required: true }]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#basicInfo {
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 12px;
  .title {
    padding: 16px 0px;
    min-height: 70px;
    // border-bottom: 1px solid #DDD;
    color: #333;
    h5 {
      display: inline-block;
      text-indent: 8px;
      border-left: 2px solid #88B7E0;
      margin-top: 0px;
      margin-top: 8px;
      margin-bottom: 8px;
      vertical-align: top
    }
  }
  .info {
    border: 1px solid transparent;
    color: #555;
    background-color: #F9F9F9;
    border-color: #DDD;
    padding: 6px 12px;
    line-height: 18px;
    margin-bottom: 6px;
  }
}
</style>
