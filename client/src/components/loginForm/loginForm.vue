<template web>
    <div class="login-form">
        <p>{{$t(pageStatus)}}</p>
        <div>
            <input v-model="person" :placeholder="$t('LOGIN')"/>
        </div>
        <slide-up-down :active="showPasswordInput">
            <input v-model="password" :placeholder="$t('PASSWORD')"/>
        </slide-up-down>
        <slide-up-down :active="showPasswordConfirmationInput">
            <input v-model="password" :placeholder="$t('PASSWORD_CONFIRMATION')"/>
        </slide-up-down>
        <button @click='buttonAction' :disabled="isButtonDisabled" >{{$t(buttonLabel)}}</button>
        <a>{{$t(questionLabel)}}</a>
    </div>
</template>

<template native>
    
</template>

<script>
import { mapActions } from 'vuex'
import gql from 'graphql-tag'

const IDENTIFY_PERSON_BY_PHONE = gql`
    query ($phone: String!) {
        identifyPersonByPhone(phone: $phone) {
            idented
            hasPassword
            authToken
        }
    }
`

export default {
    name: 'login-form',
    components: {
        SlideUpDown: () => import('../slideUpDown')
    },
    data() {
        return {
            person: '',
            password: '',
            passwordConfirmation: '',
            pageStatus: 'LOGIN_PERSON', // 'REGISTER_PERSON'
            showPasswordInput: false,
            showPasswordConfirmationInput: false,
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
                    this.showPasswordConfirmationInput = true
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
                    return true
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