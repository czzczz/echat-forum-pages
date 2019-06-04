<template>
    <div>
        <img/>
    </div>
</template>

<script>
    export default {
        name: "MenuBar",
        props: {
            position: {
                required: true,
                type: String,
                default: 'left'
            },
            userData: {
                required: true,
                type: Object
            },
            userOperations: {
                type: Object
            },
            alwaysShowedMenu: {
                type: Object
            },
            HomePage: {
                type: Object
            }
        },

        mounted() {

        },

        data() {
            return {
                menuPosition: '',
                user: {
                    name: '',
                    headerImg: '',
                    center: false,
                },
                operations: [],
                menu: [],
                HomePageShow: {
                    img: '',
                    path: '/',
                },
            };
        }
    }
</script>

<style scoped>

</style>