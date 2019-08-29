export default {
	position: ['top', 'right'],
	cssAnimation: 'vn-fade',
	velocityAnimation: {
		enter: el => {
			const height = el.clientHeight

			return {
				height: [height, 0],
				opacity: [1, 0]
			}
		},
		leave: {
			height: 0,
			opacity: [0, 1]
		}
	}
}
