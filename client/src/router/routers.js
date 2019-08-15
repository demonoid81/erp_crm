import MainForm from '@C/mainForm'

export default [
    {
        path: '/login',
        name: 'login',
        meta: {
          title: 'Login - Вход',
          hideInMenu: true
        },
        component: () => import('@/pages/login/')
    },{
        path: '/',
        name: '_home',
        redirect: '/home',
        component: MainForm,
        meta: {
          hideInMenu: true,
          notCache: true
        },
        children: [
            {
                path: '/',
                name: 'home',
                meta: {
                  hideInMenu: true,
                  title: 'Главная',
                  notCache: true,
                  icon: 'md-home'
                },
                component: () => import('@P/dashboard')
              }
        ]
    },{
      path: '*',
      redirect: '/errors',
    }
]