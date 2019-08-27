import dashboard from './dashboard'
import configs from './configs'
import settings from './settings'

export default [
	{
		path: '/login',
		name: 'login',
		meta: {
			title: 'Login - Вход',
			hideInMenu: true
		},
		component: () => import('@P/login/')
	},
	dashboard,
	configs,
	settings,
	{
		path: '*',
		redirect: '/errors'
	}
]
