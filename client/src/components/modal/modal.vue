<template>
    <transition :name="overlayTransition">
        <div v-if="visibility.overlay"
             ref="overlay"
             :class="overlayClass"
             :aria-expanded="visibility.overlay.toString()"
             :data-modal="name">
            <div class="v--modal-background-click"
                 @mousedown.self="handleBackgroundClick"
                 @touchstart.self="handleBackgroundClick">
                <div class="v--modal-top-right">
                    <slot name="top-right"/>
                </div>
                <transition :name="transition"
                            @before-enter="beforeTransitionEnter"
                            @after-enter="afterTransitionEnter"
                            @after-leave="afterTransitionLeave">
                    <div v-if="visibility.modal"
                         ref="modal"
                         :class="modalClass"
                         :style="modalStyle">
                        <slot/>
                        <resizer v-if="resizable && !isAutoHeight"
                                 :min-width="minWidth"
                                 :min-height="minHeight"
                                 @resize="handleModalResize"/>
                    </div>
                </transition>
            </div>
        </div>
    </transition>
</template>

<script>
import Modal from './index'
import {
	inRange,
	createModalEvent,
	getMutationObserver,
	blurActiveElement
} from './utils'
import { parseNumber, validateNumber } from './parser'

export default {
	name: 'modal',
	props: {
		name: {
			required: true,
			type: String
		},
		delay: {
			type: Number,
			default: 0
		},
		resizable: {
			type: Boolean,
			default: false
		},
		adaptive: {
			type: Boolean,
			default: false
		},
		draggable: {
			type: [Boolean, String],
			default: false
		},
		scrollable: {
			type: Boolean,
			default: false
		},
		reset: {
			type: Boolean,
			default: false
		},
		overlayTransition: {
			type: String,
			default: 'overlay-fade'
		},
		transition: {
			type: String
		},
		clickToClose: {
			type: Boolean,
			default: true
		},
		classes: {
			type: [String, Array],
			default: 'v--modal'
		},
		minWidth: {
			type: Number,
			default: 0,
			validator(value) {
				return value >= 0
			}
		},
		minHeight: {
			type: Number,
			default: 0,
			validator(value) {
				return value >= 0
			}
		},
		maxWidth: {
			type: Number,
			default: Infinity
		},
		maxHeight: {
			type: Number,
			default: Infinity
		},
		width: {
			type: [Number, String],
			default: 600,
			validator: validateNumber
		},
		height: {
			type: [Number, String],
			default: 300,
			validator(value) {
				return value === 'auto' || validateNumber(value)
			}
		},
		pivotX: {
			type: Number,
			default: 0.5,
			validator(value) {
				return value >= 0 && value <= 1
			}
		},
		pivotY: {
			type: Number,
			default: 0.5,
			validator(value) {
				return value >= 0 && value <= 1
			}
		}
	},
	components: {
		Resizer: () => import('./resizer.vue')
	},
	data() {
		return {
			visible: false,
			visibility: {
				modal: false,
				overlay: false
			},
			shift: {
				left: 0,
				top: 0
			},
			modal: {
				width: 0,
				widthType: 'px',
				height: 0,
				heightType: 'px',
				renderedHeight: 0
			},
			window: {
				width: 0,
				height: 0
			},
			mutationObserver: null
		}
	},
	created() {
		this.setInitialSize()
	},
	beforeMount() {
		Modal.event.$on('toggle', this.handleToggleEvent)
		window.addEventListener('resize', this.handleWindowResize)
		this.handleWindowResize()
		if (this.scrollable && !this.isAutoHeight) {
			console.warn(
				`Modal "${this.name}" has scrollable flag set to true `
					+ `but height is not "auto" (${this.height})`
			)
		}
		if (this.isAutoHeight) {
			const MutationObserver = getMutationObserver()
			if (MutationObserver) {
				this.mutationObserver = new MutationObserver(mutations => {
					this.updateRenderedHeight()
				})
			}
		}
		if (this.clickToClose) {
			window.addEventListener('keyup', this.handleEscapeKeyUp)
		}
	},
	beforeDestroy() {
		Modal.event.$off('toggle', this.handleToggleEvent)
		window.removeEventListener('resize', this.handleWindowResize)
		if (this.clickToClose) {
			window.removeEventListener('keyup', this.handleEscapeKeyUp)
		}
		if (this.scrollable) {
			document.body.classList.remove('v--modal-block-scroll')
		}
	},
	computed: {
		isAutoHeight() {
			return this.modal.heightType === 'auto'
		},
		position() {
			const {
				window,
				shift,
				pivotX,
				pivotY,
				trueModalWidth,
				trueModalHeight
			} = this
			const maxLeft = window.width - trueModalWidth
			const maxTop = window.height - trueModalHeight
			const left = shift.left + pivotX * maxLeft
			const top = shift.top + pivotY * maxTop
			return {
				left: parseInt(inRange(0, maxLeft, left)),
				top: parseInt(inRange(0, maxTop, top))
			}
		},
		trueModalWidth() {
			const {
				window, modal, adaptive, minWidth, maxWidth
			} = this
			const value = modal.widthType === '%'
				? window.width / 100 * modal.width
				: modal.width
			const max = Math.min(window.width, maxWidth)
			return adaptive
				? inRange(minWidth, max, value)
				: value
		},
		trueModalHeight() {
			const {
				window, modal, isAutoHeight, adaptive, maxHeight
			} = this
			const value = modal.heightType === '%'
				? window.height / 100 * modal.height
				: modal.height
			if (isAutoHeight) {
				// use renderedHeight when height 'auto'
				return this.modal.renderedHeight
			}
			const max = Math.min(window.height, maxHeight)
			return adaptive
				? inRange(this.minHeight, max, value)
				: value
		},
		overlayClass() {
			return {
				'v--modal-overlay': true,
				scrollable: this.scrollable && this.isAutoHeight
			}
		},
		modalClass() {
			return ['v--modal-box', this.classes]
		},
		modalStyle() {
			return {
				top: `${this.position.top}px`,
				left: `${this.position.left}px`,
				width: `${this.trueModalWidth}px`,
				height: this.isAutoHeight ? 'auto' : `${this.trueModalHeight}px`
			}
		}
	},
	watch: {
		visible(value) {
			if (value) {
				this.visibility.overlay = true
				setTimeout(() => {
					this.visibility.modal = true
					this.$nextTick(() => {
						this.addDraggableListeners()
						this.callAfterEvent(true)
					})
				}, this.delay)
			} else {
				this.visibility.modal = false
				setTimeout(() => {
					this.visibility.overlay = false
					this.$nextTick(() => {
						this.removeDraggableListeners()
						this.callAfterEvent(false)
					})
				}, this.delay)
			}
		}
	},
	methods: {
		handleToggleEvent(name, state, params) {
			if (this.name === name) {
				const nextState = typeof state === 'undefined'
					? !this.visible
					: state
				this.toggle(nextState, params)
			}
		},
		setInitialSize() {
			const { modal } = this
			const width = parseNumber(this.width)
			const height = parseNumber(this.height)
			modal.width = width.value
			modal.widthType = width.type
			modal.height = height.value
			modal.heightType = height.type
		},
		handleEscapeKeyUp(event) {
			if (event.which === 27 && this.visible) {
				this.$modal.hide(this.name)
			}
		},
		handleWindowResize() {
			this.window.width = window.innerWidth
			this.window.height = window.innerHeight
			this.ensureShiftInWindowBounds()
		},
		createModalEvent(args = {}) {
			return createModalEvent({
				name: this.name,
				ref: this.$refs.modal,
				...args
			})
		},
		handleModalResize(event) {
			this.modal.widthType = 'px'
			this.modal.width = event.size.width
			this.modal.heightType = 'px'
			this.modal.height = event.size.height
			const { size } = this.modal
			this.$emit(
				'resize',
				this.createModalEvent({ size })
			)
		},
		toggle(nextState, params) {
			const { reset, scrollable, visible } = this
			if (visible === nextState) {
				return
			}
			const beforeEventName = visible
				? 'before-close'
				: 'before-open'
			if (beforeEventName === 'before-open') {
				blurActiveElement()
				if (reset) {
					this.setInitialSize()
					this.shift.left = 0
					this.shift.top = 0
				}
				if (scrollable) {
					document.body.classList.add('v--modal-block-scroll')
				}
			} else if (scrollable) {
				document.body.classList.remove('v--modal-block-scroll')
			}
			let stopEventExecution = false
			const stop = () => {
				stopEventExecution = true
			}
			const beforeEvent = this.createModalEvent({
				stop,
				state: nextState,
				params
			})
			this.$emit(beforeEventName, beforeEvent)
			if (!stopEventExecution) {
				this.visible = nextState
			}
		},
		getDraggableElement() {
			const selector = typeof this.draggable !== 'string'
				? '.v--modal-box'
				: this.draggable
			return selector
				? this.$refs.overlay.querySelector(selector)
				: null
		},
		handleBackgroundClick() {
			if (this.clickToClose) {
				this.toggle(false)
			}
		},
		callAfterEvent(state) {
			if (state) {
				this.connectObserver()
			} else {
				this.disconnectObserver()
			}
			const eventName = state ? 'opened' : 'closed'
			const event = this.createModalEvent({ state })
			this.$emit(eventName, event)
		},
		addDraggableListeners() {
			if (!this.draggable) {
				return
			}
			const dragger = this.getDraggableElement()
			if (dragger) {
				let startX = 0
				let startY = 0
				let cachedShiftX = 0
				let cachedShiftY = 0
				const getPosition = event => (event.touches && event.touches.length > 0
					? event.touches[0]
					: event)
				const handleDraggableMousedown = event => {
					const { target } = event
					if (target && target.nodeName === 'INPUT') {
						return
					}
					const { clientX, clientY } = getPosition(event)
					document.addEventListener('mousemove', handleDraggableMousemove)
					document.addEventListener('touchmove', handleDraggableMousemove)
					document.addEventListener('mouseup', handleDraggableMouseup)
					document.addEventListener('touchend', handleDraggableMouseup)
					startX = clientX
					startY = clientY
					cachedShiftX = this.shift.left
					cachedShiftY = this.shift.top
				}
				const handleDraggableMousemove = event => {
					const { clientX, clientY } = getPosition(event)
					this.shift.left = cachedShiftX + clientX - startX
					this.shift.top = cachedShiftY + clientY - startY
					event.preventDefault()
				}
				const handleDraggableMouseup = event => {
					this.ensureShiftInWindowBounds()
					document.removeEventListener('mousemove', handleDraggableMousemove)
					document.removeEventListener('touchmove', handleDraggableMousemove)
					document.removeEventListener('mouseup', handleDraggableMouseup)
					document.removeEventListener('touchend', handleDraggableMouseup)
					event.preventDefault()
				}
				dragger.addEventListener('mousedown', handleDraggableMousedown)
				dragger.addEventListener('touchstart', handleDraggableMousedown)
			}
		},
		removeDraggableListeners() {

		},
		updateRenderedHeight() {
			if (this.$refs.modal) {
				this.modal.renderedHeight = this.$refs.modal.getBoundingClientRect().height
			}
		},
		connectObserver() {
			if (this.mutationObserver) {
				this.mutationObserver.observe(this.$refs.overlay, {
					childList: true,
					attributes: true,
					subtree: true
				})
			}
		},
		disconnectObserver() {
			if (this.mutationObserver) {
				this.mutationObserver.disconnect()
			}
		},
		beforeTransitionEnter() {
			this.connectObserver()
		},
		afterTransitionEnter() {
			// console.log('after transition enter')
		},
		afterTransitionLeave() {
			// console.log('after transition leave')
		},
		ensureShiftInWindowBounds() {
			const {
				window,
				shift,
				pivotX,
				pivotY,
				trueModalWidth,
				trueModalHeight
			} = this
			const maxLeft = window.width - trueModalWidth
			const maxTop = window.height - trueModalHeight
			const left = shift.left + pivotX * maxLeft
			const top = shift.top + pivotY * maxTop
			this.shift.left -= left - inRange(0, maxLeft, left)
			this.shift.top -= top - inRange(0, maxTop, top)
		}
	}
}
</script>

