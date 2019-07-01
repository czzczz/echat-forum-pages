<template>
    <div>
        <div style="margin-top: 20px;">
            <el-row type="flex" justify="center">
                <el-col :span="5">
                    <div class="info-container"></div>
                </el-col>
                <el-col :span="10">
                    <div class="info-container">
                        <el-row type="flex" justify="space-between">
                            <el-col :span="10" :offset="2">短博</el-col>
                            <el-col :span="8">
                                <el-button size="mini" type="primary" @click="articleAdd">发布长文章</el-button>
                                <el-button size="mini" type="primary" @click="publishShortMessage">发布</el-button>
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
                        <el-row>
                            <el-col :span="22" :offset="1">
                                <div v-for="(msg, index) in userMessageData" :key="index">
                                    <message-card :user="userData"
                                                  :message="msg"
                                                  :is-owner="msg.isOwner"
                                                  :message-operation="messageOperation"
                                                  @operate="messageOperate"
                                    ></message-card>
                                </div>
                            </el-col>
                        </el-row>
                        <el-dialog title="短博详情"
                                   :width="showEdit?'80%': '50%'"
                                   :visible.sync="dialogViewMessageVisible">
                            <el-row>
                                <el-col :span="showEdit? 12: 24">
                                    <message-card :user="userData"
                                                  :message="oneMessageData"
                                                  :is-owner="oneMessageData.isOwner"
                                                  :always-show="true"
                                                  :message-operation="messageOperationCleared"
                                                  @operate="messageOperate"
                                    ></message-card>
                                </el-col>
                            </el-row>
                        </el-dialog>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="info-container"></div>
                </el-col>
            </el-row>
        </div>
<!--        <div>-->
<!--            <el-upload-->
<!--                    class="upload-demo"-->
<!--                    action="http://localhost:8088/upload/header"-->
<!--                    :limit="1">-->
<!--                <el-button size="small" type="primary">点击上传</el-button>-->
<!--            </el-upload>-->
<!--        </div>-->
    </div>
</template>

<script>
    import '../collections/Messages';
    import MessageCard from '../components/MessageCard';
    import axios from 'axios';
    import _ from 'lodash';

    export default {
        name: "Mainpage",

        components: {
            MessageCard
        },

        mounted() {
        },

        data() {
            return {
                shortMessage: {
                    content: '',
                    tags: [],
                },

                inputVisible: false,
                tagValue: '',

                messageOperation: {
                    owner: [
                        {
                            value: 'view',
                            label: '详情'
                        },
                        {
                            value: 'share',
                            label: '分享'
                        },


                        {
                            value: 'edit',
                            label: '编辑'
                        },
                        {
                            value: 'delete',
                            label: '删除'
                        }
                    ],
                    visitor: [
                        {
                            value: 'view',
                            label: '详情'
                        },
                        {
                            value: 'share',
                            label: '分享'
                        },


                        {
                            value: 'follow',
                            label: '关注'
                        },
                        {
                            value: 'de-follow',
                            label: '取消关注'
                        },
                        {
                            value: 'report',
                            label: '举报'
                        }
                    ],
                },

                messageOperatedId: '',

                dialogViewMessageVisible: false,
            };
        },

        computed: {
            userData() {
                return this.UserCursor? this.UserCursor.profile: {};
            },
            userMessageData() {
                return _.orderBy(this.MessagesCursor, ['createdAt'], ['desc']);
            },
            oneMessageData() {
                if(this.messageOperatedId && this.$subReady.Messages) {
                    return this.OneMessageCursor;
                }
                else return {};
            },
            messageOperationCleared() {
                const res = {};
                _.keys(this.messageOperation).forEach( key => {
                    res[key] = [];
                    this.messageOperation[key].forEach( item => {
                        if(item.value !== 'view') res[key].push(item);
                    });
                });
                // console.log(res);
                return res;
            },
        },

        methods: {
            articleAdd() {
                this.$router.push({path: '/article/add'});
            },
            publishShortMessage() {
                if(!this.shortMessage.content) this.$message('请输入要发布的消息内容！');
                else {
                    Meteor.call('message.publish', this.shortMessage, sessionStorage.getItem('login-user-id'), (error, msgId) => {
                        if(error) console.log(error);
                        else {
                            Meteor.call('user.addMessage', sessionStorage.getItem('login-user-id'), msgId, (error) => {
                                if(error) console.log(error);
                                else {
                                    this.$message({
                                        message: '消息已发布',
                                        type: 'success'
                                    });
                                    this.cleanUp();
                                }
                            });
                        }
                    });
                }
            },
            cleanUp() {
                this.shortMessage.content = '';
                this.shortMessage.tags = [];
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
                        user: sessionStorage.getItem('login-user-id'),
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
            // 操作
            messageOperate(operationName, msgId) {
                console.log(operationName, msgId);
                if(operationName === 'view' || operationName === 'bodyClick') this.viewMessage(msgId);
                else if(operationName === 'share') {}

                else if(operationName === 'edit') this.editMessage(msgId);
                else if(operationName === 'delete') this.deleteMessage(msgId);

                else if(operationName === 'follow') {}
                else if(operationName === 'de-follow') {}
                else if(operationName === 'report') {}
                else console.log('操作出错');
            },
            viewMessage(id) {
                this.messageOperatedId = id;
                this.dialogViewMessageVisible = true;
            },
            editMessage(id) {
                this.$router.push(`/message-edit/${id}`);
            },
            deleteMessage(id) {
                this.$confirm('即将删除这条消息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Meteor.call('user.dropMessage', sessionStorage.getItem('login-user-id'), id, err => {
                        if(err) console.log(err);
                        else {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消删除'
                    });
                });
            },
        },

        meteor: {
            $subscribe: {
                Messages: []
            },

            UserCursor() {
                if(!this.$route.params.userId) {
                    return Meteor.user()? Meteor.user(): Meteor.users.findOne({_id: sessionStorage.getItem('login-user-id')});
                }
                else {
                    return Meteor.users.findOne({_id: this.$route.params.userId});
                }
            },

            MessagesCursor() {
                if (this.UserCursor && this.UserCursor.profile && this.UserCursor.profile.messages) {
                    const messagesList = [];
                    this.UserCursor.profile.messages.forEach( message => {
                        // console.log('message', Messages.findOne({_id: message}));
                        messagesList.push({
                            ...Messages.findOne({_id: message}),
                            isOwner: true
                        });
                    });
                    return messagesList;
                }
                else return [];
            },
            OneMessageCursor() {
                const msg = Messages.findOne({_id: this.messageOperatedId});
                if(!msg) return {};
                if(msg.user === sessionStorage.getItem('login-user-id')) return {
                    ...msg,
                    isOwner: true
                };
                else return {
                    ...msg,
                    isOwner: false
                };
            },
        }
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
    .article-container {
        /*width: calc(41.66667% - 40px + 17px);*/
        width: calc(100% + 17px);
    }
</style>
