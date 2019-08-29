import components from '@/router/components'

export default {
	path: '/',
	name: '_home',
	redirect: '/home',
	component: components.MainForm,
	meta: {
		notCache: true,
		hideInMenu: true,
		icon: 'fa fa-download'
	},
	children: [
		{
			path: '/',
			name: 'home',
			meta: {
				hideInMenu: true,
				title: 'Главная',
				notCache: true,
				icon: 'fa fa-download'
			},
			component: components.Dashboard
		}
	]
}
