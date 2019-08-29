<template>
    <div class="routes">
        <button @click="addRoute">add route</button>
    </div>
</template>

<script>
import CreateRoute from './createRoute.vue'

export default {
	name: 'routes',
	data() {
		return {}
	},
	methods: {
		addRoute() {
			this.$modal.show(CreateRoute, {
				text: 'This text is passed as a property'
			}, {
				draggable: true
			})
		}
	}
}
</script>

<style lang="less" scoped>
    .roles {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

</style>
