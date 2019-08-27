<template>
	<div class="tags-nav">
		<button class="btn-con left-btn" @click="handleScroll(240)">
			<i class="fal fa-arrow-circle-left"></i>
		</button>
		<button class="btn-con right-btn" @click="handleScroll(-240)">
			<i class="fal fa-arrow-circle-right"></i>
		</button>
		<button class="close-con">
			<i class="fal fa-times-circle"></i>
		</button>
		<div class="scroll-outer" ref="scrollOuter" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
			<div ref="scrollBody" class="scroll-body" :style="{left: tagBodyLeft + 'px'}">
				<template v-for="(item, index) in list">
					<div class="tab" :key="`tag-nav-${index}`" :class="[ (!item.active) ? '' : 'active' ]">
						<span class="tab-dot" :style="{color: item.String}"></span>
						<span class="tab-text">{{item.name}}</span>
						<i class="fal fa-times tab-close" @click.native.stop="close"></i>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'tabs-nav',
	components: {
		Tag: () => import('../tag')
	},
	data() {
		return {
			tagBodyLeft: 0,
			list: [
				{ name: 'dsafgevdfv' },
				{ name: '324134qrtewr' },
				{ name: 'dsafgevdfv', active: true },
				{ name: '324134qrtewr' },
				{ name: 'dsafgevdfv' },
				{ name: '324134qrtewr' },
				{ name: 'dsafgevdfv' },
				{ name: '324134qrtewr' },
				{ name: 'dsafgevdfv' },
				{ name: '324134qrtewr' },
				{ name: 'dsafgevdfv' },
				{ name: '324134qrtewr' }
			]
		}
	},
	methods: {
		handlescroll(e) {
			const { type } = e
			let delta = 0
			if (type === 'DOMMouseScroll' || type === 'mousewheel') {
				delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
			}
			this.handleScroll(delta)
		},
		handleScroll(offset) {
			const outerWidth = this.$refs.scrollOuter.offsetWidth
			const bodyWidth = this.$refs.scrollBody.offsetWidth
			if (offset > 0) {
				this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
			} else if (outerWidth < bodyWidth) {
				if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
					this.tagBodyLeft = this.tagBodyLeft
				} else {
					this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, outerWidth - bodyWidth)
				}
			} else {
				this.tagBodyLeft = 0
			}
		}
	}
}
</script>

<style lang="less" scoped>
	.tags-nav{
		position: relative;
		margin-top: 2px;
		.close-con{
			position: absolute;
			right: 0;
			top: 0;
			height: 100%;
			width: 32px;
			background: #fff;
			text-align: center;
			z-index: 10;
		}
		.btn-con{
			position: absolute;
			top: 0px;
			height: 100%;
			background: #fff;
			padding-top: 3px;
			z-index: 10;
			button{
				padding: 6px 4px;
				line-height: 14px;
				text-align: center;
			}
			&.left-btn{
				left: 0px;
			}
			&.right-btn{
				right: 32px;
				border-right: 1px solid #F0F0F0;
			}
		}
		.scroll-outer{
			position: absolute;
			left: 28px;
			right: 61px;
			top: 0;
			bottom: 0;
			.scroll-body{
				height: ~"calc(100% - 1px)";
				display: flex;
				padding: 1px 4px 0;
				position: absolute;
				overflow: hidden;
				white-space: nowrap;
				transition: left .3s ease;


				/*.ivu-tag-dot-inner{*/
				/*	transition: background .2s ease;*/
				/*}*/
			}
		}
	}

	.tab{
		height: 30px;
		line-height: 30px;
		display: inline-block;
		float: left;
		cursor: pointer;
		padding: 2px 10px;
		transition: background-color 0.2s;
		border: 1px solid #8e8e8e;
		border-right: none;
		background-color: #f1f1f1;
		border-radius: 4px 4px 0 0;
		font-weight: bold;
		margin-bottom: -2px;
		&:last-child {
			border-right: 1px solid #ccc;
		}
		&:hover {
			background-color: #aaa;
			color: #fff;
		}
		&.active {
			background-color: #fff;
			color: #484848;
			border-bottom: 2px solid #fff;
			cursor: default;
		}
		&-dot {
			display: inline-block;
			width: 12px;
			height: 12px;
			margin-right: 8px;
			border-radius: 50%;
			background: black;
			position: relative;
			top: 1px;
		}
		&-text {
			font-size: 14px;
		}
		&-close {
			cursor: pointer;
			margin-left: 6px;
			color: #2a2a2e;
			opacity: 0.66;
			position: relative;
			top: 1px;
			&:hover {
				opacity: 1;
			}
		}
	}
</style>
