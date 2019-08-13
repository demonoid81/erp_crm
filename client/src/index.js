import Vue from 'vue'
import Vuex from 'vuex'
import store from './store'

new Vue ({
    el: '#app',
    store,
	render: h => h(App)
})