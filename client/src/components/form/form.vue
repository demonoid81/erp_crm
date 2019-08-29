<template>
    <form :class="classes" :autocomplete="autocomplete"><slot></slot></form>
</template>

<script>
import { oneOf } from '@/libs/assist'

export default {
	name: 'g-form',
	props: {
		labelWidth: {
			type: Number
		},
		labelPosition: {
			validator(value) {
				return oneOf(value, ['left', 'right', 'top'])
			},
			default: 'right'
		},
		inline: {
			type: Boolean,
			default: false
		},
		autocomplete: {
			validator(value) {
				return oneOf(value, ['on', 'off'])
			},
			default: 'off'
		}
	},
	provide() {
		return { form: this }
	},
	data() {
		return {
			fields: []
		}
	},
	methods: {
		resetFields() {
			this.fields.forEach(field => {
				field.resetField()
			})
		}
	},
	computed: {
		classes() {
			return ['form', `form-label-${this.labelPosition}`, { 'form-inline': this.inline }]
		}
	}
}
</script>

<style scoped lang="less">
    @import "form";
</style>
