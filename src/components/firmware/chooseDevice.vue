<template>
    <el-dialog title="请选择设备" :visible.sync="chooseDeviceVisible" width="30%" :before-close='closeDialog'>
        <!--<el-form :model="form" ref="ruleForm" label-width="120px" class="demo-ruleForm" :inline="true">-->
            <!--<el-form-item>-->
                <!--<el-select v-model="value5" multiple placeholder="请选择">-->
                    <!--<el-option-->
                        <!--v-for="item in options"-->
                        <!--:key="item.value"-->
                        <!--:label="item.label"-->
                        <!--:value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            <!--</el-form-item>-->
            <!--<el-form-item>-->
                <!--<el-input type="text" placeholder="请输入设备名称"></el-input>-->
            <!--</el-form-item>-->
        <!--</el-form>-->
        <el-table
            ref="multipleTable"
            :data="deviceList"
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
            <el-button type="primary">确 定</el-button>
        </div>
    </el-dialog>

</template>
<script>
    import { getDeviceList } from '@/api/fireware'
    export default {
        props: {
            chooseDeviceVisible: {
                type: Boolean
            }
        },
        data () {
            return {
                form: {
                    name: '',
                    region: ''
                },
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                value5: [],
                deviceList: [],
                multipleSelection: [],
                deviceForm: {
                    pageNum: 1,
                    pageSize: 20,
                    deviceName: '',
                    nickName: '',
                    fmVersion: ''
                }
            }
        },
        mounted () {
            this.getDeviceList()
        },
        methods: {
            getDeviceList () {
                getDeviceList(this.deviceForm).then(res => {
                    this.deviceList = res.data.data
                })
            },
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
            closeDialog () {
                this.$emit('deviceVisible', this.chooseDeviceVisible)
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
