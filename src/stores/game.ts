import { defineStore } from 'pinia'
import { nextTick } from 'vue'

interface gameStore {
    isGameStart: boolean
    isGameEnd: boolean
    gameMode: number
    passScore: number
    playerScore: number
    cpuScore: number
    turn: number
    cpuStrong: number
    isCpuThinking: boolean
    isDebug: boolean
}

export const useGameStore = defineStore('game', {
    state: (): gameStore => ({
        isGameStart: true,
        isGameEnd: false,
        gameMode: 1,
        passScore: 5,
        playerScore: 0,
        cpuScore: 0,
        turn: 1,
        cpuStrong: 1,
        isCpuThinking: false,
        isDebug: false,
    }),
    actions: {
        startGame() {
            this.isGameStart = true
        },
    },

    getters: {},
})
