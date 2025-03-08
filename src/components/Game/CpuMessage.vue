<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGameStore } from '@/stores/game'
const gameStore = useGameStore()
</script>

<template>
    <pre class="GameCpuMessage" v-html="gameStore.cpuMessage"></pre>
</template>

<style lang="scss" scoped>
.GameCpuMessage {
    text-align: left;
    padding: 20px;
    border: 1px solid #333;
    border-radius: 5px;
    background-color: #fff;

    @media screen and (max-width: 1224px) {
        padding: var.vw(20);
        font-size: var.vw(18);
    }

    @media screen and (max-width: 600px) {
        font-size: 10px;
        line-height: 1.6;
    }
}
</style>
