<template>
    <el-container @mousewheel.native="scrollHandler">
        <el-header style="height: 100%; width: 100%; background-color: #ffffff;" v-if="headerVisible">
            <el-row type="flex" justify="space-between">
                <el-col :span="20" style="height: 60px;">
                </el-col>
                <el-col :span="3" style="height: 60px;">
                    <div class="nickname-box" :title="userData.nickname">{{userData.nickname}}</div>
                </el-col>
                <el-col :span="1" style="height: 60px; display: flex; align-items: center;">
                    <header-image :user-id="userData._id"
                                  :header-image="userData.userImg"
                                  :operations="userOperations"
                                  @header-click="goMainPage"
                                  @operation-click="operationHandle"
                    ></header-image>
                </el-col>
            </el-row>
        </el-header>
        <div class="arrow-to-top" v-if="!headerVisible" @click="toTop">
            <i class="el-icon-caret-top"></i>
        </div>
        <div id="main-content">
            <router-view></router-view>
        </div>
    </el-container>
</template>

<script>
    import HeaderImage from "../components/HeaderImage";
    export default {
        name: "LayoutMain",

        components: {
            'header-image': HeaderImage
        },

        mounted() {
            if(!Meteor.userId()) {
                this.$router.push({name: 'login'});
            }
            else {
                sessionStorage.setItem('login-user-id', Meteor.userId());
                // console.log(Meteor.users.findOne({_id: Meteor.userId()}));
                console.log('sessionStorage', sessionStorage);
            }
        },

        data() {
            return {
                activeMenuIndex: '1',
                serviceUrl: Meteor.settings.public.serviceUrl,

                headerVisible: true,
                scrollLength: 0,


                userOperations: [
                    {
                        name: 'main',
                        label: '个人主页'
                    },
                    {
                        name: 'settings',
                        label: '个人设置'
                    },
                    {
                        name: 'logout',
                        label: '退出登录'
                    }
                ]
            };
        },

        methods: {
            toTop() {
                console.log('toTop');
                this.scrollLength = 0;
                this.showHeader();
                document.getElementById("main-content").scrollIntoView();
            },
            showHeader() {
                if(!this.headerVisible) this.headerVisible = true;
            },
            hideHeader() {
                if(this.headerVisible) this.headerVisible = false;
            },
            scrollHandler(wheelE) {
                this.scrollLength -= wheelE.wheelDeltaY;//wheelDeltaY属性为120时为向上滚了一个单位（三格），-120为向下
                if(this.scrollLength <= 0) this.showHeader();
                else this.hideHeader();
            },

            goMainPage(id) {
                console.log('go home', id);
                this.$router.push({path: '/user/page'});
            },

            operationHandle(id, name) {
                console.log('user operate', id);
                if(name === 'logout') {
                    this.logout();
                }
                else if(name === 'main') {
                    this.goMainPage(id);
                }
                else if(name === 'settings') {
                    this.$router.push({name: 'userSettings'})
                }
            },

            logout() {
                Meteor.logout(() => {
                    // sessionStorage.removeItem('login-user-id');
                    sessionStorage.clear();
                    this.$message('退出成功');
                    this.$router.push('/login');
                });
            }
        },

        computed: {
            userData() {
                return {
                    _id: sessionStorage.getItem('login-user-id'),
                    email: sessionStorage.getItem('login-user-email'),
                    userImg: this.UserCursor?
                        this.serviceUrl + this.UserCursor.profile.headerImage:
                        `${this.serviceUrl}/header/?img=07983baf1b5e4d298719bde5adc69e27`,
                    nickname: this.UserCursor?
                        this.UserCursor.profile.nickname:
                        '用户'
                }
            },
        },

        meteor: {
            UserCursor() {
                return Meteor.user()? Meteor.user(): Meteor.users.findOne({_id: Meteor.userId()});
            },
        }
    }
</script>

<style scoped>
    .arrow-to-top {
        position: fixed;
        background-color: white;
        right: 30px;
        bottom: 100px;
        height: 50px;
        width: 50px;
        border-radius: 50%;
        box-shadow: 0 0 5px 5px #cccccc;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
    }
    .nickname-box {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 100%;
        width: calc(100% - 15px);
        display: flex;
        align-items: center;
        font-size: 18px;
    }
</style>
