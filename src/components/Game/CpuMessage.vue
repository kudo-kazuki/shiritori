<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGameStore } from '@/stores/game'
const gameStore = useGameStore()
</script>

<template>
    <div class="GameCpuMessage" v-html="gameStore.cpuMessage"></div>
</template>

<style lang="scss" scoped>
.GameCpuMessage {
    text-align: left;
    padding: 20px;
    border: 1px solid #333;
    border-radius: 5px;
    background-color: #fff;
}
</style>
