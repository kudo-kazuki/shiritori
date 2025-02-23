<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const gameStore = useGameStore()
</script>

<template>
    <div class="GameShiritoiArea"></div>
</template>

<style lang="scss" scoped>
.GameShiritoiArea {
    width: 100%;
    height: 100%;
    background: url(/src/assets/images/board.png) no-repeat center;
    background-size: 1000px;
}
</style>
