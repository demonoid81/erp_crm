export const hasOneOf = (targetArr, arr) => {
	return targetArr.some(_ => arr.indexOf(_) > -1)
}

export const hasOneOfArray = (value, arr) => {
	return arr.some(_ => value === _)
}
