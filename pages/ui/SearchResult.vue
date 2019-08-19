<template>
    <div style="min-height: 650px; margin-top: 20px;">
        <el-row type="flex" justify="center">
            <el-col :span="16" class="filter-tabs">
                <el-tabs v-model="activeTabName" stretch style="margin-top: 10px;">
                    <el-tab-pane label="全部相关" name="all"></el-tab-pane>
                    <el-tab-pane label="短博" name="message"></el-tab-pane>
                    <el-tab-pane label="长文" name="article"></el-tab-pane>
                    <el-tab-pane label="用户" name="user"></el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'SearchResult',

        data() {
            return {
                activeTabName: 'all',
            }
        },
    }
</script>

<style scoped>
    .filter-tabs {
        background-color: #ffffff;
    }
</style>