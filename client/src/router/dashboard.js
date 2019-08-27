import MainForm from '@C/mainForm'

export default {
	path: '/',
	name: '_home',
	redirect: '/home',
	component: MainForm,
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
			component: () => import('@P/dashboard')
		}
	]
}
