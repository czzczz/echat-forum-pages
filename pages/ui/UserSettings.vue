<template>
    <div>
        <el-container>
            <el-aside style="background-color: #ffffff">
                <div class="header-box">
                    <header-image :user="userData" size="large" @header-click="goMainPage"></header-image>
                </div>
                <el-menu>
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
                    <el-menu-item index="2">
<!--                        <i class="el-icon-menu"></i>-->
                        <span slot="title">通用设置</span>
                    </el-menu-item>
                    <el-menu-item index="3">
<!--                        <i class="el-icon-document"></i>-->
                        <span slot="title">账户设置</span>
                    </el-menu-item>
                    <el-menu-item index="4">
<!--                        <i class="el-icon-setting"></i>-->
                        <span slot="title">高级设置</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
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
                userData: {
                    _id: localStorage.getItem('login-user-id'),
                    userImg: 'http://localhost:8088/image/?viewer=060c6247f382c583b8b2f0c901f9fa74',
                },
            };
        },

        methods: {
            goMainPage(id) {
                this.$router.push({name: 'userMain'});
            }
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