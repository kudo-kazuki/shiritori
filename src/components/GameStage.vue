<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const gameStore = useGameStore()
</script>

<template>
    <section class="GameStage">
        <GameMain />
    </section>
</template>

<style lang="scss" scoped>
.GameStage {
    width: 100%;
    height: 100%;
}
</style>
