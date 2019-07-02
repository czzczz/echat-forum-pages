<template>
    <el-row type="flex" justify="center" style="margin-top: 20px;">
        <el-col :span="13">
            <el-form label-width="80">
                <el-form-item label="标题" prop="title">
                    <el-input size="mini" placeholder="请输入文章标题" v-model="article.title" style="width: 80%"></el-input>
                    <div>提示(<span style="color: red">{{' * '}}</span>)：标题仅用作分享，文章标题请自行输入及设置格式</div>
                </el-form-item>
                <el-form-item>
                    <el-row type="flex" justify="end">
                        <el-col :span="2">
                            <el-button size="mini"@click="goBack">取消</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button size="mini" type="primary" @click="preview">预览</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button size="mini" type="primary" @click="publishArticle">发布</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <editor
                            id="inputer"
                            :api-key="tinyKey"
                            :init="editorInit"
                            v-model="article.content"></editor>
                </el-form-item>
            </el-form>
        </el-col>
        <el-dialog
                title="长文预览"
                :visible.sync="dialogPreviewVisible"
                width="50%">
            <div class="bottom clearfix" v-html="article.content">
                <span  class="message"  v-text="article.content"></span>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
    import Editor from '@tinymce/tinymce-vue';
    import axios from 'axios';


    export default {
        name: "ArticleAdd",

        components: {
            Editor,
        },

        mounted() {
        },

        data() {
            const TinymceImageUpload = (blobInfo, success, failure) => {
                    console.log(blobInfo);
                    if (blobInfo.blob().size > this.maxSize) {
                        failure('文件体积过大')
                    }
                    if (this.accept.indexOf(blobInfo.blob().type) >= 0) {
                        uploadPic()
                    } else {
                        failure('图片格式错误')
                    }
                    function uploadPic () {
                        const fd = new FormData();
                        fd.append('file', blobInfo.blob());
                        axios({
                            method: 'post',
                            url: Meteor.settings.public.serviceUrl + '/upload/image',
                            data: fd,
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then( res => {
                            console.log(res);
                            success(Meteor.settings.public.serviceUrl + res.data.url);
                        }).catch( err => {
                            console.log(err);
                            failure('上传失败');
                        });
                    }
                };

            return {
                article: {
                    title: '',
                    content: '',
                },

                accept: [
                    'image/jpeg',
                    'image/png',
                ],
                maxSize: 2097152,

                tinyKey: Meteor.settings.public.tinymceApiKey,

                editorInit: {
                    selector: '#inputer',
                    height: 500,
                    paste_data_images: true,
                    // menubar: false,
                    language_url: '/tinymce/langs/zh_CN.js',
                    language: 'zh_CN',
                    // skin_url: '/tinymce/skins/ui/oxide',
                    plugins: 'link autolink lists image code codesample table colorpicker textcolor wordcount contextmenu autoresize',
                    autoresize_bottom_margin: 200,
                    codesample_languages: [
                        {text: 'HTML/XML', value: 'markup'},
                        {text: 'JavaScript', value: 'javascript'},
                        {text: 'CSS', value: 'css'},
                        {text: 'PHP', value: 'php'},
                        {text: 'Ruby', value: 'ruby'},
                        {text: 'Python', value: 'python'},
                        {text: 'Java', value: 'java'},
                        {text: 'C', value: 'c'},
                        {text: 'C#', value: 'csharp'},
                        {text: 'C++', value: 'cpp'},
                        {text: 'Shell', value: 'sh'},
                    ],
                    toolbar: 'formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | codesample | image',
                    images_upload_handler: TinymceImageUpload,
                },

                dialogPreviewVisible: false,
            };
        },

        methods: {
            goBack() {
                this.$router.go(-1);
            },
            preview() {
                this.dialogPreviewVisible = true;
            },
            publishArticle() {
                if(!this.article.title || !this.article.content) {
                    this.$message.error({
                        message: '请填写标题并完善正文'
                    });
                }
                else {
                    Meteor.call('article.publish', this.article, sessionStorage.getItem('login-user-id'), (err, res) => {
                        if(err) console.log(err);
                        else {
                            this.$router.push({path: '/home'});
                        }
                    });
                }
            },
        }
    }
</script>

<style scoped>

</style>
