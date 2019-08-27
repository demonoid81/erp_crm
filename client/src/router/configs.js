import MainForm from '@C/mainForm'

export default {
	path: '/',
	name: '_configs',
	redirect: '/configs',
	component: MainForm,
	meta: {
		title: 'Конфигурация',
		notCache: true,
		icon: 'fa fa-cogs'
	},
	children: [
		{
			path: '/',
			name: 'configs',
			meta: {
				title: 'Конфигурация',
				notCache: true,
				icon: 'fa fa-download'
			},
			component: () => import('@P/dashboard')
		}
	]
}
