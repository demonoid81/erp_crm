<template web>
	<div id="app">
		<router-view/>
		<progress-bar/>
	</div>
</template>

<!--<template native>-->

<!--</template>-->

<script>
export default {
	data() {
		return {

		}
	},
	mounted() {
		this.$Progress.finish()
	},
	created() {
		this.$Progress.start()
		this.$router.beforeEach((to, from, next) => {
			//  does the page we want to go to have a meta.progress object
			if (to.meta.progress !== undefined) {
				let meta = to.meta.progress
				// parse meta tags
				this.$Progress.parseMeta(meta)
			}
			//  start the progress bar
			this.$Progress.start()
			//  continue to next page
			next()
		})
		this.$router.afterEach((to, from) => {
			//  finish the progress bar
			this.$Progress.finish()
		})
	}
}
</script>

<style lang="less" web>
	@import './styles/all.css';
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