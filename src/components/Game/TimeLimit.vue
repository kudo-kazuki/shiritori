<script setup lang="ts">
interface Props {
    time: number
}
const props = withDefaults(defineProps<Props>(), {})
</script>

<template>
    <time class="GameTimeLimit">
        {{ time }}
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
}
</style>
