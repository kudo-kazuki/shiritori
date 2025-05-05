<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    id: number
    action: string
}

const props = withDefaults(defineProps<Props>(), {
    action: 'idle',
})

const imagePath = computed(() => {
    return new URL(
        `../../assets/images/cpu/actions/${props.id}_${props.action}.webp`,
        import.meta.url,
    ).href
})
</script>

<template>
    <div class="GameCpuActions">
        <img class="GameCpuActions__image" :src="imagePath" alt="" />
    </div>
</template>

<style lang="scss" scoped>
.GameCpuActions {
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
