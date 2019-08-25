<template web>
    <div class="login-form">
        <p>{{$t(pageStatus)}}</p>
        <div>
            <input v-model="person" :placeholder="$t('LOGIN')"/>
        </div>
        <div>
            <tel-input v-model="phone"></tel-input>
        </div>
        <slide-up-down :active="showSecurityCode">
            <security-code v-model="code"/>
        </slide-up-down>
        <slide-up-down :active="showPasswordInput">
            <input v-model="password" :placeholder="$t('PASSWORD')"/>
        </slide-up-down>
        <button @click='buttonAction' :disabled="isButtonDisabled" >{{$t(buttonLabel)}}</button>
        <a>{{$t(questionLabel)}}</a>
    </div>
</template>

<template native>
    
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'login-form',
    components: {
        SlideUpDown: () => import('../slideUpDown'),
        SecurityCode: () => import('../securityCode'),
        TelInput: () => import('../telInput')
    },
    data() {
        return {
            person: '',
            phone: '',
            password: '',
            code: '',
            personIdentified: false,
            pageStatus: 'LOGIN_PERSON', // 'REGISTER_PERSON'
            showPasswordInput: false,
            showSecurityCode: true,
            action: 'verifyPerson',
            actions: [
                {},{},{}
            ]
        }
    },
    methods: {
        ...mapActions(['identifyPersonByPhone']),
        buttonAction() {
            switch (this.action) {
                case 'verifyPerson': // проверям наличие пользователя
                    this.identifyPersonByPhone('123456')
                        .then(data=> {
                            
                            this.showPasswordInput = true
                            this.action = 'verifyPassword'
                        })
                        .catch()
                    break;
                case 'verifyPassword': // верифицируем пароль
                    this.showSecurityCode = true
                    this.$emit('on-success-valid', true)
                    break;                    
                case 'loginPerson': // логиним пользователя
                    
                    break;      
                case 'signUpPerson': // создаем пользователя
                    
                    break;          
                default:
                    break;
            }
        }
    },
    computed: {
        isButtonDisabled() {
            switch (this.action) {
                case 'verifyPerson':
                    return this.person.length < 6
                default:
                    return false
            }
        },
        buttonLabel() {
            switch (this.action) {
                case 'verifyPerson': // проверям наличие пользователя
                    return 'VERIFY'
                case 'verifyPassword': // верифицируем пароль
                    return 'SIGN_IN'                 
            }
        },
        questionLabel() {
            switch (this.action) {
                case 'verifyPerson' : return 'SIGN_UP?'
                case 'loginPerson' : return 'ARE_YOU_REGISTERED?'
                case 'signUpPerson' : return 'FORGOT YOUR PASSWORD?'
            
            }
        }
    }
}
</script>

<style lang="less" scoped web>
    .login-form {
        background-color: white;
        width: inherit;
        height: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>

<style lang="less" scoped native>

</style>