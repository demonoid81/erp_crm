'use strict'

const _isObject = require('./isObject')

export const extractFiles = (tree, treePath) => {
	if (treePath === void 0) {
		treePath = ''
	}
	let files = []
	const recurse = function recurse (node, nodePath) {
		Object.keys(node).forEach(function (key) {
			if (!(0, _isObject.isObject)(node[key])) return
			let path = '' + nodePath + key
			if (
				(typeof File !== 'undefined' && node[key] instanceof File) ||
				(typeof Blob !== 'undefined' && node[key] instanceof Blob)
			) {
				files.push({
					path: path,
					file: node[key]
				})
				node[key] = null
				return
			}
			if (typeof FileList !== 'undefined' && node[key] instanceof FileList) {
				node[key] = Array.prototype.slice.call(node[key])
			}
			recurse(node[key], path + '.')
		})
	}
	if ((0, _isObject.isObject)(tree)) {
		recurse(tree, treePath === '' ? treePath : treePath + '.')
	}
	return files
}
