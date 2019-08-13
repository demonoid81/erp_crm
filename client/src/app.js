import Vue from 'vue'
import store from './store'
import router from './router'
import App from './app.vue'

window.Store = store

const app = new Vue ({
    el: '#app',
    store,
    router,
    render: h => h(App)
})

/*--@web--*/
app.$mount('#app')
/*--@web--*/

/*--@native--*/
app.$start()
/*--@native--*/
