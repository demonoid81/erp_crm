<template>
	<transition name="fade" v-if="fade">
		<div :class="classes" @click.stop="check" :style="wraperStyles">
			<span :class="dotClasses" v-if="showDot" :style="bgColorStyle"></span>
			<span :class="textClasses" :style="textColorStyle"><slot></slot></span>
			<i v-if="closable" class="fal fa-times" @click.native.stop="close"></i>
<!--			<Icon v-if="closable" :class="iconClass" :color="lineColor" type="ios-close" @click.native.stop="close"></Icon>-->
		</div>
	</transition>
	<div v-else :class="classes" @click.stop="check" :style="wraperStyles">
		<span :class="dotClasses" v-if="showDot" :style="bgColorStyle"></span>
		<span :class="textClasses" :style="textColorStyle"><slot></slot></span>
		<i v-if="closable" class="fal fa-times" @click.native.stop="close"></i>
<!--		<Icon v-if="closable" :class="iconClass" :color="lineColor" type="ios-close" @click.native.stop="close"></Icon>-->
	</div>
</template>

<script>
import { oneOf } from '@/libs/assist'

export default {
	name: 'tag',
	props: {
		closable: {
			type: Boolean,
			default: false
		},
		checkable: {
			type: Boolean,
			default: false
		},
		checked: {
			type: Boolean,
			default: true
		},
		color: {
			type: String,
			default: 'default'
		},
		type: {
			validator(value) {
				return oneOf(value, ['border', 'dot'])
			}
		},
		name: {
			type: [String, Number]
		},
		fade: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			isChecked: this.checked
		}
	},
	computed: {
		classes() {},
		wraperStyles() {},
		dotClasses() {},
		textClasses() {},
		iconClass() {},
		bgColorStyle() {},
		textColorStyle() {},
		showDot() {
			return !!this.type && this.type === 'dot'
		}
	},
	methods: {
		close(event) {
			if (this.name === undefined) {
				this.$emit('on-close', event)
			} else {
				this.$emit('on-close', event, this.name)
			}
		},
		check() {
			if (!this.checkable) return
			const checked = !this.isChecked
			this.isChecked = checked
			if (this.name === undefined) {
				this.$emit('on-change', checked)
			} else {
				this.$emit('on-change', checked, this.name)
			}
		}
	},
	watch: {
		checked(val) {
			this.isChecked = val
		}
	}
}
</script>

<style scoped>

</style>
