<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const gameStore = useGameStore()
</script>

<template>
    <div class="GameDebug">
        <ul>
            <li>
                <em>isGameStart:</em><span>{{ gameStore.isGameStart }}</span>
            </li>
            <li>
                <em>isGameEnd:</em><span>{{ gameStore.isGameEnd }}</span>
            </li>
            <li>
                <em>gameMode:</em><span>{{ gameStore.gameMode }}</span>
            </li>
            <li>
                <em>isSleep:</em><span>{{ gameStore.isSleep }}</span>
            </li>
            <li>
                <em>isPlayerTurn:</em><span>{{ gameStore.isPlayerTurn }}</span>
            </li>
            <li>
                <em>passScore:</em><span>{{ gameStore.passScore }}</span>
            </li>
            <li>
                <em>playerScore:</em><span>{{ gameStore.playerScore }}</span>
            </li>
            <li>
                <em>cpuScore:</em><span>{{ gameStore.cpuScore }}</span>
            </li>
            <li>
                <em>turn:</em><span>{{ gameStore.turn }}</span>
            </li>
            <li>
                <em>cpuStrong:</em><span>{{ gameStore.cpuStrong }}</span>
            </li>
            <li>
                <em>timeLimit:</em><span>{{ gameStore.timeLimit }}</span>
            </li>
            <li>
                <em>currentletter:</em
                ><span>{{ gameStore.currentletter }}</span>
            </li>
            <li>
                <em>currentCpuHoverPanelId:</em
                ><span>{{ gameStore.currentCpuHoverPanelId }}</span>
            </li>
            <li>
                <em>isCpuThinking:</em
                ><span>{{ gameStore.isCpuThinking }}</span>
            </li>
            <li>
                <em>isCpuMessageTyping:</em
                ><span>{{ gameStore.isCpuMessageTyping }}</span>
            </li>
            <li>
                <em>isDebug:</em><span>{{ gameStore.isDebug }}</span>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.GameDebug {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11;
    text-align: left;
    padding: 16px;
    border-radius: 0 0 5px 0;
    background-color: #fff;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);

    * {
        user-select: text;
    }

    li + li {
        margin-top: 4px;
    }

    em {
        font-weight: bold;
        font-style: inherit;
        padding-right: 8px;
    }

    @media screen and (max-width: 740px) {
        display: none;
    }
}
</style>
