<template>
	<transition name="fade" v-if="fade">
		<div :class="classes" @click.stop="check" :style="wraperStyles">
			<span class="tag-dot-inner" v-if="showDot" :style="{color: String}"></span>
			<span class="tag-text" :style="textColorStyle"><slot></slot></span>
			<i v-if="closable" class="fal fa-times tag-close" @click.native.stop="close"></i>
		</div>
	</transition>
	<div v-else :class="classes" @click.stop="check" :style="wraperStyles">
		<span :class="dotClasses" v-if="showDot" :style="bgColorStyle"></span>
		<span :class="textClasses" :style="textColorStyle"><slot></slot></span>
		<i v-if="closable" class="fal fa-times tag-close" @click.native.stop="close"></i>
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
		textColor: {
			type: String,
			default: 'default'
		},
		borderColor: {
			type: String,
			default: 'default'
		},
		dotColor: {
			type: String,
			default: 'black'
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
		classes() {
			return [
				'tag',
				{
					[`tag-${this.type}`]: !!this.type,
					'tag-closable': this.closable
				}
			]
		},
		wraperStyles() {},
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

<style lang="less" scoped>
	.tag {
		display: inline-block;
		height: 22px;
		line-height: 22px;
		margin: 2px 4px 2px 0;
		padding: 0 8px;
		border: 1px solid black;
		border-radius: 4px;
		background: white;
		font-size: 14px;
		vertical-align: middle;
		opacity: 1;
		overflow: hidden;
		cursor: pointer;
		&-dot {
			height: 32px;
			line-height: 32px;
			border: 1px solid black !important;
			background: #fff !important;
			padding: 0 12px;

			&-inner {
				display: inline-block;
				width: 12px;
				height: 12px;
				margin-right: 8px;
				border-radius: 50%;
				background: black;
				position: relative;
				top: 1px;
			}
			.tag-close {
				color: #666 !important;
				margin-left: 12px !important;
			}
		}
		&-border {
			height: 24px;
			line-height: 24px;
			border: 1px solid black;
			color: black;
			background: #fff !important;
			position: relative;

			.tag-close {
				color: #666;
				margin-left: 12px !important;
			}

			&:after {
				content: "";
				display: none;
				width: 1px;
				background: currentColor;
				position: absolute;
				top: 0;
				bottom: 0;
				right: 22px;
			}

			&.tag-closable {
				&:after {
					display: block;
				}

				.tag-close {
					margin-left: 16px !important;
					left: 2px;
					top: 1px;
				}
			}
		}
		&:hover {
			opacity: 0.85;
		}
		&-text {
			a:first-child:last-child {
				display: inline-block;
				margin: 0 -8px;
				padding: 0 8px;
			}
			color: black;
		}
		&-close {
			cursor: pointer;
			margin-left: 2px;
			color: #666;
			opacity: 0.66;
			position: relative;
			top: -1px;
			&:hover {
				opacity: 1;
			}
		}

	}
</style>
