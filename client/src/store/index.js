import Vue from 'vue'
import Vuex from 'vuex'
import vuexI18n from 'vuex-i18n'

import translationsRu from '../../static/i18n/ru.json'

import * as mutations from './mutations'
import * as getters from './getters'
import actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		token: localStorage.getItem('token') || '',
		access: []
	},
	getters,
	mutations,
	actions,
	modules: {}
})

Vue.use(vuexI18n.plugin, store)
Vue.i18n.add('ru', translationsRu)
Vue.i18n.set('ru')

export default store
