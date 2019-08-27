<template web>
	<div class="main">

		<sidebar-menu
				:menu="menu"
				:collapsed="collapsed"
				:show-one-child="true"
				@toggle-collapse="onToggleCollapse"
				@item-click="onItemClick"
				style="flex-grow: 0">
			<template #header="{ isCollapsed }">
				<div class="menu">
					<i class="menu-icon fa fa-home"></i>
					<span v-if="!isCollapsed" class="menu-text">Главная</span>
				</div>
			</template>
		</sidebar-menu>


		<div class="main-content">
			<tabs-nav class="main-content tag-nav-wrapper"/>
			<router-view/>
		</div>
		<functional-menu/>
	</div>
</template>

<!--<template native>-->
<!--    -->
<!--</template>-->

<script>
import { mapGetters } from 'vuex'
import FunctionalMenu from '@C/functionalMenu/functionalMenu'

export default {
	name: 'main-form',
	components: {
		FunctionalMenu,
		TabsNav: () => import('../tabsNav'),
		SidebarMenu: () => import('../sidebarMenu')
	},
	data() {
		return {
			collapsed: false
		}
	},
	methods: {
		onToggleCollapse(collapsed) {
			console.log(collapsed)
			this.collapsed = collapsed
		},
		onItemClick(event, item) {
			console.log('onItemClick')
			// console.log(event)
			// console.log(item)
		}
	},
	computed: {
		...mapGetters(['menuList']),
		menu() {
			console.log(this.menuList)
			return this.menuList
		}
	}
}
</script>

<style lang="less" web>
	.main {
		display: flex;
		width: 100%;
		height: 100%;
		&-content {
			flex-grow: 1;
			.tag-nav-wrapper{
				padding: 0;
				height: 41px;
			}
		}
	}
	.menu {
		position: relative;
		display: block;
		font-size: 16px;
		font-weight: 400;
		padding: 5px 10px;
		line-height: 30px;
		text-decoration: none;
		z-index: 20;
		transition: 0.3s all;
		&-icon {
			float: left;
			margin-right: 10px;
			padding: 6px;
			height: 30px;
			line-height: 30px;
			width: 30px;
			text-align: center;
			box-sizing: border-box;
			border-radius: 3px;
			background-color: #191919;
			color: #fff;
		}
		&-text {
			display: block;
			white-space: nowrap;
			color: white;
		}
	}
</style>

<!--<style lang="less" native>-->

<!--</style>-->
