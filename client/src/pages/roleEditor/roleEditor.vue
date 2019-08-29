<template>
    <split-panes class="roles">
        <roles/>
        <routes/>
        <route-components/>
        <actions/>
    </split-panes>
</template>

<script>

export default {
	name: 'roleEditor',
	components: {
		Actions: () => import('./components/actions'),
		RouteComponents: () => import('./components/routeComponents'),
		Routes: () => import('./components/routes'),
		Roles: () => import('./components/roles'),
		SplitPanes: () => import('@C/splitPanes')
	}
}
</script>

<style lang="less" scoped>
    .roles {

    }
</style>
