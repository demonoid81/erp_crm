<template>
    <div class="card">
        <slot></slot>
    </div>
</template>

<script>
export default {
	name: 'card'
}
</script>

<style lang="less" scoped>
    .card {
        position: relative;
        background-color: #fff;
        border: none;
        box-shadow: 0 2px 0 rgba(90,97,105,.11), 0 4px 8px rgba(90,97,105,.12), 0 10px 10px rgba(90,97,105,.06), 0 7px 70px rgba(90,97,105,.1);
    }

</style>
