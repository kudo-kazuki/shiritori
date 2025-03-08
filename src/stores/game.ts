import { defineStore } from 'pinia'
import { usePanelStore } from './panel'
import { useBgmStore } from '@/stores/bgm'
import { useSeStore } from '@/stores/se'
import { sleepWithState } from '@/utils/sleep'
import {
    checkPanelWords,
    getLastCharHiragana,
    existsAvailablePanel,
} from '@/logics/shiritori'
import {
    getCpuMessageWhenGameStart,
    getCpuMessageWhenPlayerSelect,
    getCpuMessageWhenFirstSelectPanel,
    getCpuMessageWhenCpuPanelSelectedBefore,
    getCpuMessageWhenCpuPanelSelected,
    getCpuMessageWhenPlayerTurnChanged,
    getCpuMessageWhenTimeOver,
    getCpuMessageWhenCpuTurnChanged,
    getCpuMessageWhenCpuPanelSelectedWrong,
    getCpuMessageWhenCpuPanelSelectedNEnd,
    getCpuMessageWhenAllPanelSelected,
    getCpuMessageWhenWinPlayer,
    getCpuMessageWhenLosePlayer,
    getCpuMessageWhenDraw,
} from '@/logics/cpuMessage'
import {
    selectFirstPanelId,
    decideCpuPanelIdByProbability,
} from '@/logics/cpuLogic'
import { nextTick } from 'vue'

const TIME_LIMIT: Record<number, number> = {
    1: 50,
    2: 30,
    3: 20,
}

interface gameStore {
    isGameStart: boolean
    isGameEnd: boolean
    gameResult: 'none' | 'win' | 'lose' | 'draw'
    gameMode: number
    isSleep: boolean
    isPlayerTurn: boolean
    passScore: number
    playerScore: number
    cpuScore: number
    turn: number
    cpuStrong: number
    timeLimit: number
    timerId: ReturnType<typeof setInterval> | null
    currentletter: string
    isCpuThinking: boolean
    cpuMessage: string
    currentCpuHoverPanelId: number | null
    isCpuMessageTyping: boolean
    isCpuBlinking: boolean
    isCpuDisplay: boolean
    isDebug: boolean
}

