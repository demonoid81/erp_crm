import Vue from 'vue'
import store from './store'
import router from './router'
import App from './app.vue'
import ProgressBar from './components/progressBar'

window.Store = store

const progressBarOptions = {
	color: '#1d71b8',
	failedColor: '#ff0100',
	thickness: '2px',
	transition: {
		speed: '0.2s',
		opacity: '0.6s',
		termination: 300
	},
	autoRevert: true,
	location: 'top',
	inverse: false
}


Vue.use(ProgressBar, { progressBarOptions })

const app = new Vue ({
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
