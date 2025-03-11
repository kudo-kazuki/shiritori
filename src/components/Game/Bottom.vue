<script setup lang="ts">
import { computed } from 'vue'
import playerImage from '@/assets/images/player.png'
import { useGameStore } from '@/stores/game'
const gameStore = useGameStore()

const cpuImagePath = computed(() => {
    return new URL(
        `../../assets/images/cpu/${gameStore.cpuStrong}.png`,
        import.meta.url,
    ).href
})
</script>

<template>
    <div class="GameBottom">
        <TimeLimit :time="gameStore.timeLimit" />
        <div class="GameBottom__characterStage">
            <div
                class="GameBottom__characterWrap"
                :class="{
                    'GameBottom__characterWrap--start animate__slideInLeft':
                        gameStore.isGameStart,
                }"
            >
                <img
                    class="GameBottom__characterImage"
                    :src="playerImage"
                    alt=""
                />
            </div>
            <CpuMessage class="GameBottom__cpuMessage" />
            <div
                v-if="gameStore.isCpuDisplay"
                class="GameBottom__characterWrap"
                :class="{
                    'GameBottom__characterWrap--blinking':
                        gameStore.isCpuBlinking,
                    'GameBottom__characterWrap--start animate__bounceInRight':
                        gameStore.isGameStart && !gameStore.isCpuBlinking,
                }"
            >
                <img
                    class="GameBottom__characterImage"
                    :src="cpuImagePath"
                    alt=""
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.GameBottom {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    text-align: center;

    &__characterStage {
        display: flex;
        justify-content: center;
        column-gap: 40px;
    }

    & &__cpuMessage {
        width: 500px;
    }

    &__characterWrap {
        &--blinking {
            animation: blinkAnimation 0.08s steps(2, start) infinite;
        }

        &--start {
            animation-duration: 1s;
        }
    }

    &__characterImage {
        height: 150px;
    }

    @media screen and (max-width: 1224px) {
        &__characterStage {
            column-gap: var.vw(40);
        }

        & &__cpuMessage {
            width: var.vw(500);
        }

        &__characterImage {
            height: var.vw(150);
        }
    }

    @media screen and (max-width: 600px) {
        & &__cpuMessage {
            width: 200px;
        }

        &__characterImage {
            height: 60px;
        }
    }
}

@keyframes blinkAnimation {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>
