import { defineStore } from 'pinia'
import { nextTick } from 'vue'

interface gameStore {
    isGameStart: boolean
    isGameEnd: boolean
    turn: number
    cpuStrong: number
    isCpuThinking: boolean
    isDebug: boolean
}

export const useGameStore = defineStore('game', {
    state: (): gameStore => ({
        isGameStart: false,
        isGameEnd: false,
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
