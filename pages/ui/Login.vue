<template>
    <div class="login-page-body">
        <el-card shadow="always" class="login-card">
            <div slot="header" class="card-header-center">
                <span>登陆</span>
            </div>
            <el-form label-width="40" label-position="right">
                <el-row type="flex" justify="center" style="margin-top: 10px;">
                    <el-col :span="20">
                        <el-form-item label="邮箱：">
                            <el-row>
                                <el-col :span="16">
                                    <el-input type="text" size="small" v-model="userData.accountID"></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" style="margin-top: 10px;">
                    <el-col :span="20">
                        <el-form-item label="密码：">
                            <el-row>
                                <el-col :span="16">
                                    <el-input type="password" size="small" v-model="userData.password"></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="14">
                        <el-button type="text" size="mini" @click="resetAccountPassword">忘记密码？</el-button>
                    </el-col>
                    <el-col :span="10">
                        <el-button type="text" size="mini" @click="registerIn">注册</el-button>
                        <el-button type="primary" size="mini" @click="loginAccount">登陆</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
    </div>
</template>

<script>

    export default {
        name: "Login",

        components: {
        },

        data() {
            return {
                userData: {
                    accountID: '',
                    password: '',
                },
            };
        },

        mounted() {
            console.log('Login');
        },

        methods: {
            loginAccount() {
                console.log('log in');
                localStorage.clear();
                Meteor.loginWithPassword(this.userData.accountID, this.userData.password, (err) => {
                    if(!err){
                        localStorage.setItem('login-user-id', Meteor.userId());
                        // console.log(Meteor.users.findOne({_id: Meteor.userId()}));
                        localStorage.setItem('login-user-email', Meteor.user().profile.email);
                        this.$router.push({path: '/'})
                    } else{
                        console.log(err);
                    }
                });
            },
            resetAccountPassword() {
                console.log('reset password');
            },
            registerIn() {
                console.log('register in');
                this.$router.push({path: '/register'});
            },
        },
    }
</script>

<style scoped>
    .login-page-body {
        display: flex;
        width: 100%;
        height: 710px;
        justify-content: center;
        align-items: center;
    }
    .login-card {
        height: 300px;
        width: 400px;
        padding: 20px;
        background-color: white;
    }
    .card-header-center {
        display: flex;
        justify-content: center;
        font-size: 1.5rem;
    }
</style>