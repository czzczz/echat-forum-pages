<template>
    <div style="display: flex;
                width: 100%;
                height: 710px;
                justify-content: center;
                align-items: center;">
        <el-card class="register-card">
            <div slot="header" class="card-header-center">
                <span>注册</span>
            </div>
            <el-row>
                <el-col :span="20" :offset="2">
                    <el-form label-width="80" :model="userInfo">
                        <el-form-item label="邮箱：" style="margin-top: 10px;" prop="email">
                            <el-input size="mini" v-model="userInfo.email" placeholder="请输入有效的邮箱"></el-input>
                        </el-form-item>
                        <el-form-item label="昵称：" style="margin-top: 10px;" prop="nickname">
                            <el-input size="mini" v-model="userInfo.nickname" placeholder="昵称"></el-input>
                        </el-form-item>
                        <el-form-item label="设置密码：" style="margin-top: 10px;" prop="password">
                            <el-input type="password" size="mini" v-model="userInfo.password"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码：" style="margin-top: 10px;">
                            <el-input type="password" size="mini" v-model="passwordCheck"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-button size="mini" type="primary" @click="confirmToRegister">确认注册</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    import '/pages/collections/Users';
    import ValidCode from "../components/ValidCode";
    import axios from 'axios';
    export default {
        name: "Register",

        components: {
            ValidCode,
        },

        data() {
            return {
                userInfo: {
                    email: '',
                    password: '',
                    nickname: '',
                    age: '',
                    headerImage: '',
                    detail: '',
                    status: 0,
                },
                //密码重复验证
                passwordCheck: '',
                //验证码
                validCode: '',
                validCodeCheck: '',

                userStatus: [
                    {
                        value: 0,
                        label: '待验证',
                    },
                    {
                        value: 1,
                        label: '已验证',
                    },
                    {
                        value: 2,
                        label: '冻结中',
                    }
                ],
            };
        },

        mounted() {
        },

        methods: {
            getValidCode(data) {
                // console.log('code now', data);
                this.validCode = data;
            },
            confirmToRegister() {
                axios.post(Meteor.settings.public.serviceUrl + '/email/register/to', {
                    userInfo: this.userInfo
                }).then( response => {
                    console.log(response.data);
                    if(response.data.status === 'OK') {
                        Meteor.call('user.add', this.userInfo, response.data.time, (error, result) => {
                            if(error) console.log(error);
                            else {
                                console.log(result);
                                Meteor.loginWithPassword(result.email, result.password, (err) => {
                                    if(!err){
                                        this.$router.push({path: '/'})
                                    } else{
                                        console.log(err);
                                    }
                                });
                            }
                        });
                    }
                    else console.log('Send Email Error');
                });
            },
            handlePictureCardPreview(response, file, fileList) {
                console.log(response);
            },
        },

        computed: {
            isValidEmailAddress() {
                if(this.userInfo.email) {
                    const reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                    return reg.test(this.userInfo.email)? 'success': 'error';
                }
                else return '';
            },
            isValidNickName() {},
            isValidAge() {},
            isValidCodeChecked() {},
        },

        meteor: {
            $subscribe: {
                Users: [],
            },
        }
    }
</script>

<style scoped>
    .register-card {
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