import { defineStore } from 'pinia'
import { usePanelStore } from './panel'
import { checkPanelWords } from '@/logics/shiritori'
import { getCpuMessageWhenPlayerSelect } from '@/logics/cpuMessage'
import { nextTick } from 'vue'

// グローバルスコープでタイマーIDを保持
let timerId: ReturnType<typeof setInterval> | null = null

const TIME_LIMIT: Record<number, number> = {
    1: 40,
    2: 30,
    3: 20,
}

interface gameStore {
    isGameStart: boolean
    isGameEnd: boolean
    gameMode: number
    isPlayerTurn: boolean
    passScore: number
    playerScore: number
    cpuScore: number
    turn: number
    cpuStrong: number
    timeLimit: number
    currentletter: string
    isCpuThinking: boolean
    cpuMessage: string
    isDebug: boolean
}

export const useGameStore = defineStore('game', {
    state: (): gameStore => ({
        isGameStart: true,
        isGameEnd: false,
        gameMode: 1,
        isPlayerTurn: true,
        passScore: 5,
        playerScore: 5,
        cpuScore: 0,
        turn: 1,
        cpuStrong: 1,
        timeLimit: TIME_LIMIT[1],
        currentletter: 'あ',
        isCpuThinking: false,
        cpuMessage: 'ああああああああああああ<br>ええええええええええ',
        isDebug: false,
    }),
    actions: {
        startGame() {
            const panelStore = usePanelStore() // パネルストアを取得
            panelStore.initPanels() // ここでパネルを初期化
            this.timeLimit = TIME_LIMIT[this.cpuStrong]
            this.isGameStart = true
            this.startTimer()
        },

        selectPanel(panelId: number, isPlayerClicked: boolean) {
            if (
                !this.isGameStart ||
                (isPlayerClicked && this.gameMode === 1 && !this.isPlayerTurn)
            ) {
                return
            }

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

            this.cpuMessage = getCpuMessageWhenPlayerSelect(
                result.matchedWord,
                result.code,
            )

            if (this.gameMode === 1) {
                if (this.isPlayerTurn) {
                } else {
                }
            } else {
            }
        },

        switchTurn() {
            this.isPlayerTurn = !this.isPlayerTurn
        },

        startTimer() {
            this.clearTimer()

            // timeLimit初期値をセット
            this.timeLimit = TIME_LIMIT[this.cpuStrong]

            timerId = setInterval(() => {
                if (this.timeLimit > 0) {
                    this.timeLimit--
                } else {
                    // 0になったら強制的にターンを交代
                    this.clearTimer()
                    this.switchTurn()
                }
            }, 1000)
        },

        // タイマーを明示的にクリアしたいとき使う
        clearTimer() {
            if (timerId) {
                clearInterval(timerId)
                timerId = null
            }
        },
    },

    getters: {},
})
