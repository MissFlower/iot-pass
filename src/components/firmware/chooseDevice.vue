<!--
文件作者：liuxixiu
创建日期：2020.6.17
文件说明：选择设备
 -->
<template>
    <el-dialog title="请选择设备" :visible.sync="visible" width="30%" @close="close" :close-on-click-modal="false">
        <el-form :model="form" ref="ruleForm" label-width="120px" class="demo-ruleForm" :inline="true">
            <el-form-item>
                <el-input type="text" v-model="deviceForm.deviceName" placeholder="请输入设备名称"></el-input>
            </el-form-item>
        </el-form>
        <el-table
            ref="multipleTable"
            :data="list"
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
    // import { upgradeDeviceList } from '@/api/fireware'
    export default {
        props: {
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
                list: [],
                visible: true
            }
        },
        watch: {
            'deviceForm.deviceName': function () {
                this.listFilterFun()
            },
            'fmDeviceList': function () {
                this.listFilterFun()
            }
        },
        mounted () {
            this.list = this.fmDeviceList
            this.listFilterFun()
        },
        methods: {
            listFilterFun () {
                let list = []
                if (this.fmDeviceList && this.fmDeviceList.length > 0) {
                     list = this.fmDeviceList.filter(data => {
                         return !this.deviceForm.deviceName || data.deviceName.toLowerCase().includes(this.deviceForm.deviceName.toLowerCase())
                     })
                }
                this.list = list
            },
            // 选择设备
            chooseSubmit () {
                let checkedDeviceList = []
                this.multipleSelection.map(item => {
                  checkedDeviceList.push(item)
                })
                this.$emit('multipleDevice', checkedDeviceList)
                this.$emit('deviceVisible')
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 取消选中
            closeDialog () {
                this.$refs.multipleTable.clearSelection();
            },
            close () {
               this.$emit('deviceVisible') 
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
