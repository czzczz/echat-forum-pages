<template>
    <div style="height: 100%; width: 100%; margin-top: 20px;">
        <el-row type="flex" justify="center">
            <el-col :span="12" style="background-color: #ffffff;">
                <el-row>
                    <el-col style="margin-right: 20px;">
                        <div>作者：{{authorName}}</div>
                        <div>{{updateTimeData}}</div>
                    </el-col>
                    <el-col>
                        <div class="bottom clearfix" v-html="articleData.content" style="min-height: 500px;">
                            <span  class="message"  v-text="articleData.content"></span>
                        </div>
                        <div>
                            <el-row style="margin-top: 30px; margin-bottom: 30px;">
                                <el-col>
                                    <comments :id="articleData.comments" :always-show="show"></comments>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <div class="side-button-list">
            <div class="side-button" @click="editArticle">
                <font-awesome-icon :icon="['far', 'edit']" class="awesome"></font-awesome-icon>
            </div>
            <div class="side-button" @click="deleteArticle">
                <font-awesome-icon :icon="['far', 'trash-alt']" class="awesome"></font-awesome-icon>
            </div>
        </div>
    </div>
</template>

<script>
    import '../collections/Articles';
    import '../collections/Users';
    import Comments from '../components/Comments';
    import moment from 'moment';

    export default {
        name: "ArticleViewer",

        components: {
            'comments': Comments,
        },
        
        computed: {
            articleData() {
                if(this.$subReady.Articles) {
                    return this.ArticleCursor;
                }
                else return {}
            },
            userId2Name() {
                const obj = {};
                if(this.UsersCursor) {
                    this.UsersCursor.map(item => {
                        obj[item._id] = item.profile.nickname;
                    });
                }
                // console.log('userId2Name', obj);
                return obj;
            },
            authorName() {
                return this.userId2Name[this.articleData.user] || ''
            },
            updateTimeData() {
                const msg = this.articleData;
                console.log('article', msg);
                let res = '';
                if(!msg) return '';
                if(!msg.changeHistory || msg.changeHistory.length === 0) {
                    res = '创建于 ' + moment(msg.createdAt).format('YYYY-MM-DD HH:mm:ss');
                }
                else {
                    res = '最后更新于 ' + moment(msg.updatedAt).format('YYYY-MM-DD HH:mm:ss');
                }
                return res;
            },
        },

        methods: {
            editArticle() {
                this.$router.push({path: `/article/edit/${this.$route.params.aid}`});
            },
            deleteArticle() {
                if(sessionStorage.getItem('login-user-id') === this.articleData.user) {
                    this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        Meteor.call('article.delete', this.$route.params.aid, (err) => {
                            if(err) {
                                this.$message({
                                    type: 'error',
                                    message: '删除失败!'
                                });   
                            }
                            else {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.$router.push('/home')
                            }
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
                }
                else {
                    this.$message({
                        message: '请先登陆后再做该操作',
                        type: 'error'
                    });
                }
            },
        },

        meteor: {
            $subscribe: {
                Articles: [],
                Users: [],
            },
            ArticleCursor() {
                return Articles.findOne({_id: this.$route.params.aid});
            },
            UsersCursor() {
                return Meteor.users.find();
            },
        }
    }
</script>

<style scoped>
    @import url('icons.css');
    .side-button-list {
        position: fixed;
        right: 150px;
        bottom: 100px;
        z-index: 999;
    }
    .side-button {
        background-color: white;
        height: 50px;
        width: 50px;
        border-radius: 50%;
        box-shadow: 0 0 5px 5px #cccccc;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    }
</style>
