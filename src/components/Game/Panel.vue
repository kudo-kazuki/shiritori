<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import type { Panel } from '@/types/types'

const gameStore = useGameStore()

interface Props extends Panel {}

const props = withDefaults(defineProps<Props>(), {})

const imgPath = computed(() => {
    return new URL(
        `../../assets/images/panels/${props.id}.png`,
        import.meta.url,
    ).href
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
        <img v-if="!isUsed" :src="imgPath" alt="" />
        <span v-if="gameStore.isDebug" class="GamePanel__debugWords">
            {{ id }}<br />
            <span v-for="word in words" class="GamePanel__debugWord"
                >{{ word }},</span
            >
        </span>
    </button>
</template>

<style lang="scss" scoped>
.GamePanel {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fff;

    &--used {
        background-color: #ccc;
        cursor: default;
    }

    &__debugWords {
        display: block;
        position: absolute;
        top: 2px;
        left: 2px;
        background-color: rgba(0, 0, 0, 0.55);
        line-height: 1;
        padding-bottom: 3px;
        color: #fff;
        font-size: 10px;
    }

    &__debugWord {
        color: #fff;
        font-size: 10px;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
    }
}
</style>
