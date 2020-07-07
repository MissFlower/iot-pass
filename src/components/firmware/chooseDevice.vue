<!--
文件作者：liuxixiu
创建日期：2020.6.17
文件说明：选择设备
 -->
<template>
    <el-dialog title="请选择设备" :visible.sync="chooseDeviceVisible" width="30%" :before-close='closeDialog' :close-on-click-modal="closeModal">
        <el-form :model="form" ref="ruleForm" label-width="120px" class="demo-ruleForm" :inline="true">
            <el-form-item>
                <el-input type="text" v-model="deviceForm.deviceName" placeholder="请输入设备名称" @keyup.enter.native="searchDev"></el-input>
            </el-form-item>
        </el-form>
        <el-table
            ref="multipleTable"
            :data="fmDeviceList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                label="deviceName"
                width="120">
                <template slot-scope="scope">{{ scope.row.deviceName }}</template>
            </el-table-column>
            <el-table-column
                prop="productKey"
                label="productKey">
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="chooseSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import { upgradeDeviceList } from '@/api/fireware'
    export default {
        props: {
            chooseDeviceVisible: {
                type: Boolean
            },
            fmDeviceList: {
                type: Array
            }
        },
        data () {
            return {
                form: {
                    name: '',
                    region: ''
                },
                deviceList: [],
                multipleSelection: [],
                deviceForm: {
                    pageNum: 1,
                    pageSize: 10,
                    deviceName: '',
                    nickName: '',
                    fmVersion: ''
                },
                deviceTotal: '',
                closeModal: false
            }
        },
        methods: {
             // 获取设备列表
            getDeviceList () {
              upgradeDeviceList(this.deviceForm).then(res => {
                    this.deviceList = res.data.data
                    this.deviceTotal = res.data.total
                })
            },
            // 搜索设备
            searchDev () {
                this.getDeviceList()
            },
            // 选择设备
            chooseSubmit () {
                let checkedDeviceList = []
                this.multipleSelection.map(item => {
                  checkedDeviceList.push(item)
                })
                this.$emit('multipleDevice', checkedDeviceList)
                this.$emit('deviceVisible', this.chooseDeviceVisible)
            },
            // 取消选中
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleDevChange () {
                this.getDeviceList()
            },
            closeDialog () {
                this.$emit('deviceVisible', this.chooseDeviceVisible)
                this.toggleSelection()
            }
        }
    }
</script>
<style lang="scss" scoped>
    .deviceDialog{
        float: right!important;
        height: 80%!important;
    }
</style>
