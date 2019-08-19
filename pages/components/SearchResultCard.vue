<template>
    <div style="height: 150px;">
        <div v-if="type === 'message'">
        </div>
        <div v-else-if="type === 'article'">
            <el-row>
                <el-col :span="20">
                    <ou-persona size='sm' 
                                :src='data.profile.headerImage' 
                                :primaryText='data.profile.nickname' 
                                :secondaryText='data.profile.email' 
                                @click.native="goMain"/>   
                </el-col>
                <el-col :span="4">
                    <el-button @click="toggleFollow">
                        <font-awesome-icon v-if="!hasFollowed" :icon="['fas', 'plus']" class="awesome"></font-awesome-icon>
                        {{hasFollowed? '取消关注': '关注'}}
                    </el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    {{data.content}}
                </el-col>
            </el-row>
            <el-row></el-row>
        </div>
        <div v-else-if="type === 'user'">
            <el-row type="flex" justify="space-between">
                <el-col :span="12">
                    <ou-persona size='lg' 
                                :src='data.profile.headerImage' 
                                :primaryText='data.profile.nickname' 
                                :secondaryText='data.profile.email' 
                                :tertiaryText='data.profile.detail'
                                @click.native="goMain"/>
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
    export default {
        name: 'SearchResultCard',

        props: ['type', 'data'],

        methods: {
            goMain() {
                this.$router.push(`/user/page/${this.data._id}`)
            },
            toggleFollow() {},
        },

        computed: {
            ownFollows() {
                return this.$subReady.Users? this.UserCursor.profile.follows: [];
            },
            hasFollowed() {
                return new Set(this.ownFollows).has(this.data._id);
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