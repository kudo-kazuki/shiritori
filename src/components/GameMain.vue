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
    width: 100%;
    height: 70vh;
    display: flex;
}
</style>
