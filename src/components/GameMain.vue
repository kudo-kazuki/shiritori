<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const gameStore = useGameStore()
</script>

<template>
    <div class="GameMain">
        <GameScore
            :score="gameStore.playerScore"
            :passScore="gameStore.passScore"
        />
        <GameShiritoiArea />
        <GameScore :score="gameStore.cpuScore" />
    </div>
</template>

<style lang="scss" scoped>
.GameMain {
    max-width: 1200px;
    height: 482px;
    display: flex;
    padding: 52px 12px 0;
    margin: 0 auto;

    @media screen and (max-width: 1224px) {
        padding: var.vw(52) var.vw(12) 0;
        height: var.vw(482);
    }

    @media screen and (max-width: 600px) {
        flex-direction: column;
        height: auto;
        row-gap: 4px;
    }
}
</style>
