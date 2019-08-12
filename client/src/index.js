import Vue from 'vue'
import Vuex from 'vuex'
import store from './store'


const store = new Vuex.Store()


new Vue ({
    el: '#app',
	render: h => h(App)
})