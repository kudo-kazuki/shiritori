<script setup lang="ts">
interface Props {
    time: number
}
const props = withDefaults(defineProps<Props>(), {
    time: 0, // デフォルト値
})
console.log(props.time)
</script>

<template>
    <time class="GameTimeLimit" :class="{ 'GameTimeLimit--danger': time < 10 }">
        {{ time < 0 ? 0 : time }}
    </time>
</template>

<style lang="scss" scoped>
.GameTimeLimit {
    font-size: 32px;
    font-weight: bold;
    color: #000;
    text-shadow:
        1px 1px 0 #fff,
        -1px -1px 0 #fff,
        -1px 1px 0 #fff,
        1px -1px 0 #fff,
        0px 1px 0 #fff,
        0-1px 0 #fff,
        -1px 0 0 #fff,
        1px 0 0 #fff;

    &--danger {
        color: red;
    }

    @media screen and (max-width: 1224px) {
        font-size: var.vw(32);
    }

    @media screen and (max-width: 600px) {
        font-size: 24px;
        line-height: 1;
    }
}
</style>
