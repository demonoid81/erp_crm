const directions = {
	x: ['left', 'center', 'right'],
	y: ['top', 'bottom']
}

export const Id = (i => () => i++)(0)

export const split = value => {
	if (typeof value !== 'string') {
		return []
	}

	return value.split(/\s+/gi).filter(v => v)
}

export const listToDirection = value => {
	if (typeof value === 'string') {
		value = split(value)
	}

	let x = null
	let y = null

	value.forEach(v => {
		if (directions.y.indexOf(v) !== -1) {
			y = v
		}
		if (directions.x.indexOf(v) !== -1) {
			x = v
		}
	})

	return { x, y }
}
