import { defineStore } from 'pinia'
import { usePanelStore } from './panel'
import { checkPanelWords } from '@/logics/shiritori'
import {
    getCpuMessageWhenGameStart,
    getCpuMessageWhenPlayerSelect,
} from '@/logics/cpuMessage'
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
    isCpuMessageTyping: boolean
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
        cpuMessage: '',
        isCpuMessageTyping: false,
        isDebug: false,
    }),
    actions: {
        async startGame() {
            const panelStore = usePanelStore() // パネルストアを取得
            panelStore.initPanels() // ここでパネルを初期化
            this.timeLimit = TIME_LIMIT[this.cpuStrong]
            this.isGameStart = true

            // CPUのメッセージをセットし、表示完了を待つ
            await this.setCpuMessage(getCpuMessageWhenGameStart(this.cpuStrong))

            this.startTimer()
        },

        async selectPanel(panelId: number, isPlayerClicked: boolean) {
            if (
                !this.isGameStart ||
                (isPlayerClicked &&
                    this.gameMode === 1 &&
                    !this.isPlayerTurn) ||
                this.isCpuMessageTyping
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

            await this.setCpuMessage(
                getCpuMessageWhenPlayerSelect(
                    result.matchedWord,
                    result.code,
                    this.cpuStrong,
                ),
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

        /**
         * CPUのメッセージをセットし、すべて表示されるまで待つ
         */
        setCpuMessage(message: string): Promise<void> {
            return new Promise((resolve) => {
                this.cpuMessage = '' // 初期化
                this.isCpuMessageTyping = true // タイピング中フラグON

                let index = 0
                const typingSpeed = 50 // 文字の表示速度（ミリ秒）

                // ✅ HTMLかプレーンテキストかを判別
                const isHtml = /<[^>]+>/.test(message)

                if (isHtml) {
                    // **HTMLをパースして文字のみを取得**
                    const parser = new DOMParser()
                    const doc = parser.parseFromString(message, 'text/html')

                    // **テキストノードのみを取得（HTMLタグを保持）**
                    const textNodes: Text[] = []
                    const getTextNodes = (node: Node) => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            textNodes.push(node as Text)
                        } else {
                            node.childNodes.forEach(getTextNodes)
                        }
                    }
                    getTextNodes(doc.body)

                    // **すべてのテキストを連結**
                    const fullText = textNodes
                        .map((node) => node.textContent)
                        .join('')
                    const textLength = fullText.length

                    // **1文字ずつテキストを表示**
                    const typeNextCharacter = () => {
                        if (index < textLength) {
                            let charCount = 0
                            textNodes.forEach((node) => {
                                const originalText = node.textContent || ''
                                node.textContent = originalText.slice(
                                    0,
                                    Math.min(
                                        originalText.length,
                                        index - charCount + 1,
                                    ),
                                )
                                charCount += originalText.length
                            })

                            this.cpuMessage = doc.body.innerHTML // ✅ 更新後のHTMLを反映
                            index++
                            setTimeout(typeNextCharacter, typingSpeed)
                        } else {
                            this.isCpuMessageTyping = false // ✅ 表示完了
                            resolve()
                        }
                    }

                    typeNextCharacter() // アニメーション開始
                } else {
                    // **プレーンテキスト（通常の文字列）**
                    const typeNextCharacter = () => {
                        if (index < message.length) {
                            this.cpuMessage += message[index] // 1文字ずつ追加
                            index++
                            setTimeout(typeNextCharacter, typingSpeed)
                        } else {
                            this.isCpuMessageTyping = false // ✅ 表示完了
                            resolve()
                        }
                    }

                    typeNextCharacter() // アニメーション開始
                }
            })
        },
    },

    getters: {},
})
