<template>
    <transition-group :css="false"
                      @enter="enter"
                      @leave="leave"
                      @after-leave="afterLeave">
        <slot/>
    </transition-group>
</template>

<script>
export default {
	name: 'velocity-group',
	methods: {
		enter(el, complete) {
			this.$emit('enter', { el, complete })
		},
		leave(el, complete) {
			this.$emit('leave', { el, complete })
		},
		afterLeave() {
			this.$emit('afterLeave')
		}
	}
}
</script>
