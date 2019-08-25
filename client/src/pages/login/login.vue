<template web>
    <div class="login">
        <div class="login-con">
            <login-form @on-success-valid="handleSubmit"/>
        </div>
    </div>
</template>

<!--<template native>-->

<!--</template>-->

<script>
    import {mapMutations} from 'vuex'
export default {
    name: 'login',
    components: {
        LoginForm: () => import('../../components/loginForm')
    },
    methods: {
        ...mapMutations(['ADD_TOKEN']),
        handleSubmit () {
            this.ADD_TOKEN('123456')
            this.$router.push({
                name: this.$config.mainPage
            })
        }
    }
}
</script>

<style lang="less" web>
    .login{
        width: 100%;
        height: 100%;
        background-image: url('../../../static/images/login-bg.jpg');
        background-size: cover;
        background-position: center;
        position: relative;
        &-con{
            position: absolute;
            right: 160px;
            top: 50%;
            transform: translateY(-60%);
            width: 300px;
        }
    }
</style>

<!--<style lang="less" native>-->

<!--</style>-->