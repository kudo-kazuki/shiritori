<script setup lang="ts">
// import { useGameStore } from '@/stores/game'
// const gameStore = useGameStore()
</script>

<template>
    <section class="GameStage">
        <Main />
        <Bottom />
    </section>
</template>

<style lang="scss" scoped>
.GameStage {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    row-gap: 12px;
}
</style>
