<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="10">
                <ou-persona size="sm"
                            :src="serviceUrl + upUserData.headerImage"
                            :primaryText="upUserData.nickname"
                            :secondaryText="upUserData.email"
                            @click.native="goMain"/>
            </el-col>
            <el-col :span="1">
                <el-popover
                        placement="right"
                        width="50"
                        v-model="optionPopoverVisible">
                    <div slot="reference" @click.stop.native="showMessageOption">
                        <font-awesome-icon v-if="!hasFollowed" :icon="['fas', 'chevron-down']" class="awesome"></font-awesome-icon>
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
                <p v-html="messageContent"></p>
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
        <el-row v-if="commentsVisible || show" style="margin-bottom: 30px">
            <el-col>
                <comments :id="message.comments" :always-show="show"></comments>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import moment from 'moment';
    import Comments from '../components/Comments';

    export default {
        name: "MessageCard",
        props: ['message', 'message-operation', 'alwaysShow'],

        components: {
            'comments': Comments,
        },

        created () {
        },

        mounted() {
            this.intervalId = setInterval(() => {
                this.$forceUpdate();
            }, 1000)
        },
        updated() {
            console.log('update',this.message);
            if(sessionStorage.getItem('comments-id') && this.message.comments === sessionStorage.getItem('comments-id')) {
                this.commentsVisible = true;
                sessionStorage.removeItem('comments-id');
            }
            if(sessionStorage.getItem('component-id')) {
                this.$nextTick( () => {
                    console.log('jump', document.getElementById(sessionStorage.getItem('component-id')));
                    if(document.getElementById(sessionStorage.getItem('component-id'))) {
                        document.getElementById(sessionStorage.getItem('component-id')).scrollIntoView({block: "center"});
                        sessionStorage.removeItem('component-id');
                    }
                });
            }
        },

        beforeDestroy () {
            clearInterval(this.intervalId);
        },

        data() {
            return {
                optionPopoverVisible: false,
                commentsVisible: false,
                serviceUrl: Meteor.settings.public.serviceUrl,
                show: false,

                intervalId: 0,//定时器
            };
        },

        methods: {
            showMessageOption() {
                this.optionPopoverVisible = true;
            },
            messageOperate(value) {
                this.$emit('operate', value, this.message._id, this.message.article);
                this.optionPopoverVisible = false;
            },
            showComments() {
                console.log('show comments');
                this.commentsVisible = !this.commentsVisible;
            },
            goMain() {
                this.$router.push(`/user/page/${this.message.user}`);
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
            loginUserData() {
                if(this.LoginUserCursor && this.LoginUserCursor.profile) {
                    return this.LoginUserCursor.profile;
                }
                return {};
            },
            isOwner() {
                return this.message.user === this.LoginUserCursor._id;
            },
            isFollowed() {
                let followList = new Set(this.loginUserData.follows);
                return followList.has(this.message.user);
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
                let res = [];
                if(this.isOwner) {
                    if(this.message.article) {
                        this.messageOperation.owner.forEach(ope => {
                            if(ope.value === 'edit') {
                                ope.label = '编辑长文';
                            }
                            // else if(ope.value === 'delete') {
                            //     ope.label = '删除长文';
                            // }
                            res.push(ope);
                        });
                    }
                    else res = this.messageOperation.owner;
                }
                else {
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
                }
                return res;
            },
        },

        meteor: {
            $subscribe: {},

            UpUserCursor() {
                return this.message? Meteor.users.findOne({_id: this.message.user}): undefined;
            },

            LoginUserCursor() {
                return Meteor.users.findOne({_id: sessionStorage.getItem('login-user-id')});
            },
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
