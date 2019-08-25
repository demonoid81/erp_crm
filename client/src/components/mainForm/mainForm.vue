<template web>
    <div class="main">

            <sidebar-menu
                :menu="menu"
                :collapsed="collapsed"
                :show-one-child="true"
                @toggle-collapse="onToggleCollapse"
                @item-click="onItemClick"
                style="flex-grow: 0"
            />

        <div class="main-content">
            <tags-nav class="main-content tag-nav-wrapper"/>
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

const separator = {
	template: '<hr style="border-color: rgba(0, 0, 0, 0.1); margin: 20px;">'
}

export default {
	name: 'main-form',
	components: {
		TagsNav: () => import('../tagsNav'),
		SidebarMenu: () => import('../sidebarMenu')
	},
	data() {
		return {
			collapsed: false,
			menu: [
				{
					href: '/',
					title: 'Installation',
					icon: 'fa fa-download'
				},
				{
					title: 'Basic Usage',
					icon: 'fa fa-code'
				},
				{
					title: 'Props',
					icon: 'fa fa-cogs'
				},
				{
					title: 'Events',
					icon: 'fa fa-bell'
				},
				{
					title: 'Styling',
					icon: 'fa fa-palette'
				},
				{
					component: separator
				},
				{
					title: 'Disabled page',
					icon: 'fa fa-lock',
					disabled: true
				},
				{
					title: 'Badge',
					icon: 'fa fa-cog',
					badge: {
						text: 'new',
						class: 'vsm--badge_default'
					}
				},
				{
					title: 'Dropdown Page',
					icon: 'fa fa-list-ul',
					child: [
						{
							title: 'Sub Page 01',
							icon: 'fa fa-file-alt'
						},
						{
							title: 'Sub Page 02',
							icon: 'fa fa-file-alt'
						}
					]
				},
				{
					title: 'Multiple Level',
					icon: 'fa fa-list-alt',
					child: [
						{
							title: 'page'
						},
						{
							title: 'Level 2 ',
							child: [
								{
									title: 'page'
								},
								{
									title: 'Page'
								}
							]
						},
						{
							title: 'Page'
						},
						{
							title: 'Another Level 2',
							child: [
								{
									title: 'Level 3',
									child: [
										{
											title: 'Page'
										},
										{
											title: 'Page'
										}
									]
								}
							]
						}
					]
				}
			]
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
                height:40px;
                background:#F0F0F0;
            }
        }
    }


</style>

<!--<style lang="less" native>-->

<!--</style>-->
