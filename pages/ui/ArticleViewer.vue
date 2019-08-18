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

</style>
