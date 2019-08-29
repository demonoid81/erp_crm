export const generateId = ((index = 0) => () => (index++).toString())()

export const inRange = (from, to, value) => (value < from ? from : (value > to ? to : value))

export const createModalEvent = (args = {}) => ({
	id: generateId(),
	timestamp: Date.now(),
	canceled: false,
	...args
})

export const getMutationObserver = () => {
	if (typeof window !== 'undefined') {
		const prefixes = ['', 'WebKit', 'Moz', 'O', 'Ms']

		for (let i = 0; i < prefixes.length; i++) {
			const name = `${prefixes[i]}MutationObserver`

			if (name in window) {
				return window[name]
			}
		}
	}

	return false
}

export const createDivInBody = () => {
	const div = document.createElement('div')
	document.body.appendChild(div)

	return div
}

export const blurActiveElement = () => {
	if (typeof document !== 'undefined'
		&& document.activeElement
		&& document.activeElement.tagName !== 'BODY'
		&& document.activeElement.blur) {
		document.activeElement.blur()

		return true
	}

	return false
}
