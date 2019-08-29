<template>
    <transition-group :name="name">
        <slot/>
    </transition-group>
</template>

<script>
export default {
	name: 'css-group',
	props: ['name']
}
</script>
