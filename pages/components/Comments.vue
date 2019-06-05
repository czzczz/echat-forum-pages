<template>
    <div>
        <div class="no-comments" v-if="!hasComments">
            <span>暂无评论，</span>
            <a href="#" @click.prevent="focusCommentInput">添加评论？</a>
        </div>
        <div v-else>
            <div v-for="(com, idx) in commentsData"
                 class="comment-card"
                 :key="idx">
                <comment-card :comment="com" @to-comment="commentComment" @sub-comment-comment="subCommentComment"></comment-card>
            </div>
        </div>
        <div>
            <div style="height: 300px;display: none" :id="'comment-input' + msgId"></div>
            <el-row  class="comment-box" type="flex" justify="space-between">
                <el-col :span="2">
                    <div style="width: 30px;">
                        <header-image :user-id="loginUserData._id"
                                      :header-image="loginUserData.headerImage"
                                      @header-click="goMainPage"
                                      size="mini"
                        ></header-image>
                    </div>
                </el-col>
                <el-col :span="21-buttonSpan">
                    <el-input
                            type="textarea"
                            ref="commentNewInput"
                            :autosize="{minRows: 1, maxRows: 3}"
                            maxlength="100"
                            show-word-limit
                            placeholder="请输入评论"
                            v-model="commentNew">
                    </el-input>
                </el-col>
                <el-col :span="buttonSpan">
                    <el-button size="mini" v-if="commentFocus.type !== 'normal'" @click="cancelChosed">取消</el-button>
                    <el-button size="mini" type="primary" @click="publishComment">发送</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import HeaderImage from './HeaderImage';
    import CommentCard from './CommentCard';
    import _ from 'lodash';

    export default {
        name: "Comments",
        props: ['msgId', 'alwaysShow'],

        components: {
            HeaderImage,
            CommentCard,
        },

        data() {
            return {
                commentNew: '',
                commentButtonVisible: -1,
                commentFocus: {
                    type: 'normal',
                    id: {
                        user: '',
                        ts: 0,
                    },
                    to: {
                        user: '',
                        ts: 0,
                    },
                    comment: {},
                },
            };
        },


        methods: {
            focusCommentInput() {
                document.getElementById(`comment-input${this.msgId}`).scrollIntoView();
                if(this.$refs.commentNewInput) {
                    this.$refs.commentNewInput.$refs.textarea.focus();
                }
            },
            commentComment(user, ts) {
                // console.log('选定评论',id);
                this.commentFocus.type = 'comment';
                this.commentFocus.id.user = user;
                this.commentFocus.id.ts = ts;
                this.focusCommentInput();
            },
            subCommentComment(comUser, comTs, tarUser, tarTs) {
                this.commentFocus.type = 'sub';
                this.commentFocus.id.user = comUser;
                this.commentFocus.id.ts = comTs;
                this.commentFocus.to.user = tarUser;
                this.commentFocus.to.ts = tarTs;
                this.focusCommentInput();
            },
            publishComment() {
                console.log('确认评论');
                const comment = {
                    content: this.commentNew,
                    user: localStorage.getItem('login-user-id')
                };
                Meteor.call('message.comment', this.msgId, this.commentFocus, comment, err => {
                    if(err) console.log(err);
                    else {
                        this.commentNew = '';
                        this.commentFocus.type = 'normal';
                    }
                });
            },
            cancelChosed() {
                this.commentFocus.type = 'normal';
            },
            goMainPage(id) {
                this.$router.push({path: `/user/page/${id}`});
            },
        },

        computed: {
            buttonSpan() {
                return this.commentFocus.type !== 'normal'? 6: 3;
            },
            hasComments() {
                return this.commentsData && this.commentsData.length && this.commentsData.length > 0;
            },
            commentsData() {
                return this.$subReady.Messages? this.CommentsCursor: [];
            },
            loginUserData() {
                return {
                    ...this.LoginUserCursor,
                    _id: localStorage.getItem('login-user-id'),
                };
            },
            focusTargetName() {
                if(this.commentFocus.type === 'normal') return '主题';
                return this.FocusedUserCursor? this.FocusedUserCursor.profile.nickname: '';
            },
        },

        meteor: {
            $subscribe: {
                Messages: [],
            },


            CommentsCursor() {
                const comments = Messages.findOne({_id: this.msgId})? Messages.findOne({_id: this.msgId}).comments: {};
                if(comments && comments.length && comments.length > 0) {
                    return _.orderBy(comments.map( comment => {
                        const user = Meteor.users.findOne({_id: comment.user}).profile;
                        const res = {
                            ...comment,
                            headerImage: user.headerImage,
                            nickname: user.nickname,
                        };
                        res.subComments = _.orderBy(_.map(comment.subComments, sub => {
                            const subuser = Meteor.users.findOne({_id: sub.user}).profile;
                            return {
                                ...sub,
                                headerImage: subuser.headerImage,
                                nickname: subuser.nickname,
                            };
                        }), ['createdAt'], ['desc']);
                        return res;
                    }), ['subComments.length', 'createdAt'], ['desc', 'desc']);
                }
                return [];
            },

            LoginUserCursor() {
                return Meteor.user()? Meteor.user().profile: Meteor.users.findOne({_id: localStorage.getItem('login-user-id')});
            },

            FocusedUserCursor() {
                if(this.commentFocus.type === 'sub') return Meteor.users.findOne({_id: this.commentFocus.to.user});
                else if(this.commentFocus.type === 'comment') return Meteor.users.findOne({_id: this.commentFocus.to.user});
                else return Messages.findOne({_id: this.msgId})?
                        Meteor.users.findOne({_id: Messages.findOne({_id: this.msgId}).user}):
                        {};
            },
        }
    }
</script>

<style scoped>
    .no-comments {
        height: 40px;
        margin-bottom: 20px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .comment-card {
        display: flex;
    }


    .comment-box {
        margin-top: 5px;
        display: flex;
        align-items: center;
    }
</style>