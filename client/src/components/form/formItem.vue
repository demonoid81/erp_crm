<template>
    <div :class="classes">
        <label :class="['form-item-label']" :for="labelFor" :style="labelStyles" v-if="label || $slots.label"><slot name="label">{{ label }}</slot></label>
        <div :class="['form-item-content']" :style="contentStyles">
            <slot></slot>
            <transition name="fade">
                <div :class="['form-item-error-tip']" v-if="validateState === 'error' && showMessage && form.showMessage">{{ validateMessage }}</div>
            </transition>
        </div>
    </div>
</template>

<script>
import Emitter from '@/mixins/emitter'

function getPropByPath(obj, path) {
	let tempObj = obj
	path = path.replace(/\[(\w+)\]/g, '.$1')
	path = path.replace(/^\./, '')
	const keyArr = path.split('.')
	let i = 0
	for (let len = keyArr.length; i < len - 1; ++i) {
		const key = keyArr[i]
		if (key in tempObj) {
			tempObj = tempObj[key]
		} else {
			throw new Error('[Form warn]: please transfer a valid prop path to form item!')
		}
	}
	return {
		o: tempObj,
		k: keyArr[i],
		v: tempObj[keyArr[i]]
	}
}
export default {
	name: 'form-item',
	mixins: [Emitter],
	props: {
		label: {
			type: String,
			default: ''
		},
		labelWidth: {
			type: Number
		},
		prop: {
			type: String
		},
		showMessage: {
			type: Boolean,
			default: true
		},
		labelFor: {
			type: String
		}
	},
	data() {
		return {
			validateState: '',
			validateMessage: '',
			validateDisabled: false
		}
	},
	inject: ['form'],
	methods: {
		resetField() {
			const { model } = this.form
			const value = this.fieldValue
			let path = this.prop
			if (path.indexOf(':') !== -1) {
				path = path.replace(/:/, '.')
			}
			const prop = getPropByPath(model, path)
			if (Array.isArray(value)) {
				prop.o[prop.k] = [].concat(this.initialValue)
			} else {
				prop.o[prop.k] = this.initialValue
			}
		}
	},
	computed: {
		classes() {
			return [
				'form-item',
				{
					'form-item': this.required || this.isRequired,
					'form-item-error': this.validateState === 'error',
					'form-item-validating': this.validateState === 'validating'
				}
			]
		},
		fieldValue() {
			const { model } = this.form
			if (!model || !this.prop) { return }
			let path = this.prop
			if (path.indexOf(':') !== -1) {
				path = path.replace(/:/, '.')
			}
			return getPropByPath(model, path).v
		},
		labelStyles() {
			const style = {}
			const labelWidth = this.labelWidth === 0 || this.labelWidth ? this.labelWidth : this.form.labelWidth
			if (labelWidth || labelWidth === 0) {
				style.width = `${labelWidth}px`
			}
			return style
		},
		contentStyles() {
			const style = {}
			const labelWidth = this.labelWidth === 0 || this.labelWidth ? this.labelWidth : this.form.labelWidth
			if (labelWidth || labelWidth === 0) {
				style.marginLeft = `${labelWidth}px`
			}
			return style
		}
	},
	mounted() {
		if (this.prop) {
			this.dispatch('Form', 'on-form-item-add', this)
			Object.defineProperty(this, 'initialValue', {
				value: this.fieldValue
			})
			// this.setRules()
		}
	},
	beforeDestroy() {
		this.dispatch('Form', 'on-form-item-remove', this)
	}
}
</script>

<style scoped lang="less">
    @import "form";
</style>
