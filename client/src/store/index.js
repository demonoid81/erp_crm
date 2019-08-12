import Vue from 'vue'
import Vuex from 'vuex'

import * as mutations from './mutations'
import * as getters from './getters'
import actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {},
    getters,
    mutations,
    actions,
    modules: {}
})