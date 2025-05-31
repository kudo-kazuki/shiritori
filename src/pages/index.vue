<script setup lang="ts">
import { onMounted } from 'vue'
import { useWindowWidthAndDevice } from '@/composables/useWindowWidthAndDevice'
import { useGameStore } from '@/stores/game'
import { useWindowSize } from '@vueuse/core'

const gameStore = useGameStore()

const { deviceType } = useWindowWidthAndDevice()

onMounted(() => {
    // gameStore.startGame()
})

const { width: windowWidth, height: windowHeight } = useWindowSize()
</script>

<template>
    <div
        class="Page"
        :style="{ height: `${windowHeight}px` }"
        :data-device="deviceType"
        :data-windowWidth="windowWidth"
    >
        <PreLoad />
        <SettingStart v-if="!gameStore.isGameStart" />
        <Stage v-if="gameStore.isGameStart" />
        <Debug v-if="gameStore.isDebug" />
    </div>
</template>

<style lang="scss" scoped>
.Page {
    overflow: hidden;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url(/src/assets/images/bg.jpg) no-repeat center bottom;
    background-size: cover;

    &__cpuThinking {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        font-size: 40px;
        color: #fff;
        text-shadow: 1px 1px 0 #000;
    }

    @media screen and (max-width: 740px) {
        &__cpuThinking {
            font-size: var.vw(70);
        }
    }
}
</style>
