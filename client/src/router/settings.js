import components from '@/router/components'

export default {
	path: '/',
	name: '_settings',
	redirect: '/settings',
	component: components['MainForm'],
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
			component: components.Dashboard
		}
	]
}
