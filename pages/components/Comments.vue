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
                <comment-card :comment="com"
                              :ref="'comment' + idx"
                              @to-comment="commentComment(arguments, idx)"
                              @sub-comment-comment="subCommentComment(arguments, idx)">
                </comment-card>
            </div>
        </div>
        <div>
            <div style="height: 300px;display: none" :id="'comment-input' + id"></div>
            <el-row  class="comment-box" type="flex" justify="space-between">
                <el-col :span="2">
                    <div style="width: 30px;">
                        <header-image :user-id="loginUserData._id"
                                      :header-image="serviceUrl + loginUserData.headerImage"
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
    import '../collections/Comments';

    import HeaderImage from './HeaderImage';
    import CommentCard from './CommentCard';
    import _ from 'lodash';

    export default {
        name: "Comments",
        props: ['id', 'alwaysShow'],

        components: {
            HeaderImage,
            CommentCard,
        },

        mounted() {

        },

        data() {
            return {
                commentNew: '',
                commentButtonVisible: -1,
                commentFocus: {
                    type: 'normal',
                    index: -1,
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
                serviceUrl: Meteor.settings.public.serviceUrl,
            };
        },


        methods: {
            focusCommentInput() {
                document.getElementById(`comment-input${this.id}`).scrollIntoView();
                if(this.$refs.commentNewInput) {
                    this.$refs.commentNewInput.$refs.textarea.focus();
                }
            },
            commentComment(arguments, index) {
                console.log('选定评论', arguments,index);
                this.commentFocus.type = 'comment';
                this.commentFocus.id.user = arguments[0];
                this.commentFocus.id.ts = arguments[1];
                this.commentFocus.index = index;
                this.focusCommentInput();
            },
            subCommentComment(arguments, index) {
                console.log('选定评论',arguments, index);
                this.commentFocus.type = 'sub';
                this.commentFocus.id.user = arguments[0];
                this.commentFocus.id.ts = arguments[1];
                this.commentFocus.to.user = arguments[2];
                this.commentFocus.to.ts = arguments[3];
                this.commentFocus.index = index;
                this.focusCommentInput();
            },
            publishComment() {
                if(!this.commentNew) return null;
                const comment = {
                    content: this.commentNew,
                    user: sessionStorage.getItem('login-user-id'),
                };
                if(this.commentFocus.type === 'normal') {
                    console.log('normal', this.commentFocus, this.commentNew);
                    Meteor.call('comments.publish', this.id, comment, (err, res) => {
                        if(err) console.log(err);
                        else {
                            console.log(res);
                            const componentId = 'com' + sessionStorage.getItem('login-user-id') + '_' + res;
                            sessionStorage.setItem('comments-id', this.id);
                            sessionStorage.setItem('component-id', componentId);
                            location.reload();
                        }
                    });
                }
                else if(this.commentFocus.type === 'comment') {
                    console.log('comment', this.commentFocus, this.commentNew);
                    const target = {
                        user: this.commentFocus.id.user,
                        ts: this.commentFocus.id.ts,
                    };
                    Meteor.call('comments.comment', this.id, target, comment, (err, res) => {
                        if(err) console.log(err);
                        else {
                            console.log(res);
                            const componentId = 'sub' + sessionStorage.getItem('login-user-id') + '_' + res;
                            sessionStorage.setItem('comments-id', this.id);
                            sessionStorage.setItem('component-id', componentId);
                            location.reload();
                        }
                    });
                }
                else if(this.commentFocus.type === 'sub') {
                    console.log('sub', this.commentFocus, this.commentNew);
                    const locate = {
                        user: this.commentFocus.id.user,
                        ts: this.commentFocus.id.ts,
                    };
                    const target = {
                        user: this.commentFocus.to.user,
                        ts: this.commentFocus.to.ts,
                    };
                    Meteor.call('comments.sub2sub', this.id, locate, target, comment, (err, res) => {
                        if(err) console.log(err);
                        else {
                            console.log(res);
                            const componentId = 'sub' + sessionStorage.getItem('login-user-id') + '_' + res;
                            sessionStorage.setItem('comments-id', this.id);
                            sessionStorage.setItem('component-id', componentId);
                            location.reload();
                        }
                    });
                }
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
                return this.$subReady.Comments? this.CommentsCursor: [];
            },
            commentsFocusIndex() {
                let index = -1;
                if(this.commentFocus.id.user && this.commentFocus.id.ts && this.commentsData) {
                    this.commentsData.forEach( comment => {
                        if(comment.user === this.commentFocus.id.user && comment.createdAt === this.commentFocus.id.ts) {
                            console.log('index', comment, this.commentsData.indexOf(comment));
                            index = this.commentsData.indexOf(comment);
                        }
                    });
                }
                return index;
            },
            loginUserData() {
                return {
                    ...this.LoginUserCursor,
                    _id: sessionStorage.getItem('login-user-id'),
                };
            },
        },

        meteor: {
            $subscribe: {
                Comments: [],
            },


            CommentsCursor() {
                const comments = Comments.findOne({_id: this.id})? Comments.findOne({_id: this.id}).list: [];
                let result = [];
                if(comments && comments.length && comments.length > 0) {
                    result =  _.orderBy(comments.map( comment => {
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
                return result;
            },

            LoginUserCursor() {
                return Meteor.user()? Meteor.user().profile: Meteor.users.findOne({_id: Meteor.userId()});
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
