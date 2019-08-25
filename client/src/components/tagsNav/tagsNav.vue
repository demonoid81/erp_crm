<template>
	<div class="tags-nav">
		<button class="btn-con left-btn">
			<i class="fal fa-arrow-circle-left"></i>
		</button>
		<button class="btn-con right-btn">
			<i class="fal fa-arrow-circle-right"></i>
		</button>
		<button class="close-con">
			<i class="fal fa-times-circle"></i>
		</button>
		<div class="scroll-outer" ref="scrollOuter" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
			<div ref="scrollBody" class="scroll-body" :style="{left: tagBodyLeft + 'px'}">
				<transition-group name="taglist-moving-animation">
					<tag type="dot" v-for="(item, index) in list" :key="`tag-nav-${index}`" >
						{{item.name}}
					</tag>
				</transition-group>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'tagsNav',
	components: {
		Tag: () => import('../tag')
	},
	data() {
		return {
			tagBodyLeft: 0,
			list: [
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
		border-top: 1px solid #F0F0F0;
		border-bottom: 1px solid #F0F0F0;
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
	}
</style>
