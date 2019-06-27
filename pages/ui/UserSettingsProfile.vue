<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/user/settings' }">个人设置</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/user/settings/profile' }">个人信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="setting-container" id="setting-container">
            <el-row type="flex" justify="space-between">
                <el-col :span="12">
                    <el-form label-width="80px" label-position="right" :model="userData">
                        <el-form-item label="登陆邮箱" prop="email">
                            <el-input size="mini"
                                      disabled
                                      v-model="userData.email"></el-input>
                        </el-form-item>
                        <el-form-item label="昵称" prop="nickname">
                            <el-input size="mini"
                                      :disabled="!toEdit"
                                      v-model="userData.nickname"
                                      placeholder="请输入想用的昵称"></el-input>
                        </el-form-item>
                        <el-form-item label="个人简介" prop="detail">
                            <el-input size="mini"
                                      type="textarea"
                                      placeholder="请输入内容"
                                      :disabled="!toEdit"
                                      v-model="userData.detail"
                                      :autosize="{ minRows: 2, maxRows: 5}"></el-input>
                        </el-form-item>
                    </el-form>
                    <div style="display: flex; justify-content: center; align-items: center;">
                        <el-button v-if="!toEdit" size="mini" @click="toEdit = true">编辑</el-button>
                        <div v-else>
                            <el-button size="mini" @click="cancelChange">取消</el-button>
                            <el-button size="mini" type="primary" @click="save">保存</el-button>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div>
                        <div style="height: 148px; width: 148px;">
                            <img :src="serviceUrl + userData.headerImage" width="148px" height="148px"/>
                        </div>
                    </div>
                    <div v-if="toEdit">
                        <el-upload
                                :action="`${serviceUrl}/upload/image`"
                                ref="imageUploader"
                                class="header-uploader"
                                list-type="picture-card"
                                :show-file-list="false"
                                accept="image/jpg, image/png"
                                :on-success="uploadSuccess"
                                :limit="1">
                            <font-awesome-icon :icon="['fas', 'plus']" class="awesome"></font-awesome-icon>
                        </el-upload>
                        <el-dialog
                                title="图片剪切"
                                :visible.sync="imageCropVisible"
                                width="50%"
                                :before-close="handleClose">
                            <el-row type="flex" justify="end">
                                <el-col :span="2">
                                    <el-button size="mini" @click="rotateImage(-1)">
                                        <font-awesome-icon :icon="['fas', 'redo']" class="awesome"></font-awesome-icon>
                                    </el-button>
                                </el-col>
                                <el-col :span="2">
                                    <el-button size="mini" @click="rotateImage(1)">
                                        <font-awesome-icon :icon="['fas', 'undo']" class="awesome"></font-awesome-icon>
                                    </el-button>
                                </el-col>
                                <el-col :span="2">
                                    <el-button size="mini" type="danger" @click="handleCancel">
                                        <font-awesome-icon :icon="['fas', 'times']" class="awesome"></font-awesome-icon>
                                    </el-button>
                                </el-col>
                                <el-col :span="2">
                                    <el-button size="mini" type="success" @click="sureToCrop">
                                        <font-awesome-icon :icon="['fas', 'check']" class="awesome"></font-awesome-icon>
                                    </el-button>
                                </el-col>
                            </el-row>
                            <div style="margin-top: 20px; display: flex; justify-content: center;">
                                <el-row style="width: 100%">
                                    <el-col :span="12" style="display: flex; justify-content: center;">
                                        <header-cropper ref="headerCropper"
                                                        :zoom-speed="12"
                                                        :initial-image="uploadImg"
                                                        @initial-image-loaded="updatePreview"
                                                        @mouseup.prevent="updatePreview"
                                                        @rotate="updatePreview"
                                                        @zoom="updatePreview"
                                        ></header-cropper>
                                    </el-col>
                                    <el-col :span="12" style="display: flex; justify-content: center;">
                                        <img :src="cropImg || ''"
                                             style="height: 148px; width: 148px; border-radius: 50%;"
                                             id="cropped-result"/>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-dialog>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    let userDataBackup = {};

    export default {
        name: "UserSettingsProfile",
        components: {
        },

        mounted() {
            const settingContainerHeight = document.documentElement.clientHeight - document.getElementById('setting-container').offsetTop;
            document.getElementById('setting-container').style.height = settingContainerHeight.toString() + 'px';
        },

        data() {

            return {
                toEdit: false,
                backUp: false,

                serviceUrl: Meteor.settings.public.serviceUrl,

                userData: {
                    email: '',
                    nickname: '',
                    headerImage: '',
                    age: '',
                    detail: '',
                },
                uploadImg: '',//上传的文件
                imageCropVisible: false,
                cropImg: '',//剪切的文件
                updateCropTime: 0,
            };
        },

        methods: {
            uploadSuccess(response, file, fileList) {
                console.log(response);
                this.uploadImg = this.serviceUrl + response.url;
                this.imageCropVisible = true;
                this.$refs.headerCropper.refresh();
            },
            handleClose(done) {
                this.$confirm('是否放弃更换头像并返回？')
                    .then(_ => {
                        this.$refs.imageUploader.clearFiles();
                        this.uploadImg = '';
                        this.cropImg = '';
                        done();
                    })
                    .catch(_ => {});
            },
            handleCancel() {
                this.$confirm('是否放弃更换头像并返回？')
                    .then(_ => {
                        this.$refs.imageUploader.clearFiles();
                        this.uploadImg = '';
                        this.cropImg = '';
                        this.imageCropVisible = false;
                    })
                    .catch(_ => {});
            },
            updatePreview() {
                const mycanvas = this.$refs.headerCropper.getCanvas();
                this.cropImg = mycanvas.toDataURL();
            },
            sureToCrop() {
                this.$refs.headerCropper.generateBlob(blob => {
                    const fd = new FormData();
                    fd.append('file', blob);
                    axios({
                        method: 'post',
                        url: this.serviceUrl + '/upload/header',
                        data: fd,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then( res => {
                        console.log(res.data);
                        this.userData.headerImage = res.data.url;
                    }).catch( err => {
                        console.log(err);
                    });
                });

                this.imageCropVisible = false;
            },
            rotateImage(step) {
                this.$refs.headerCropper.rotate(step);
            },
            cancelChange() {
                this.userData = userDataBackup;
                this.toEdit = false;
            },
            save() {
                this.$confirm('即将更改用户信息, 是否确认?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Meteor.call('user.edit', Meteor.userId(), this.userData, err => {
                        if(err) console.log(err);
                        else {
                            this.toEdit = false;
                            this.backUp = false;
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
        },

        meteor: {
            getUserData() {
                const user = Meteor.user()? Meteor.user(): Meteor.users.findOne({_id: localStorage.getItem('login-user-id')});
                // console.log(user);
                if(!user || !user.profile) return {};
                this.userData.email = user.profile.email;
                this.userData.nickname = user.profile.nickname;
                this.userData.age = user.profile.age;
                this.userData.headerImage = user.profile.headerImage;
                this.userData.detail = user.profile.detail;
                if(!this.backUp) {
                    userDataBackup.email = user.profile.email;
                    userDataBackup.nickname = user.profile.nickname;
                    userDataBackup.age = user.profile.age;
                    userDataBackup.headerImage = user.profile.headerImage;
                    userDataBackup.detail = user.profile.detail;
                    this.backUp = true;
                }
                return user;
            }
        }
    }
</script>

<style scoped>
    .setting-container {
        margin-top: 40px;
        margin-left: 40px;
    }
    .header-uploader {
        position: absolute;
        top: 0;
    }
</style>