export const useGameStore = defineStore('game', {
    state: (): gameStore => ({
        isGameStart: false,
        isGameEnd: false,
        gameResult: 'none',
        gameMode: 1,
        isSleep: false,
        isPlayerTurn: true,
        passScore: 5,
        playerScore: 0,
        cpuScore: 0,
        turn: 1,
        cpuStrong: 1,
        timeLimit: TIME_LIMIT[1],
        timerId: null,
        currentletter: '',
        isCpuThinking: false,
        cpuMessage: '',
        currentCpuHoverPanelId: null,
        isCpuMessageTyping: false,
        isCpuBlinking: false,
        isCpuDisplay: true,
        isDebug: false,
    }),
    actions: {
        async startGame() {
            const panelStore = usePanelStore() // パネルストアを取得
            panelStore.initPanels() // ここでパネルを初期化
            console.log('panelStore.panels', panelStore.panels)

            this.timeLimit = TIME_LIMIT[this.cpuStrong]
            this.isGameStart = true

            const seStore = useSeStore()
            seStore.playSE('start', 0.5)

            await sleepWithState(this, 'isSleep', 1000)

            const bgmStore = useBgmStore()
            bgmStore.playBGM('battle')

            await nextTick()

            // CPUのメッセージをセットし、表示完了を待つ
            await this.setCpuMessage(getCpuMessageWhenGameStart(this.cpuStrong))
            await this.setCpuMessage(
                getCpuMessageWhenFirstSelectPanel(this.cpuStrong),
            )
            await this.setCpuMessage(
                getCpuMessageWhenCpuPanelSelectedBefore(this.cpuStrong),
            )

            const firstPanelId = selectFirstPanelId(panelStore.panels)
            const firstPanel = panelStore.panels.find(
                (p) => p.id === firstPanelId,
            )

            if (!firstPanel) {
                console.log('最初のパネルが選べない。')
                return
            }

            this.currentCpuHoverPanelId = firstPanelId
            const firstWord = firstPanel?.words[0]
            this.currentletter = getLastCharHiragana(firstWord)

            await this.setCpuMessage(
                getCpuMessageWhenCpuPanelSelected(this.cpuStrong, firstWord),
            )

            firstPanel.isUsed = true

            await this.setCpuMessage(
                getCpuMessageWhenPlayerTurnChanged(
                    this.cpuStrong,
                    this.currentletter,
                ),
            )

            this.startTimer()
        },

        async selectPanel(panelId: number, isPlayerClicked: boolean) {
            if (
                !this.isGameStart ||
                (isPlayerClicked &&
                    this.gameMode === 1 &&
                    !this.isPlayerTurn) ||
                this.isCpuMessageTyping ||
                this.isSleep ||
                this.isGameEnd
            ) {
                return
            }

            console.log(
                '----------------------------\nselectPanel',
                isPlayerClicked ? 'プレイヤー' : 'CPU',
                `panelId:${panelId}`,
            )

            // 1) パネルStoreから該当パネルを取得
            const panelStore = usePanelStore()
            const panel = panelStore.panels.find((p) => p.id === panelId)
            if (!panel) {
                return
            }

            console.log('選んだpanel:', panel)
            console.log('this.currentletter:', this.currentletter)

            // 2) すでに選ばれていたら何もしない等のチェック
            if (panel.isUsed) {
                return
            }

            const result = checkPanelWords(this.currentletter, panel.words) //1 or 2 or 3が返るように（1:オッケー、2：間違い、3：「ん」または「ン」が最後に来るものが引っ掛かった）
            console.log('result', result)
            console.log('-----------------')

            const seStore = useSeStore()

            if (this.isPlayerTurn) {
                this.clearTimer()

                const cpuMessage = getCpuMessageWhenPlayerSelect(
                    result.matchedWord,
                    result.code,
                    this.cpuStrong,
                )

                if (result.code === 1) {
                    seStore.playSE('correct')
                    await sleepWithState(this, 'isSleep', 2000)
                    await this.setCpuMessage(cpuMessage)
                } else if (result.code === 2) {
                    seStore.playSE('incorrect')
                    await sleepWithState(this, 'isSleep', 2000)
                    await this.setCpuMessage(cpuMessage)
                } else {
                    seStore.playSE('incorrect')
                    await sleepWithState(this, 'isSleep', 2000)
                    await this.setCpuMessage(cpuMessage)
                    await this.setCpuMessage('つまり…')
                    this.endGame('lose') //「ん」なのでゲーム終了へ
                    return false
                }
            } else {
                if (result.code === 1) {
                    seStore.playSE('correct')
                    await sleepWithState(this, 'isSleep', 2000)
                    await this.setCpuMessage(
                        getCpuMessageWhenCpuPanelSelected(
                            this.cpuStrong,
                            result.matchedWord,
                        ),
                    )
                } else if (result.code === 2) {
                    seStore.playSE('incorrect')
                    await sleepWithState(this, 'isSleep', 2000)
                    await this.setCpuMessage(
                        getCpuMessageWhenCpuPanelSelectedWrong(this.cpuStrong),
                    )
                } else {
                    seStore.playSE('incorrect')
                    await sleepWithState(this, 'isSleep', 2000)
                    await this.setCpuMessage(
                        getCpuMessageWhenCpuPanelSelectedNEnd(
                            this.cpuStrong,
                            result.matchedWord,
                        ),
                    )
                    await this.setCpuMessage('つまり…')
                    this.endGame('win') //「ん」なのでゲーム終了へ
                    return false
                }
            }

            if (result.code === 1) {
                if (this.isPlayerTurn) {
                    this.playerScore++
                } else {
                    this.cpuScore++
                }
                panel.isUsed = true
                this.currentletter = result.nextLetter
            }

            if (this.gameMode === 1) {
                this.switchTurn()
            }
        },

        async switchTurn() {
            console.log('switchTurn')
            this.clearTimer()

            // 選択できるパネルがあるかの判定→ないならゲーム終了
            const panelStore = usePanelStore()
            if (!existsAvailablePanel(panelStore.panels, this.currentletter)) {
                await this.setCpuMessage(
                    getCpuMessageWhenAllPanelSelected(this.cpuStrong),
                )

                // スコアを比較
                if (this.playerScore > this.cpuScore) {
                    this.endGame('win')
                } else if (this.playerScore < this.cpuScore) {
                    this.endGame('lose')
                } else {
                    this.endGame('draw')
                }

                return false
            }

            this.isPlayerTurn = !this.isPlayerTurn
            this.turn++

            if (this.isPlayerTurn) {
                await this.setCpuMessage(
                    getCpuMessageWhenPlayerTurnChanged(
                        this.cpuStrong,
                        this.currentletter,
                    ),
                )
                this.startTimer()
            } else {
                await sleepWithState(this, 'isSleep', 500)

                await this.setCpuMessage(
                    getCpuMessageWhenCpuTurnChanged(this.cpuStrong),
                )
                await this.setCpuMessage(
                    getCpuMessageWhenCpuPanelSelectedBefore(this.cpuStrong),
                )

                this.runCpuAction()
            }
        },

        // ゲーム終了時の処理
        async endGame(result: 'win' | 'lose' | 'draw', isNEnd = false) {
            console.log('----------------')
            console.log('endGame:', `result:${result}`, `isNEnd:${isNEnd}`)

            const seStore = useSeStore()
            const bgmStore = useBgmStore()

            this.gameResult = result

            this.clearTimer()

            switch (result) {
                case 'win':
                    // プレイヤーが勝った
                    await this.setCpuMessage(
                        getCpuMessageWhenWinPlayer(this.cpuStrong),
                    )
                    this.isCpuBlinking = true
                    seStore.playSE('enemy_invisible')
                    await sleepWithState(this, 'isSleep', 3000)
                    this.isCpuDisplay = false
                    bgmStore.stopBGM()
                    seStore.playSE('win')

                    break
                case 'lose':
                    // プレイヤーが負け
                    await this.setCpuMessage(
                        getCpuMessageWhenLosePlayer(this.cpuStrong),
                    )
                    bgmStore.stopBGM()
                    seStore.playSE('lose')

                    break
                case 'draw':
                    // 引き分け
                    await this.setCpuMessage(
                        getCpuMessageWhenDraw(this.cpuStrong),
                    )
                    this.isCpuBlinking = true
                    seStore.playSE('enemy_invisible')
                    await sleepWithState(this, 'isSleep', 3000)
                    this.isCpuDisplay = false
                    bgmStore.stopBGM()
                    seStore.playSE('lose')

                    break
            }

            this.isGameEnd = true

            return false
        },

        async runCpuAction() {
            // CPUパネル選択
            const panelStore = usePanelStore()
            const chosenId = decideCpuPanelIdByProbability(
                panelStore.panels,
                this.currentletter,
                this.cpuStrong,
            )

            this.currentCpuHoverPanelId = chosenId

            console.log('runCpuAction CPUパネル選択:', chosenId)

            await sleepWithState(this, 'isSleep', 600)

            if (chosenId !== null) {
                // CPUが選んだパネルでselectPanel()
                this.selectPanel(chosenId, false)
            } else {
                // 候補が一切無ければnull
                console.log('CPUはパネルを選べなかった')
                // 何らかの処理 (ターン終了など)
            }
        },

        startTimer() {
            this.clearTimer()

            console.log('🔄 タイマーセット')

            // timeLimit初期値をセット
            this.timeLimit = TIME_LIMIT[this.cpuStrong]

            this.timerId = setInterval(async () => {
                if (this.timeLimit > 0) {
                    this.timeLimit--
                } else if (this.timeLimit === 0) {
                    // 一度だけ実行するためのチェック
                    console.log('⏳ 時間切れ！SE再生 & ターン交代準備')

                    this.timeLimit = -1 // 2回目以降は `playSE()` が実行されないようにする

                    this.clearTimer() // まずタイマーを停止

                    const seStore = useSeStore()
                    seStore.playSE('incorrect')

                    await sleepWithState(this, 'isSleep', 2000) // 待機
                    await this.setCpuMessage(
                        getCpuMessageWhenTimeOver(this.cpuStrong),
                    )

                    this.switchTurn() // ターンを交代
                }
            }, 1000)
        },

        // タイマーを明示的にクリアしたいとき使う
        clearTimer() {
            if (this.timerId) {
                clearInterval(this.timerId)
                this.timerId = null
                console.log('🛑 タイマークリア') // クリアされたことを確認
            }
        },

        /**
         * CPUのメッセージをセットし、すべて表示されるまで待つ
         */
        setCpuMessage(message: string, delayAfterTyping = 800): Promise<void> {
            return new Promise((resolve) => {
                const seStore = useSeStore()
                this.cpuMessage = '' // 初期化
                this.isCpuMessageTyping = true // タイピング中フラグON

                let index = 0
                const typingSpeed = 60 // 文字の表示速度（ミリ秒）

                // **プレーンテキスト（通常の文字列）**
                const typeNextCharacter = () => {
                    if (index < message.length) {
                        this.cpuMessage += message[index] // 1文字ずつ追加
                        seStore.playSE('message')
                        index++
                        setTimeout(typeNextCharacter, typingSpeed)
                    } else {
                        setTimeout(() => {
                            this.isCpuMessageTyping = false // 表示完了
                            resolve()
                        }, delayAfterTyping)
                    }
                }

                typeNextCharacter() // アニメーション開始
            })
        },
    },

    getters: {},
})
