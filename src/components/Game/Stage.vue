<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const gameStore = useGameStore()
</script>

<template>
    <section class="GameStage">
        <Main />
        <Bottom />
        <PlayerImage
            class="GameStage__character"
            :class="{
                'GameStage__character--start animate__slideInLeft':
                    gameStore.isGameStart,
            }"
            isPlayer
        />
        <CpuImage
            v-if="gameStore.isCpuDisplay"
            class="GameStage__character GameStage__character--enemy"
            :class="{
                'GameStage__character--blinking': gameStore.isCpuBlinking,
                'GameStage__character--start animate__bounceInRight':
                    gameStore.isGameStart && !gameStore.isCpuBlinking,
            }"
        />
    </section>
</template>

<style lang="scss" scoped>
.GameStage {
    position: relative;
    width: 1200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    row-gap: 2px;
    padding: 0 20px 92px;

    & &__character {
        width: 321px;
        height: 351px;
        position: absolute;
        bottom: 20px;
        left: 0;
        line-height: 0;
        z-index: 0;
        background-color: rgba(0, 0, 0, 0.5);

        &--enemy {
            left: auto;
            right: 0;
        }

        &--blinking {
            animation: blinkAnimation 0.08s steps(2, start) infinite;
        }

        &--start {
            animation-duration: 1s;
        }
    }

    @media screen and (max-width: 1220px) {
        width: 100%;
        padding: 0 12px var.vw(92);

        & &__character {
            width: var.vw(321);
            height: var.vw(351);
        }
    }

    @media screen and (max-width: 600px) {
        padding: 40px 12px 40px;
        justify-content: space-between;
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
