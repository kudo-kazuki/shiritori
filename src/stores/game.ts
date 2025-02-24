import { defineStore } from 'pinia'
import { usePanelStore } from './panel'
import { checkPanelWords } from '@/logics/shiritori'
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
    timeLimit: number
    currentletter: string
    isCpuThinking: boolean
    isDebug: boolean
}

export const useGameStore = defineStore('game', {
    state: (): gameStore => ({
        isGameStart: true,
        isGameEnd: false,
        gameMode: 1,
        passScore: 5,
        playerScore: 5,
        cpuScore: 0,
        turn: 1,
        cpuStrong: 1,
        timeLimit: 40,
        currentletter: 'あ',
        isCpuThinking: false,
        isDebug: false,
    }),
    actions: {
        startGame() {
            // パネルストアを取得
            const panelStore = usePanelStore()
            // ここでパネルを初期化
            panelStore.initPanels()
            this.isGameStart = true
        },

        selectPanel(panelId: number) {
            // 1) パネルStoreから該当パネルを取得
            const panelStore = usePanelStore()
            const panel = panelStore.panels.find((p) => p.id === panelId)
            if (!panel) {
                return
            }

            // 2) すでに選ばれていたら何もしない等のチェック
            if (panel.isUsed) {
                return
            }

            const result = checkPanelWords(this.currentletter, panel.words) //1 or 2 or 3が返るように（1:オッケー、2：間違い、3：「ん」または「ン」が最後に来るものが引っ掛かった）
            console.log('result', result)
        },
    },

    getters: {},
})
