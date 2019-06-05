<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/user/settings' }">个人设置</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/user/settings/base' }">常用设置</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="setting-container">
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserSettingsBase"
    }
</script>

<style scoped>
    .setting-container {
        margin-top: 20px;
    }
</style>