<!--
  文件作者：mawenjuan
  创建日期：2020.6.17
  文件说明：菜单的详情、编辑、创建页面
 -->
<template>
  <el-dialog id="menu_right_con" :visible.sync="dialogVisible" :title="`${activeItem ? '编辑' : '创建'}菜单`" :close-on-click-modal="false" @closed="close">
    <el-form ref="form" :model="info" label-width="100px" class="mb20" :rules="rules" v-loading="loading">
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="info.name" placeholder="请输入菜单名称" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="菜单编号" prop="code">
        <el-input v-model="info.code" placeholder="请输入菜单编号" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="上层菜单" prop="pid">
        <el-cascader
          ref="cascader"
          v-model="info.pid"
          :options="list"
          :props="cascaderProps"
          placeholder="请选择上层菜单"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="请求地址" prop="url">
        <el-input v-model="info.url" placeholder="请输入请求地址" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="菜单标记" prop="menuFlag">
        <el-radio-group v-model="info.menuFlag">
          <el-radio label="Y">是</el-radio>
          <el-radio label="N">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图标">
        <icon-select-con :icon="info.icon" @select="selectIcon" @changeShowFlag="changeShowFlag"></icon-select-con>
      </el-form-item>
      <el-form-item label="菜单排序" prop="sort" v-if="info.menuFlag == 'Y'">
        <el-input v-model="info.sort" placeholder="请输入菜单排序" class="w200"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="tr">
      <el-button :disabled="show || loading" @click.stop="close">取消</el-button>
      <el-button type="primary" :disabled="show || loading" @click.stop="handleSave">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import iconSelectCon from './selectIocn'
import { createMenu, updateMenu, getMenuList } from '@/api/menu'
import { dealFun } from '@/data/fun'
export default {
  components: { iconSelectCon },
  props: {
    activeItem: {
      type: Object,
      default: () => {}
    }
  },
  inject: ['reload'],
  data() {
    const validateSort = (rule, value, callback) => {
      const reg = /^\d+$/
      if (!reg.test(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value < 0) {
          callback(new Error('必须大于0'))
        } else {
          callback()
        }
      }
    }
    return {
      loading: false,
      dialogVisible: true,
      list: [],
      cascaderProps: {
        label: 'name',
        value: 'menuId',
        checkStrictly: true
      },
      createRow: {
        name: '',
        code: '',
        pid: '',
        pcodeName: '',
        menuFlag: 'Y',
        url: '',
        icon: '',
        frontPath: '',
        sort: ''
      },
      info: {
        menuFlag: 'Y'
      },
      rules: {
        name: [{ required: true, message: '请输入菜单', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        pid: [{ required: true, message: '请选择上级菜单', trigger: 'blur' }],
        menuFlag: [
          { required: true, message: '请选择菜单标记', trigger: 'blur' }
        ],
        url: [{ required: true, message: '请输入请求地址', trigger: 'blur' }],
        sort: [
          { required: true, message: '请输入菜单排序', trigger: 'blur' },
          { validator: validateSort, trigger: 'change' }
        ]
      },
      menuObj: null,
      show: false // 判断选择图标的弹框是否弹出
    }
  },
  watch: {
    activeItem: function() {
      this.into()
    }
  },
  mounted() {
    this.into()
  },
  methods: {
    into() { // 初始函数  加载全部
      this.loading = true
      this.list = []
      this.menuObj = {}
      getMenuList({
        pageNum: 1,
        pageSize: 1000
      }).then(res => {
        if (res.code === 200) {
          if (res.data.data) {
            // const listData = res.data.data
            if (res.data.data.length > 0) {
              // 处理返回父级菜单数组
              res.data.data.forEach(item => {
                this.menuObj[item.code] = item.menuId
                if (item.menuFlag === 'N') {
                  item.disabled = true
                } else if (this.activeItem && this.activeItem.pcodes) {
                  // let str = `[${item.pcode}]`
                  // let pcodes = this.activeItem.pcodes.split(',')
                  // if (pcodes.length > 2 && pcodes[pcodes.length - 2] === str) {
                  //   item.disabled = true
                  // }
                }
              })
            }
            this.list = dealFun(res.data.data)
            this.info = JSON.parse(JSON.stringify(this.createRow))
            if (this.activeItem) {
              this.info.menuId = null
              for (const key in this.info) {
                this.info[key] = this.activeItem[key]
              }
              this.info.pid = this.findMenuIds(this.activeItem.pcodes)
              this.info.sort = this.info.sort !== '' ? this.info.sort * 1 : this.info.sort
            } else {
              if (this.list && this.list.length > 0) {
                this.info.pid = this.findMenuIds(`[0],[${this.list[0].code}],`)
              }
              this.info.sort = 0
            }
          }
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(() => {
        this.$message.error('菜单获取失败')
        this.loading = false
      })
    },
    // 菜单的code换成菜单ID
    findMenuIds(codes) {
      let pcodes = codes
      if (pcodes) {
        const arr = pcodes.split(',')
        pcodes = arr.map(item => {
          const str = item.replace(/\[|\]/g, '')
          return item ? str : ''
        })
        pcodes.splice(pcodes.length - 1, 1)
        pcodes.splice(0, 1)
      }
      const arr = []
      if (pcodes && pcodes.length > 0) {
        pcodes.forEach(code => {
          arr.push(this.menuObj[code])
        })
      }
      return arr
    },
    handleSave() { // 保存函数
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.loading = true
        let promise = null
        let str = ''
        // 根据父组件传入的值 确认是创建还是编辑
        const row = JSON.parse(JSON.stringify(this.info))
        row.pid = this.info.pid[this.info.pid.length - 1]
        const nodes = this.$refs.cascader.getCheckedNodes()
        row.pcodeName = nodes[0].data.name
        if (this.info.menuId) {
        // 编辑
          promise = updateMenu
          str = '编辑'
        } else {
          promise = createMenu
          str = '创建'
          const nodes = this.$refs.cascader.getCheckedNodes()
          row.pcodeName = nodes[0].data.name
        }
        promise(row)
        .then(res => {
          if (res.code === 200) {
            this.$message.success(`菜单${str}成功`)
            this.reload(1) // 更新页面路由
            this.$emit('success')
          } else {
            this.$message.error(res.message)
          }
          this.loading = false
        })
        .catch(() => {
          this.$message.error(`菜单${str}失败`)
          this.loading = false
        })
      })
    },
    close() {
      this.$parent.showCon(1)
      this.dialogVisible = true
    },
    selectIcon(icon) { // icon选择成功
      this.info.icon = icon
    },
    changeShowFlag(bool) {
      this.show = bool
    }
  }
}
</script>

<style lang="scss">
#menu_right_con .el-form-item--small.el-form-item {
  display: inline-block;
  width: 50%;
}
#menu_right_con .el-form {
  min-height: 240px;
}
</style>
