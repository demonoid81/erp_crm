import { getMenuByRouter } from '@/libs/utils'
import routers from '@/router/routers'

export const isAuthenticated = state => !!state.token

export const menuList = state => getMenuByRouter(routers, state.access)
