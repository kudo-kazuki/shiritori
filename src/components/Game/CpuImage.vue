<script setup lang="ts">
import { useGameStore } from '@/stores/game'

interface Props {
    isPlayer?: boolean
}

withDefaults(defineProps<Props>(), {})

const gameStore = useGameStore()
</script>

<template>
    <div class="GameCharacter">
        <CpuActions :id="gameStore.cpuStrong" :action="gameStore.cpuAction" />
    </div>
</template>

<style lang="scss" scoped>
.GameCharacter {
    &__image {
        max-width: none;
        width: 100%;
    }

    &--blinking {
        animation: blinkAnimation 0.08s steps(2, start) infinite;
    }

    &--start {
        animation-duration: 1s;
    }

    @media screen and (max-width: 1220px) {
    }

    @media screen and (max-width: 600px) {
    }
}
</style>
