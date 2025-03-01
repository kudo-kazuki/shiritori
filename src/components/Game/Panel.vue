<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import type { Panel } from '@/types/types'

const gameStore = useGameStore()

interface Props extends Panel {}

const props = withDefaults(defineProps<Props>(), {})

const imgPath = computed(() => {
    return `/src/assets/images/panels/${props.id}.png`
})

const onClick = () => {
    gameStore.selectPanel(props.id, true)
}
</script>

<template>
    <button
        class="GamePanel"
        :class="{ 'GamePanel--used': isUsed }"
        @click="onClick"
    >
        <img :src="imgPath" alt="" />
    </button>
</template>

<style lang="scss" scoped>
.GamePanel {
    width: 100%;
    height: 100%;
    background-color: #fff;

    &--used {
        background-color: #ccc;
    }
}
</style>
