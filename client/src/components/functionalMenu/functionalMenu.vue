<template>
    <div class="functional-menu">
        <div class="functional-menu-user">
            <i class="fal fa-user-circle fa-2x functional-menu-user-icon"></i>
            <i class="fal fa-cog fa-2x functional-menu-user-icon"></i>
            <i class="fal fa-question-circle fa-2x functional-menu-user-icon"></i>
        </div>
        <i class="fa fa-phone functional-menu-icon"></i>
        <i class="fa fa-envelope functional-menu-icon"></i>
        <i class="fa fa-comments-alt functional-menu-icon"></i>
        <i class="fa fa-bell functional-menu-icon"></i>
        <i class="fa fa-tasks functional-menu-icon"></i>
    </div>
</template>

<script>
export default {
	name: 'functionalMenu'
}
</script>

<style lang="less" scoped>
    .functional-menu {
        position: relative;
        height: 100vh;
        width: 50px;
        background-color: #2a2a2e;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &-user {
            position: absolute;
            top: 10px;
            left: 0;
            right: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            &-icon {
                color: #fff;
                height: 35px;
                text-align: center;
                margin: 5px 0;
            }
        }
        &-icon {
            margin: 5px 10px;
            height: 30px;
            line-height: 30px;
            width: 30px;
            text-align: center;
            border-radius: 3px;
            background-color: #191919;
            color: #fff;
        }
    }
</style>
