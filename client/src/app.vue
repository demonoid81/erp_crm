<template web>
	<div id="app">
		<router-view/>
	</div>
</template>

<template native>

</template>

<script>
export default {
	data() {
		return {

		}
	},
	monted() {
		this.$progress.finish()
	},
	created() {
		this.$router.beforeEach((to, from, next) => {
			this.$progress.start()
			next()
		})
	}
}
</script>

<style lang="less" web>
	.size{
		width: 100%;
		height: 100%;
	}
	html,body{
		.size;
		overflow: hidden;
		margin: 0;
		padding: 0;
	}
	#app {
		.size;
	}
</style>

<style lang="less" native>

</style>