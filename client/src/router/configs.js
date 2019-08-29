import components from '@/router/components'

export default {
	path: '/configs',
	name: '_configs',
	redirect: '/configs',
	component: components.MainForm,
	meta: {
		title: 'Конфигурация',
		notCache: true,
		icon: 'fa fa-cogs'
	},
	children: [
		{
			path: 'role-configurator',
			name: 'role-configurator',
			meta: {
				title: 'Конфигуратор ролей',
				notCache: true,
				icon: 'fa fa-users-cog'
			},
			component: components.RoleEditor
		}
	]
}
