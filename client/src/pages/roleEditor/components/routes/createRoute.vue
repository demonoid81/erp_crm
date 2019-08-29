<template>
    <div>
        <g-form :label-width="100">
            <form-item label="Name">
                <input/>
            </form-item>
            <form-item label="Path">
                <input/>
            </form-item>
            <form-item label="Component">
                <input/>
            </form-item>
            <fieldset>
                <legend>Meta-info</legend>
                <g-form :label-width="100">
                    <form-item label="Title">
                        <input/>
                    </form-item>
                    <form-item label="Icon">
                        <input/>
                    </form-item>
                    <form-item label="HideInMenu">
                        <p-check name="check" color="success" class="p-default p-thick p-pulse" v-model="check"></p-check>
                    </form-item>
                    <form-item label="NotCache">
                        <p-check name="check" color="success" class="p-default p-thick p-pulse" v-model="check"></p-check>
                    </form-item>
                </g-form>
            </fieldset>


        </g-form>
    </div>
</template>

<script>

export default {
	name: 'createRoute',
	components: {
		GForm: () => import('@C/form'),
		FormItem: () => import('@C/formItem')
	},
    data() {
		return {
			check: false
        }
    }
}
</script>

<style scoped>

</style>
