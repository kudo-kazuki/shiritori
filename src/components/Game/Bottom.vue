<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const gameStore = useGameStore()
</script>

<template>
    <div class="GameBottom">
        <TimeLimit
            v-if="gameStore.gameMode === 1"
            :time="gameStore.timeLimit"
            :maxTime="gameStore.timeLimitStatic"
        />
        <div class="GameBottom__characterStage">
            <CpuMessage class="GameBottom__cpuMessage" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.GameBottom {
    position: relative;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    text-align: center;

    &__characterStage {
        display: flex;
        justify-content: center;
    }

    & &__cpuMessage {
        width: 526px;
        height: 130px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    @media screen and (max-width: 1224px) {
        & &__cpuMessage {
            width: var.vw(500);
            height: var.vw(130);
        }
    }

    @media screen and (max-width: 600px) {
        & &__cpuMessage {
            width: 200px;
            height: 64px;
        }
    }
}
</style>
