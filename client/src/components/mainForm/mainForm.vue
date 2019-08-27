<template web>
	<div class="main">

		<sidebar-menu
				:menu="menu"
				:collapsed="collapsed"
				:show-one-child="true"
				@toggle-collapse="onToggleCollapse"
				@item-click="onItemClick"
				style="flex-grow: 0">
			<template slot="header">
				<div class="menu">
					<i class="fa fa-home menu-home-icon"></i>
				</div>
			</template>
		</sidebar-menu>


		<div class="main-content">
			<tabs-nav class="main-content tag-nav-wrapper"/>
			<router-view/>
		</div>
		<div style="width: 50px; height: 100%; background-color: #2a2a2e">
			were
		</div>
	</div>
</template>

<!--<template native>-->
<!--    -->
<!--</template>-->

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'main-form',
	components: {
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
</style>

<!--<style lang="less" native>-->

<!--</style>-->
