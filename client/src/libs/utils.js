import Cookies from 'js-cookie'
import config from '../../config'
import { hasOneOfArray } from '@/libs/tools'

const { title, cookieExpires } = config

export const hasChild = (item) => item.children && item.children.length !== 0

export const showThisMenuEle = (item, access) => hasOneOfArray(item, access)

export const getMenuByRouter = (list, access) => {
	const res = []
	list.forEach(item => {
		if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
			const obj = {
				icon: (item.meta && item.meta.icon),
				name: item.name,
				meta: item.meta
			}
			if (hasChild(item) || (item.meta && item.meta.showAlways)) {
				// && showThisMenuEle(item, access)) {
				obj.children = getMenuByRouter(item.children, access)
			}
			if (item.meta && item.meta.href) obj.href = item.meta.href
			// if (showThisMenuEle(item, access) || item.meta.showAlways)
				res.push(obj)
		}
	})
	return res
}

export const getRouteTitleHandled = route => {
	const router = { ...route }
	const meta = { ...route.meta }
	let title = ''
	if (meta.title) {
		if (typeof meta.title === 'function') {
			meta.__titleIsFunction__ = true
			title = meta.title(router)
		} else title = meta.title
	}
	meta.title = title
	router.meta = meta
	return router
}

export const showTitle = (item, vm) => {
	let { title, __titleIsFunction__ } = item.meta
	if (!title) return
	if (title.includes('{{') && title.includes('}}') && useI18n) title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
	else if (__titleIsFunction__) title = item.meta.title
	else title = vm.$t(item.name)
	return title
}

export const setTitle = (routeItem, vm) => {
	const handledRoute = getRouteTitleHandled(routeItem)
	const pageTitle = showTitle(handledRoute, vm)
	const resTitle = pageTitle ? `${title} - ${pageTitle}` : title
	window.document.title = resTitle
}
