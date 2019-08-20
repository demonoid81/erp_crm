import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '../store'
import { getToken, setTitle } from '@/libs/utils'

Vue.use(Router)

const LOGIN_PAGE_NAME = 'login'

const router = new Router({
	routes,
	mode: 'history',
	scrollBehavior() {
		return { x: 0, y: 0 };
	},
})

router.beforeEach((to, from, next) => {
	const token = store.state.token
	if (!token && to.name !== LOGIN_PAGE_NAME) {
		next({name: LOGIN_PAGE_NAME})
	} else if (!token && to.name === LOGIN_PAGE_NAME) {
		next()
	} else if (token && to.name === LOGIN_PAGE_NAME) {
		next({name: 'dashboard'})
	}
})

router.afterEach(to => {
	setTitle(to, router.app)
})

export default router