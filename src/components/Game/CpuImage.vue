<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import playerImage from '@/assets/images/player.png'

interface Props {
    isPlayer?: boolean
}

const props = withDefaults(defineProps<Props>(), {})

const gameStore = useGameStore()

const cpuImagePath = computed(() => {
    return new URL(
        `../../assets/images/cpu/${gameStore.cpuStrong}.png`,
        import.meta.url,
    ).href
})

const characterImg = computed(() => {
    return props.isPlayer ? playerImage : cpuImagePath.value
})
</script>

<template>
    <div class="GameCharacter">
        <img class="GameCharacter__image" :src="characterImg" alt="" />
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
