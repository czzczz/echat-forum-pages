<template>
    <div>Index</div>
</template>

<script>
    export default {
        name: "Index",
        mounted() {
            console.log('Index');
            if(!Meteor.userId()) {
                this.$router.push({name: 'login'});
            }
            else {
                this.$router.push({name: 'home'});
            }
        },
    }
</script>

<style scoped>

</style>