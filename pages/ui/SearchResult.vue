<template>
    <div style="min-height: 650px; margin-top: 20px;">
        <el-row type="flex" justify="center">
            <el-col :span="16">
                <el-tabs v-model="activeTabName" stretch style="margin-top: 10px;">
                    <el-tab-pane label="全部相关" name="all"></el-tab-pane>
                    <el-tab-pane label="短博" name="message"></el-tab-pane>
                    <el-tab-pane label="长文" name="article"></el-tab-pane>
                    <el-tab-pane label="用户" name="user"></el-tab-pane>
                </el-tabs>
                <div v-if="searchResultData.length > 0">
                    <div v-for="(item, index) in searchResultData"
                                        :key="index">
                        <search-result-card :type="item.type"
                                            :data="item.data"
                                            class="result-card"
                                            :message-operation="messageOperation"
                                            @operate="messageOperate"
                                            @follow="followUser"
                                            @de-follow="deFollowUser"></search-result-card>
                    </div>
                </div>
                <div v-else class="empty-block">暂无数据</div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import SearchResultCard from '../components/SearchResultCard';

    export default {
        name: 'SearchResult',

        components: {
            SearchResultCard,
        },

        data() {
            return {
                activeTabName: 'all',
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
            }
        },

        computed: {
            searchKeyWords() {
                return Array.from(new Set(this.$route.query.keywords.split(',')));
            },
            searchResultData() {
                let res = [];
                if(this.SearchUsersCursor && (this.activeTabName === 'all' || this.activeTabName === 'user')) {
                    this.SearchUsersCursor.forEach(user => {
                        res.push({
                            type: 'user',
                            data: user,
                        });
                    });
                }
                if(this.SearchMessagesCursor && (this.activeTabName === 'all' || this.activeTabName === 'message')) {
                    this.SearchMessagesCursor.forEach(msg => {
                        res.push({
                            type: 'message',
                            data: msg,
                        });
                    });
                }
                if(this.SearchArticlesCursor && (this.activeTabName === 'all' || this.activeTabName === 'article')) {
                    this.SearchArticlesCursor.forEach(atc => {
                        res.push({
                            type: 'article',
                            data: atc,
                        });
                    });
                }
                console.log('searchResult', res);
                return res;
            },
        },

        methods: {
            followUser(uid) {},
            deFollowUser(uid) {},
            messageOperate(operationName, msgId, aid) {
                console.log(operationName, msgId, aid);
                if(operationName === 'view' || operationName === 'bodyClick') this.viewMessage(msgId);
                else if(operationName === 'share') {}

                else if(operationName === 'edit') this.editMessage(msgId, aid);
                else if(operationName === 'delete') this.deleteMessage(msgId);

                else if(operationName === 'follow') {}
                else if(operationName === 'de-follow') {}
                else if(operationName === 'report') {}
                else console.log('操作出错');
            },
            viewMessage(id) {
            },
            editMessage(id, aid) {
                if(aid) this.$router.push({path: `/article/edit/${aid}`});
                else this.$router.push(`/message-edit/${id}`);
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
                Messages: [],
                Articles: [],
                Users: [],
            },
            SearchUsersCursor() {
                const regList = this.searchKeyWords.map(item => {
                    return {
                        'profile.email': new RegExp(item, 'ig')
                    }
                });
                return Meteor.users.find({$and: regList});
            },
            SearchMessagesCursor() {
                const regList = this.searchKeyWords.map(item => {
                    return {
                        'content': new RegExp(item, 'ig')
                    }
                });
                const list = [];
                Messages.find({$and: regList}).forEach(msg => {
                    if(!msg.article) {
                        let user = Meteor.users.findOne({_id: msg.user});
                        if(user) {
                            if(new Set(user.profile.messages).has(msg._id)) list.push(msg);
                        }
                    }
                });
                return list;
            },
            SearchArticlesCursor() {
                const regList = this.searchKeyWords.map(item => {
                    return {
                        'content': new RegExp(item, 'ig')
                    }
                });
                const list = [];
                Messages.find({$and: regList}).forEach(msg => {
                    if(msg.article) {
                        let user = Meteor.users.findOne({_id: msg.user});
                        if(user) {
                            if(new Set(user.profile.messages).has(msg._id)) list.push(msg);
                        }
                    }
                });
                return list;
            },
        },
    }
</script>

<style scoped>
    .empty-block {
        width: 100%;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #a3a3a3;
    }
    .result-card {
        background-color: #ffffff;
        margin: 20px 0;
    }
</style>