<template>
    <div>
        <div style="margin-top: 20px;">
            <el-row type="flex" justify="center">
                <el-col :span="10">
                    <div class="info-container">
                        <el-row type="flex" justify="space-between">
                            <el-col :span="10" :offset="2">编辑短博</el-col>
                            <el-col :span="4">
                                <el-button size="mini" @click="cancelAndReturn">取消</el-button>
                                <el-button size="mini" type="primary" @click="updateShortMessage">发布</el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20" :offset="2">
                                <el-input
                                        type="textarea"
                                        :autosize="{minRows: 2, maxRows: 5}"
                                        maxlength="150"
                                        show-word-limit
                                        placeholder="请输入内容"
                                        v-model="shortMessage.content">
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22" :offset="1" style="margin-bottom: 10px;">标签：</el-col>
                            <el-col :span="20" :offset="2">
                                <el-tag

                                        v-for="(tag, index) in shortMessage.tags"
                                        :key="index"
                                        closable
                                        :disable-transitions="false"
                                        size="small"
                                        @close="handleClose(tag)">
                                    {{tag.value}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="inputVisible"
                                        v-model="tagValue"
                                        ref="saveTagInput"
                                        size="mini"
                                        @keyup.enter.native="tagInputConfirm"
                                        @blur="tagInputConfirm"
                                ></el-input>
                                <el-button v-else class="button-new-tag" size="mini" @click="showInput">添加标签</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "MessageEdit",

        mounted() {
            if(!Meteor.userId()) {
                this.$router.push({path: '/login'});
            }
        },

        updated() {

        },

        data() {
            return {
                getContent: false,
                shortMessage: {
                    content: '',
                    tags: [],
                },

                inputVisible: false,
                tagValue: '',
            };
        },

        methods: {
            cancelAndReturn() {
                this.$confirm('即将放弃编辑并返回之前页面, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.go(-1);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            updateShortMessage() {
                const msg = this.shortMessage;
                const old = this.getMessage;
                console.log('old msg', old);
                console.log('new message', msg);
                axios.post(`${Meteor.settings.public.serviceUrl}/message/update`, {
                    id: old._id,
                    newMessage: msg
                }).then( res => {
                    console.log(res);
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.$router.go(-1);
                }).catch( err => {
                    console.log(err);
                    this.$message.error({
                        message: '修改失败',
                    });
                });
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick( _ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            tagInputConfirm() {
                if(this.tagValue.length >= 20) this.$message('标签长度不可长于20字！');
                else if (this.tagValue) {
                    this.shortMessage.tags.push({
                        value: this.tagValue,
                        agree: 1,
                        disagree: 0,
                        owner: sessionStorage.getItem('login-user-id'),
                    });
                    this.inputVisible = false;
                    this.tagValue = '';
                }
                else {
                    this.inputVisible = false;
                }
            },
            handleClose(tag) {
                const list = [];
                this.shortMessage.tags.forEach( item => {
                    if(item.value !== tag.value) list.push(item);
                });
                this.shortMessage.tags = list;
            },
        },

        computed: {
        },

        meteor: {
            $subscribe: {
                Messages: [],
            },

            getMessage() {
                const msg = Messages.findOne({_id: this.$route.params.msgId});
                if(!msg) return {};
                if(!this.getContent) {
                    this.shortMessage = msg;
                    this.getContent = true;
                    console.log(this.shortMessage);
                }
                return msg;
            },
        },
    }
</script>

<style scoped>

    .info-container {
        margin: 10px 10px 0 10px;
        padding: 20px 20px 0 20px;
        border-radius: 15px;
        background-color: white;
        /*height: 1000px;*/
    }
    .info-container .el-row {
        margin-top: 20px;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
