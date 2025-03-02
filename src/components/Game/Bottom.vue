<script setup lang="ts">
import playerImage from '@/assets/images/player.png'
import { useGameStore } from '@/stores/game'
const gameStore = useGameStore()
</script>

<template>
    <div class="GameBottom">
        <TimeLimit :time="gameStore.timeLimit" />
        <div class="GameBottom__characterStage">
            <div class="GameBottom__characterWrap">
                <img
                    class="GameBottom__characterImage"
                    :src="playerImage"
                    alt=""
                />
            </div>
            <CpuMessage class="GameBottom__cpuMessage" />
            <div class="GameBottom__characterWrap">
                <img
                    class="GameBottom__characterImage"
                    :src="`/src/assets/images/cpu/${gameStore.cpuStrong}.png`"
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

    &__characterImage {
        height: 150px;
    }
}
</style>