<style lang="less" scoped>
    .v--modal-block-scroll {
        overflow: hidden;
        width: 100vw;
    }
    .v--modal-overlay {
        position: fixed;
        box-sizing: border-box;
        left: 0;
        top: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.2);
        z-index: 999;
        opacity: 1;
    }
    .v--modal-overlay.scrollable {
        height: 100%;
        min-height: 100vh;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    .v--modal-overlay .v--modal-background-click {
        width: 100%;
        min-height: 100%;
        height: auto;
    }
    .v--modal-overlay .v--modal-box {
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
    }
    .v--modal-overlay.scrollable .v--modal-box {
        margin-bottom: 2px;
    }
    .v--modal {
        background-color: white;
        text-align: left;
        border-radius: 3px;
        box-shadow: 0 20px 60px -2px rgba(27, 33, 58, 0.4);
        padding: 0;
        &-top-right {
            display: block;
            position: absolute;
            right: 0;
            top: 0;
        }
        .v--modal-fullscreen {
            width: 100vw;
            height: 100vh;
            margin: 0;
            left: 0;
            top: 0;
        }
    }


    .overlay-fade-enter-active,
    .overlay-fade-leave-active {
        transition: all 0.2s;
    }
    .overlay-fade-enter,
    .overlay-fade-leave-active {
        opacity: 0;
    }
    .nice-modal-fade-enter-active,
    .nice-modal-fade-leave-active {
        transition: all 0.4s;
    }
    .nice-modal-fade-enter,
    .nice-modal-fade-leave-active {
        opacity: 0;
        transform: translateY(-20px);
    }
</style>
