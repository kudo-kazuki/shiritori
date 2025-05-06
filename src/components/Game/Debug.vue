<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const gameStore = useGameStore()

const endGame = (result: 'win' | 'lose' | 'draw') => {
    gameStore.endGame(result)
}

const CPU_ACTION_NAME_MAP = {
    idle: '通常',
    amazed: 'びっくり',
    joy: '喜び',
    sad: '悲しみ',
}
const cpuActionEntries = Object.entries(CPU_ACTION_NAME_MAP) // Object.entries でループ用の配列を生成
const changeCpuAction = (action: string) => {
    gameStore.cpuAction = action
}
</script>

<template>
    <div class="GameDebug">
        <button
            class="GameDebug__closeButton"
            @click="gameStore.toggleDebugArea()"
        >
            {{ gameStore.isDebugShow ? '×' : '〇' }}
        </button>
        <el-scrollbar v-show="gameStore.isDebugShow">
            <ul class="GameDebug__statusList">
                <li>
                    <em>isGameStart:</em
                    ><span>{{ gameStore.isGameStart }}</span>
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
                    <em>isPlayerTurn:</em
                    ><span>{{ gameStore.isPlayerTurn }}</span>
                </li>
                <li>
                    <em>passScore:</em><span>{{ gameStore.passScore }}</span>
                </li>
                <li>
                    <em>playerScore:</em
                    ><span>{{ gameStore.playerScore }}</span>
                    <input
                        class="GameDebug__inputStatus"
                        type="number"
                        v-model="gameStore.playerScore"
                        min="0"
                        max="36"
                    />
                </li>
                <li>
                    <em>cpuScore:</em><span>{{ gameStore.cpuScore }}</span>
                    <input
                        class="GameDebug__inputStatus"
                        type="number"
                        v-model="gameStore.cpuScore"
                        min="0"
                        max="36"
                    />
                </li>
                <li>
                    <em>turn:</em><span>{{ gameStore.turn }}</span>
                </li>
                <li>
                    <em>cpuStrong:</em><span>{{ gameStore.cpuStrong }}</span>
                    <input
                        class="GameDebug__inputStatus"
                        type="number"
                        v-model="gameStore.cpuStrong"
                        min="1"
                        max="3"
                    />
                </li>
                <li v-if="gameStore.gameMode === 1">
                    <em>timeLimit:</em><span>{{ gameStore.timeLimit }}</span>
                    <input
                        class="GameDebug__inputStatus"
                        type="number"
                        v-model="gameStore.timeLimit"
                        min="1"
                    />
                </li>
                <li v-if="gameStore.gameMode === 2">
                    <em>hayaoshiCputimeLimit:</em
                    ><span>{{ gameStore.hayaoshiCputimeLimit }}</span>
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
                <li>
                    <em>isDebugWords:</em
                    ><span>{{ gameStore.isDebugWords }}</span>
                    <input
                        class="GameDebug__inputStatus"
                        type="checkbox"
                        v-model="gameStore.isDebugWords"
                    />
                </li>
            </ul>

            <div class="GameDebug__box">
                <h2 class="GameDebug__hdg">ゲーム終了</h2>
                <ul class="GameDebug__buttonList">
                    <li>
                        <button
                            class="GameDebug__runButton"
                            @click="endGame('win')"
                        >
                            勝ち
                        </button>
                    </li>
                    <li>
                        <button
                            class="GameDebug__runButton"
                            @click="endGame('lose')"
                        >
                            負け
                        </button>
                    </li>
                    <li>
                        <button
                            class="GameDebug__runButton"
                            @click="endGame('draw')"
                        >
                            引き分け
                        </button>
                    </li>
                </ul>
            </div>

            <div class="GameDebug__box">
                <h2 class="GameDebug__hdg">CPUアクション</h2>
                <ul class="GameDebug__buttonList">
                    <li v-for="[key, value] in cpuActionEntries" :key="key">
                        <button
                            class="GameDebug__runButton"
                            @click="changeCpuAction(key)"
                        >
                            {{ value }}
                        </button>
                    </li>
                </ul>
            </div>
        </el-scrollbar>
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

    &__statusList {
        li {
            display: flex;
            align-items: center;
        }

        li + li {
            margin-top: 4px;
        }

        em {
            font-weight: bold;
            font-style: inherit;
            padding-right: 8px;
        }
    }

    &__inputStatus {
        width: 60px;
        border: 1px solid #333;
        margin-left: 8px;
        border-radius: 4px;
        padding: 0 4px;
        cursor: pointer;

        &[type='checkbox'] {
            width: auto;
        }
    }

    &__closeButton {
        display: flex;
        margin-left: auto;
    }

    &__box {
        border: 1px solid #ccc;
        margin-top: 12px;
        padding: 4px;
        border-radius: 4px;
        text-align: center;
    }

    &__hdg {
        font-weight: bold;
    }

    &__buttonList {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 4px;
    }

    &__runButton {
        font-size: 12px;
        border: 1px solid #666;
        border-radius: 12px;
        padding: 2px 6px;
        background-color: #fff;

        &:hover {
            background-color: #efefef;
        }
    }

    @media screen and (max-width: 740px) {
        display: none;
    }
}
</style>
