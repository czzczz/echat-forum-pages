<template>
    <div style="width: 100%">
        <el-row>
            <el-col class="header-container">
                <header-image :user-id="comment.user"
                              :header-image="comment.headerImage"
                              @header-click="goMainPage"
                              size="mini"
                ></header-image>
                <div style="margin-left: 10px; font-size: 14px;">
                    {{comment.nickname}}
                </div>
                <div style="font-size: 12px; margin-left: 10px">{{publishTime}}</div>
            </el-col>
        </el-row>
        <div style="width: calc(100% - 40px);">
            <div class="comment-body" @mouseenter="commentButtonVisible = true" @mouseleave="commentButtonVisible = false">
                <div>{{comment.content}}</div>
                <div v-if="commentButtonVisible" @click="commentComment">
                    <font-awesome-icon :icon="['far', 'comment-dots']" class="awesome"></font-awesome-icon>
                </div>
            </div>
            <div v-if="comment.subComments && comment.subComments.length && comment.subComments.length > 0"
                 style="margin-top: 10px; margin-bottom: 20px; margin-left: 40px;">
                <div v-for="(subc, subidx) in comment.subComments"
                     :key="subidx">
                    <sub-comment-card :sub-comment="subc" @comment="subCommentComment"></sub-comment-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SubCommentCard from './SubCommentCard';
    import moment from 'moment';

    export default {
        name: "CommentCard",
        props: ['comment'],

        components: {
            SubCommentCard,
        },

        data() {
            return {
                commentButtonVisible: false
            };
        },

        methods: {
            goMainPage(id) {
                this.$router.push({path: `/user/page/${id}`});
            },
            commentComment() {
                this.$emit('to-comment', this.comment.user, this.comment.createdAt);
            },
            subCommentComment(user, ts) {
                this.$emit('sub-comment-comment', this.comment.user, this.comment.createdAt, user, ts);
            },
        },

        computed: {
            publishTime() {
                return moment(this.comment.createdAt).format('YYYY-MM-DD HH:mm:ss');
            },
        }
    }
</script>

<style scoped>
    .header-container {
        display: flex;
    }

    .comment-body {
        height: 60px;
        width: 100%;
        margin-left: 40px;
        border-bottom: 1px solid #cccccc;
    }
</style>