<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="10">
                <ou-persona size="sm"
                            :src="upUserData.headerImage"
                            :primaryText="upUserData.nickname"
                            :secondaryText="upUserData.email"/>
            </el-col>
            <el-col :span="1">
                <el-popover
                        placement="right"
                        width="50"
                        v-model="optionPopoverVisible">
                    <div slot="reference" @click.stop.native="showMessageOption">
                        <i class="el-icon-arrow-down"></i>
                    </div>
                    <div class="option-list">
                        <div
                                v-for="(opt, idx) in messageOperationData"
                                :key="idx"
                                class="option">
                            <el-button size="mini" type="text" @click="messageOperate(opt.value)">{{opt.label}}</el-button>
                        </div>
                    </div>
                </el-popover>
            </el-col>
        </el-row>
        <el-row @dblclick.native="messageOperate('bodyClick')">
            <el-col style="margin-top: 10px; margin-bottom: 20px;">
                <p>{{messageContent}}</p>
            </el-col>
            <el-col style="margin-bottom: 20px;" v-if="hasTag">标签：
                <el-tag
                        v-for="(tag, index) in message.tags"
                        :key="index"
                        :disable-transitions="false"
                        size="small">
                    {{tag.value}}
                </el-tag>
            </el-col>
        </el-row>
        <el-row type="flex"
                align="bottom"
                justify="space-between"
                style="border-top: 1px solid #ebe8f1;
                                   margin-bottom: 30px;
                                   font-size: 12px;">
            <el-col :span="8">
                <span>{{updateTimeData}}</span>
            </el-col>
            <el-col :span="6" style="font-size: 20px;" class="quick-operate">
                <div>
                    <font-awesome-icon :icon="['far', 'thumbs-up']" class="awesome"></font-awesome-icon>
                </div>
                <div @click="showComments">
                    <font-awesome-icon :icon="['far', 'comment-dots']" class="awesome"></font-awesome-icon>
                </div>
                <div>
                    <font-awesome-icon :icon="['fas', 'share']" class="awesome"></font-awesome-icon>
                </div>
            </el-col>
        </el-row>
        <el-row v-if="commentsVisible || alwaysShow" style="margin-bottom: 30px">
            <el-col>
                <comments :msg-id="message._id" :always-show="alwaysShow"></comments>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import moment from 'moment';
    import Comments from '../components/Comments';

    export default {
        name: "MessageCard",
        props: ['message', 'is-owner', 'is-followed', 'message-operation', 'alwaysShow'],

        components: {
            'comments': Comments,
        },

        data() {
            return {
                optionPopoverVisible: false,
                commentsVisible: false,
            };
        },

        methods: {
            showMessageOption() {
                this.optionPopoverVisible = true;
            },
            messageOperate(value) {
                this.$emit('operate', value, this.message._id);
                this.optionPopoverVisible = false;
            },
            showComments() {
                console.log('show comments');
                this.commentsVisible = !this.commentsVisible;
            },
        },


        computed: {
            hasTag() {
                return this.message.tags && this.message.tags.length && this.message.tags.length !== 0;
            },
            messageContent() {
                return this.message && this.message.content? this.message.content: '';
            },
            hasEdit() {
                const msg = this.message;
                return msg.createdAt === msg.updatedAt;
            },

            upUserData() {
                // console.log('up user', this.message.user, this.UpUserCursor);
                if(this.UpUserCursor && this.UpUserCursor.profile) {
                    return this.UpUserCursor.profile;
                }
                return {};
            },
            updateTimeData() {
                const msg = this.message;
                let res = '';
                if(!msg) return '';
                if(this.hasEdit) {
                    res = '创建于 ' + moment(msg.createdAt).format('YYYY-MM-DD HH:mm:ss');
                }
                else {
                    res = '最后更新于 ' + moment(msg.updatedAt).format('YYYY-MM-DD HH:mm:ss');
                }
                return res;
            },
            messageOperationData() {
                if(this.isOwner) return this.messageOperation.owner;
                else {
                    const res = [];
                    if(this.isFollowed) {
                        this.messageOperation.visitor.forEach( ope => {
                            if(ope.value !== 'follow') res.push(ope);
                        });
                    }
                    else {
                        this.messageOperation.visitor.forEach( ope => {
                            if(ope.value !== 'de-follow') res.push(ope);
                        });
                    }
                    return res;
                }
            },
        },

        meteor: {
            $subscribe: {},

            UpUserCursor() {
                return this.message? Meteor.users.findOne({_id: this.message.user}): undefined;
            },

            LoginUserCursor() {},
        },
    }
</script>

<style scoped>
    .option-list {
    }
    .option {
        height: 20px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    /*.option:hover {*/
    /*    color: #00edc5;*/
    /*}*/
    .quick-operate {
        display: flex;
    }
    .quick-operate div {
        margin-right: 30px;
    }
</style>