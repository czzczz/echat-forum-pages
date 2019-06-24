<template>
    <div>
        <el-row>
            <el-col :span="16" class="header-container">
                <header-image :user-id="sub.user"
                              :header-image="serviceUrl + sub.headerImage"
                              @header-click="goMainPage"
                              size="mini"
                ></header-image>
                <div style="margin-left: 10px; font-size: 14px;">
                    {{sub.nickname}}
                </div>
                <div style="font-size: 12px; margin-left: 10px">{{publishTime}}</div>
            </el-col>
        </el-row>
        <div style="width: 100%;">
            <div class="comment-body" @mouseenter="commentButtonVisible = true" @mouseleave="commentButtonVisible = false">
                <div>
                    <span v-if="sub.target">回复
                        <a href="#" @click.prevent="goMainPage(commentTargetId)">{{commentTo && commentTo.nickname}}</a>
                        ：
                    </span>
                    {{sub.content}}</div>
                <div v-if="commentButtonVisible" @click="commentComment">
                    <font-awesome-icon :icon="['far', 'comment-dots']" class="awesome"></font-awesome-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    export default {
        name: "SubCommentCard",
        props: ['SubComment'],

        mounted() {
            this.sub = this.SubComment;
        },

        data() {
            return {
                sub: {},
                commentButtonVisible: false,

                serviceUrl: Meteor.settings.public.serviceUrl,
            };
        },

        methods: {
            goMainPage(id) {
                this.$router.push({path: `/user/page/${id}`});
            },
            commentComment() {
                this.$emit('comment', this.SubComment.user, this.SubComment.createdAt);
            },
        },

        computed: {
            commentTo() {
                if(this.$subReady.Users && this.UserToCursor) return this.UserToCursor.profile;
            },
            commentTargetId() {
                if(this.$subReady.Users && this.UserToCursor) return this.UserToCursor._id;
            },
            publishTime() {
                return moment(this.sub.createdAt).format('YYYY-MM-DD HH:mm:ss');
            },
        },

        meteor: {
            $subscribe: {
                Users: []
            },

            UserToCursor() {
                if(this.sub.target) return Meteor.users.findOne({_id: this.sub.target.user});
                return {};
            },
        },
    }
</script>

<style scoped>
    .header-container {
        display: flex;
    }

    .comment-body {
        height: 50px;
        width: 100%;
        margin-left: 40px;
        border-bottom: 1px solid #cccccc;
    }
</style>
