import MainForm from '@C/mainForm'

export default {
	path: '/',
	name: '_settings',
	redirect: '/settings',
	component: MainForm,
	meta: {
		notCache: true,
		title: 'Настройки',
		icon: 'fa fa-sliders-v'
	},
	children: [
		{
			path: '/',
			name: 'settings',
			meta: {
				title : 'Настройки',
				notCache: true,
				icon: 'fa fa-download'
			},
			component: () => import('@P/dashboard')
		}
	]
}
