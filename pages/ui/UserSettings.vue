<template>
    <div>
        <el-container>
            <el-aside style="background-color: #ffffff">
                <div class="header-box">
                    <header-image :user-id="userData._id"
                                  :header-image="serviceUrl + userData.userImg"
                                  size="large"
                                  @header-click="goMainPage"
                    ></header-image>
                </div>
                <el-menu router
                         default-active="/user/settings/base">
                    <!--<el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span slot="title">导航一</span>
                        </template>
                        <el-menu-item-group>
                            <span slot="title">分组一</span>
                            <el-menu-item index="1-1">选项1</el-menu-item>
                            <el-menu-item index="1-2">选项2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="分组2">
                            <el-menu-item index="1-3">选项3</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="1-4">
                            <span slot="title">选项4</span>
                            <el-menu-item index="1-4-1">选项1</el-menu-item>
                        </el-submenu>
                    </el-submenu>-->
                    <el-menu-item index="/user/settings/base">
                        <font-awesome-icon :icon="['fas', 'cog']" class="awesome"></font-awesome-icon>
                        <span slot="title">通用设置</span>
                    </el-menu-item>
                    <el-menu-item index="/user/settings/profile">
                        <font-awesome-icon :icon="['fas', 'id-card']" class="awesome"></font-awesome-icon>
                        <span slot="title">信息设置</span>
                    </el-menu-item>
                    <el-menu-item index="/user/settings/account">
                        <font-awesome-icon :icon="['fas', 'user']" class="awesome"></font-awesome-icon>
                        <span slot="title">账户设置</span>
                    </el-menu-item>
                    <el-menu-item index="/user/settings/advance">
                        <font-awesome-icon :icon="['fas', 'tools']" class="awesome"></font-awesome-icon>
                        <span slot="title">高级设置</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main style="padding-bottom: 0">
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import HeaderImage from '../components/HeaderImage';
    export default {
        name: "UserSettings",

        components: {
            HeaderImage,
        },

        data() {
            return {
                serviceUrl: Meteor.settings.public.serviceUrl,
            };
        },

        methods: {
            goMainPage(id) {
                this.$router.push({name: 'userMain'});
            }
        },

        computed: {
            userData() {
                return {
                    _id: localStorage.getItem('login-user-id'),
                    email: localStorage.getItem('login-user-email'),
                    userImg: this.UserCursor?
                        this.UserCursor.profile.headerImage:
                        '/header/?img=07983baf1b5e4d298719bde5adc69e27',
                }
            },
        },

        meteor: {
            UserCursor() {
                return Meteor.user()? Meteor.user(): Meteor.users.findOne({_id: localStorage.getItem('login-user-id')});
            },
        }
    }
</script>

<style scoped>
    .header-box {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
</style>
