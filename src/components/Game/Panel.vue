<script setup lang="ts">
import { computed, watch, ref } from 'vue'
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

const isCurrentCorrect = ref(false)
const isCurrentWrong = ref(false)
watch(
    () => gameStore.currentSelectedPanelId,
    (newVal) => {
        if (newVal === props.id) {
            if (gameStore.currentSelectedPanelResult === 1) {
                isCurrentCorrect.value = true
            } else {
                isCurrentWrong.value = true
            }

            setTimeout(() => {
                isCurrentCorrect.value = false
                isCurrentWrong.value = false
            }, 1000)
        }
    },
)
</script>

<template>
    <button
        class="GamePanel"
        :class="{
            'GamePanel--used': isUsed,
            'GamePanel--currentCorrect animate__heartBeat': isCurrentCorrect,
            'GamePanel--currentWrong animate__shakeX': isCurrentWrong,
        }"
        @click="onClick"
    >
        <img v-if="!isUsed" :src="imgPath" alt="" />
        <span
            v-if="gameStore.isDebug && gameStore.isDebugWords"
            class="GamePanel__debugWords"
        >
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

    &--used {
        background-color: #ccc;
        cursor: default;
    }

    &--currentCorrect {
        animation-duration: 1s;
    }

    &--currentWrong {
        animation-duration: 0.8s;
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
