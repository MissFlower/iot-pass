<!-- 
文件作者：mawenjuan
创建日期：2020.6.23
文件说明：选择参数类型的组件
 -->

<template>
  <div id="dataSelectPart">
    <el-form ref="dataSelectPartForm" :model="formData" :rules="rules">
      <el-form-item label="数据类型" prop="type">
        <el-select v-model="formData.type" @change="handleChange" :disabled="info ? true : false">
          <el-option v-for="(item, index) in dataTypeArr" :key="index" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <div v-if="formData.type == '0' || formData.type == '1' || formData.type == '2'">
        <div><span class="red mr5">*</span>取值范围</div>
        <div class="df ai_c mt10">
          <el-form-item prop="min">
            <el-input v-model="formData.specs.min" placeholder="最小值" class="w150 mr10" @input="rangeValueFun"></el-input>
            <span class="mr10">~</span>
          </el-form-item>
          <el-form-item prop="max">
            <el-input v-model="formData.specs.max" placeholder="最大值" class="w150" @input="rangeValueFun"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="步长" prop="step">
          <el-input v-model="formData.specs.step" placeholder="请输入步长"></el-input>
        </el-form-item>
        <el-form-item label="单位" placeholder="请选择单位">
          <el-select v-model="formData.specs.unit" filterable>
            <el-option v-for="item in unitArr" :key="item.symbol" :value="item.symbol" :label="`${item.name} /${item.symbol}`"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div v-if="formData.type == '3'" class="mb10">
        <div><span class="red mr5">*</span>枚举项</div>
        <div class="df mt10 mb10">
          <div class="flex1">
            参数值
            <el-tooltip>
              <i class="el-icon-question c9"></i>
              <div slot="content" class="f12 c9 w200">支持整型，取值范围：-2147483648 ~ 2147483647</div>
            </el-tooltip>
          </div>
          <div class="flex1">
            参数描述
            <el-tooltip>
              <i class="el-icon-question c9"></i>
              <div slot="content" class="f12 c9 w200">支持中文、英文大小写、数字下划线和短划线，必须以中文、英文或数字开头，不超过20个字符</div>
            </el-tooltip>
          </div>
        </div>
        <div v-for="(item, index) in enumArr" :key="index" class="df enumItem">
          <el-form-item class="flex1">
            <el-input v-model="item.key" placeholder="编号如’0‘" class="w150 mr10" @input="enumKeyChange(index)"></el-input>
            <span class="mr10">~</span>
            <div class="red f12 lh14 pr20" v-if="item.errorKey">{{item.errorKey}}</div>
          </el-form-item>
          <el-form-item class="flex1">
            <el-input v-model="item.desc" placeholder="对该枚举项的描述" class="w150" @input="enumDescChange(index)"></el-input>
            <el-button type="text" v-if="enumArr.length > 1" class="ml2 hand" @click="delectEnum(index)">删除</el-button>
            <div class="red f12 lh14 pr20" v-if="item.errorDesc">{{item.errorDesc}}</div>
          </el-form-item>
        </div>
        <span @click="addEnumItem" class="blue f12"><i class="el-icon-plus mr10"></i>添加枚举项</span>
      </div>
      <div v-if="formData.type == '4'">
        <div class="mb10"><span class="red mr5">*</span>布尔值</div>
        <el-form-item prop="bool0">
          <span class="dib w30 tc">0 -</span>
          <el-input v-model="boolObj[0]" placeholder="如：关" class="ml20" style="width: calc(100% - 50px)"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="dib w30 tc">1 -</span>
          <el-input v-model="boolObj[1]" placeholder="如：开" class="ml20" style="width: calc(100% - 50px)"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="数据长度" v-if="formData.type == '5'">
        <el-input placeholder="请输入内容" v-model="text">
          <template slot="append">字节</template>
        </el-input>
      </el-form-item>
      <el-form-item label="时间格式" v-if="formData.type == '6'">
        <el-input disabled v-model="dataText"></el-input>
      </el-form-item>
      <el-form-item label="JSON对象：" v-if="formData.type == '7'">
        <div v-for="(item, index) in formData.specs" :key="index" class="df ai_c json_item">
          <div class="flex1">参数名称： {{item.name}}</div>
          <div>
            <el-link type="primary" :underline="false" class="f12 mr10" disabled>编辑</el-link>
            <el-link type="primary" :underline="false" class="f12" disabled>删除</el-link>
          </div>
        </div>
        <el-button type="text" icon="el-icon-plus" @click="addStruct">新增参数</el-button>
      </el-form-item>
      <div v-if="formData.type == '8'">
        <el-form-item label="元素类型">
          <el-radio-group v-model="arrObj.type">
            <el-radio v-for="(item, index) in arrTypes" :key="index" :label="item.value">{{item.text}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="元素个数">
          <el-input v-model="arrObj.num" placeholder="请输入元素个数"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <add-param v-if="flag == 1" :specs="formData.specs" :info="structInfo" @success="successAddParams" @close="clodeAddParams"></add-param>
  </div>
</template>

<script>
import addParam from "@/views/model/children/addParam"
import units from "@/data/unit"
export default {
  name: 'DatatypeSelectpart',
  components: {addParam},
  props: ['type', 'info', 'specs'],
  data () {
    const validateValueRangeMin = (rule, value, callback) => {
      let str = this.numMinMaxDealFun(this.formData.specs.min)
      if (str) {
        callback(new Error(str))
      } else {
        callback()
      }
    }
    const validateValueRangeMax = (rule, value, callback) => {
      let str = this.numMinMaxDealFun(this.formData.specs.max)
      if (str) {
        callback(new Error(str))
      } else {
        callback()
      }
    }
    const validateStep = (rule, value, callback) => {
      if (this.formData.specs.step === '') {
        callback(new Error('步长不能为空'))
      } else {
        callback()
      }
    }
    const validateBool0 = (rule, value, callback) => {
      if (this.boolObj[0] === '') {
        callback(new Error('布尔值不能为空'))
      } else {
        // 布尔值支持中文、英文字母、数字和下划线，第一位不能为下划线
        callback()
      }
    }
    return {
      formData: {
        type: '0',
        specs: {
          unit: '',
          step: '',
          max: '',
          min: ''
        }
      },
      enumArr: [],
      boolObj: {
        '1': '',
        '0': ''
      },
      text: '',
      dataText: 'String类型的UTC时间戳（毫秒）',
      arrObj: {
        type: '1',
        num: 10
      },
      dataTypeArr: [
        {
          value: '0',
          label: 'int32 (整数型)'
        }, {
          value: '1',
          label: 'float (单精度浮点型)'
        }, {
          value: '2',
          label: 'double (双精度浮点型)'
        }, {
          value: '3',
          label: 'enum (枚举型)'
        }, {
          value: '4',
          label: 'bool (布尔型)'
        }, {
          value: '5',
          label: 'text (字符串)'
        }, {
          value: '6',
          label: 'date (时间型)'
        }, {
          value: '7',
          label: 'struct (结构体)'
        }, {
          value: '8',
          label: 'array (数组)'
        }
      ],
      arrTypes: [
        {
          value: '0',
          text: 'int32'
        }, {
          value: '1',
          text: 'float'
        }, {
          value: '2',
          text: 'double'
        }, {
          value: '5',
          text: 'text'
        }, {
          value: '7',
          text: 'struct'
        }
      ],
      flag: 0, // 新增参数的标记
      structInfo: null, // 编辑新增参数
      rules: {
        type: [
          {required: true, message: "数据类型不能为空", trigger: 'change' }
        ],
        min: [
          { required: true, validator: validateValueRangeMin, trigger: 'change' },
        ],
        max: [
          { required: true, validator: validateValueRangeMax, trigger: 'change' },
        ],
        step: [
          {required: true, validator: validateStep, trigger: 'change' }
        ],
        bool0: [
          {required: true, validator: validateBool0, trigger: 'change'}
        ]
      },
      unitArr: units
    }
  },
  mounted () {
    if (this.type) {
      this.dataTypeArr.forEach(item => {
        if (item.value === '7' || item.value === '8') {
          item.hidden = true
        }
      })
      this.dataTypeArr = this.dataTypeArr.filter(item => {
        return !item.hidden
      })
    }
  },
  methods: {
    // 最大、小值的验证
    numMinMaxDealFun (value) {
      let str = ''
      let val = null
      switch (this.formData.type) {
        case '0':
          val = 2147483648
          if (value === '') {
            str = '不能为空'
          }else if (this.formData.specs.max && this.formData.specs.min && (this.formData.specs.min > this.formData.specs.max)) {
            str = "最大值必须大于最小值，整数型不能有小数位，单精度有效位为7，双精度为16"
          } else if (value > -val && value < val) {
            str = ''
          } else {
            str = `取值范围：-${val} ~ ${val}`
          }
          break
        case '1':
          val = '2^128'
          if (this.formData.specs.max && this.formData.specs.min && (this.formData.specs.min > this.formData.specs.max)) {
            str = "最大值必须大于最小值，整数型不能有小数位，单精度有效位为7，双精度为16"
          } else if (value > -(Math.pow(2, 128)) && value < Math.pow(2, 128)) {
            str = ''
          } else {
            str = `取值范围：-${val} ~ ${val}`
          }
          break
        case '2':
          val = 64
          if (value.length > val) {
            str = 'double类型支持最大位数为64'
          } else {
            str = ''
          }
          break
      }
      return str
    },
    // 最大、小值的监控函数
    rangeValueFun (newVal) {
      let value = newVal
      if (this.formData.type === '0') {
        value = newVal.replace(/\./g, '')
      } else {
        value = newVal.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".")
        let len = 7
        if (this.formData.type === '1') {
          len = 7
        } else {
          len = 16
        }
        const arr = value.split('.')
        if (arr.length > 1 && arr[1].length > len) {
          arr[1] = arr[1].substring(0, len)
          value = arr.join('.')
        }
      }
      return value
    },
    handleChange () { // 选择数据类型
      switch(this.formData.type) {
        case '0':
        case '1':
        case '2':
          this.formData.specs = {
            unit: '',
            step: '',
            max: '',
            min: ''
          }
          break
        case '3':
          this.enumArr = []
          this.formData.specs = {}
          this.addEnumItem()
          break
        case '4':
          this.boolObj = {
            '0': '',
            '1': ''
          }
          break
        case '5':
          this.text = 2048
          break
        case '7':
          this.formData.specs = []
          break
      }
    },
    // 添加枚举项
    addEnumItem() {
      this.enumArr.push({
        key: '',
        desc: '',
        errorKey: '',
        errorMenu: ''
      })
      this.$forceUpdate()
    },
    // 显示新增参数的弹框
    addStruct () {
      this.flag = 1
    },
    // 枚举项 key值得监控函数  验证信息的显示
    enumKeyChange (index) {
      const row = this.enumArr[index]
      const enumKey = row.key
      if (enumKey === '') {
        row.errorKey = '参数值不能为空'
      } else {
        if (!Number.isInteger(enumKey * 1)) {
          row.errorKey =  '支持整型，取值范围：-2147483648 ~ 2147483647'
        } else if (enumKey < -2147483648 || enumKey > 2147483648) {
          row.errorKey =  '支持整型，取值范围：-2147483648 ~ 2147483647'
        } else {
          row.errorKey = ''
        }
      }
      this.$forceUpdate()
    },
    // 枚举项 描述值得监控函数  验证信息的显示
    enumDescChange (index) {
      const row = this.enumArr[index]
      const enumDesc = row.desc
      if (enumDesc === '') {
        row.errorDesc = '参数描述不能为空'
      } else if (enumDesc.length > 20) {
        row.errorDesc = '支持中文、英文大小写、数字下划线和短划线，必须以中文、英文或数字开头，不超过20个字符'
      } else {
        row.errorDesc = ''
      }
    },
    // 删除枚举项
    delectEnum(index) {
      this.enumArr.splice(index, 1)
    },
    successAddParams (data) { // 新增参数的成功的返回函数
      if (data) {
        this.formData.specs.push(data)
      }
    },
    // 新增参数弹框的close函数
    clodeAddParams () {
      this.flag = 0
      console.log(this.flag)
    },
    // 返回数据到父级，为父级组件调用
    getDataForParent () {
      this.$refs.dataSelectPartForm.validate(valid => {
        if (valid) {
          switch (this.formData.type) {
            case '3':
              this.enumArr.forEach(item => {
                this.formData.specs[item.key] = item.desc
              })
              break
            case '4':
              this.formData.specs = this.boolObj
              break
            case '5':
              this.formData.specs = {
                length: this.text
              }
              break
            case '7':
              // this.formData.specs = []
              break
            case '8':
              this.formData.specs = {
                size: this.arrObj.num,
                item: {
                  type: this.arrObj.type
                }
              }
          }
          this.$emit('success', this.formData)
        } else {
          this.$emit('success', null)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#dataSelectPart {
  .el-radio {
    margin-right: 10px;
  }
  .enumItem {
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
      margin-bottom: 10px;
    }
  }
  .json_item {
    background: #e3f2fd;
    padding: 0 8px;
    margin-bottom: 8px;
    color: #555;
    font-size: 12px;
  }
}
</style>