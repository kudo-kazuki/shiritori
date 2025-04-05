<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const gameStore = useGameStore()
</script>

<template>
    <pre class="GameCpuMessage" v-html="gameStore.cpuMessage"></pre>
</template>

<style lang="scss" scoped>
.GameCpuMessage {
    text-align: left;
    color: #462522;
    border: 1px solid #333;
    /* border-radius: 5px; */

    /*
    border-image: url(/src/assets/images/fukidashi.png) 37 fill stretch;
    border-width: 35px;
    */

    /*
    border-image: url(/src/assets/images/fukidashi.png) 35 56 44 41 fill round;
    border-width: 82px 103px 82px 82px;
    */

    border-image: url(/src/assets/images/fukidashi.png) 62 fill stretch repeat;
    border-width: 59px 62px 64px 60px;

    @media screen and (max-width: 1224px) {
        font-size: var.vw(18);
        border-width: var.vw(59) var.vw(62) var.vw(64) var.vw(60);
    }

    @media screen and (max-width: 600px) {
        font-size: 10px;
        line-height: 1.6;
    }
}
</style>
