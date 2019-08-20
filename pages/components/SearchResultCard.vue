<template>
    <div style="display: flex; align-items: center; padding: 10px 30px;">
        <div v-if="type === 'message'">
            <message-card :message="data"
                          :message-operation="messageOperationCleared"
                          @operate="operateMessage"></message-card>
        </div>
        <div v-else-if="type === 'article'">
            <message-card :message="data"
                          :message-operation="messageOperationCleared"
                          @operate="operateMessage"></message-card>
        </div>
        <div v-else-if="type === 'user'">
            <el-row type="flex" justify="space-between">
                <el-col :span="12">
                    <div>
                        <ou-persona size='lg' 
                                :src='`${serviceUrl}${data.profile.headerImage}`' 
                                :primaryText='data.profile.nickname' 
                                :secondaryText='data.profile.email' 
                                :tertiaryText='data.profile.detail'
                                @click.native="goMain"/>
                    </div>
                </el-col>
                <el-col :span="3">
                    <el-button @click="toggleFollow">
                        <font-awesome-icon v-if="!hasFollowed" :icon="['fas', 'plus']" class="awesome"></font-awesome-icon>
                        {{hasFollowed? '取消关注': '关注'}}
                    </el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import MessageCard from './MessageCard';
    import _ from 'lodash';

    export default {
        name: 'SearchResultCard',

        props: ['type', 'data', 'message-operation'],

        data() {
            return {
                serviceUrl: Meteor.settings.public.serviceUrl,
            };
        },

        components: {
            MessageCard,
        },

        methods: {
            goMain() {
                if (this.type === 'user') this.$router.push(`/user/page/${this.data._id}`);
                else this.$router.push(`/user/page/${this.data.profile._id}`);
            },
            operateMessage(operate, mid, aid) {
                this.$emit('operate', operate, mid, aid)
            },
            toggleFollow() {
                if (this.hasFollowed) this.$emit('de-follow', this.data._id);
                else this.$emit('follow', this.data._id);
            },
        },

        computed: {
            ownFollows() {
                return this.$subReady.Users? this.UserCursor.profile.follows: [];
            },
            hasFollowed() {
                return new Set(this.ownFollows).has(this.data._id);
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

        meteor: {
            $subscribe: {
                Users: [],
            },

            UserCursor() {
                return Meteor.users.findOne({_id: sessionStorage.getItem('login-user-id')});
            },
        },
    }
</script>

<style scoped>

</style>