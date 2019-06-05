<template>
    <div @mouseleave="hideOperations">
        <div class="img-box" @mouseenter="showOperations" :style="{'height': imgHeight + 'px', 'width': imgWidth + 'px'}">
            <img :src="headerImage" :height="imgHeight + 'px'" :width="imgWidth + 'px'" @click="headerClick"/>
        </div>
        <div class="operation-box" v-if="showOp && hasOperations">
            <div class="operation" v-for="(opt, index) in operations" :key="index">
                <el-button type="text" @click="operationClick(opt.name)">{{opt.label}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "HeaderImage",

        props: ['userId', 'headerImage', 'operations', 'size'],

        mounted() {
            if(this.size) this.imgSize = this.size;
        },

        data() {
            return {
                showOp: false,
                imgSize: 'normal',
            }
        },

        methods: {
            headerClick() {
                // console.log('header clicked');
                this.$emit('header-click', this.userId);
            },
            showOperations() {
                // console.log('show');
                this.showOp = true;
            },
            hideOperations() {
                // console.log('hide');
                this.showOp = false;
            },
            operationClick(name) {
                // console.log(name, 'clicked');
                this.$emit('operation-click', this.userId, name);
            },
        },

        computed: {
            hasOperations() {
                return this.operations && this.operations.length && this.operations.length !== 0;
            },
            imgHeight() {
                if(this.imgSize === 'large') return 150;
                else if(this.imgSize === 'big') return 100;
                else if(this.imgSize === 'normal') return 50;
                else if(this.imgSize === 'small') return 40;
                else if(this.imgSize === 'mini') return 30;
                else return 50;
            },
            imgWidth() {
                if(this.imgSize === 'large') return 150;
                else if(this.imgSize === 'big') return 100;
                else if(this.imgSize === 'normal') return 50;
                else if(this.imgSize === 'small') return 40;
                else if(this.imgSize === 'mini') return 30;
                else return 50;
            },
        },
    }
</script>

<style scoped>
    .img-box {
        border-radius: 50%;
        /*border: 1px solid black;*/
        overflow: hidden;
    }
    .operation-box {
        width: 70px;
        right: 0;
        padding: 10px;
        border-radius: 5px;
        position: absolute;
        background-color: white;
        z-index: 999;
    }
    .operation {
        width: 100%;
        display: flex;
        justify-content: center;
    }
</style>