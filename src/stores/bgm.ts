import { defineStore } from 'pinia'

interface BgmState {
    bgm: HTMLAudioElement | null
    isFirstLoop: boolean
    loadedBgm: Record<string, HTMLAudioElement> // プリロード済みのBGMキャッシュ
}

export const useBgmStore = defineStore('bgm', {
    state: (): BgmState => ({
        bgm: null, // 現在再生中のBGM
        isFirstLoop: true, // 1周目かどうかのフラグ
        loadedBgm: {}, // 事前ロードしたBGMのキャッシュ
    }),

    actions: {
        /**
         * BGMのスキップ秒数を曲ごとに設定
         */
        getSkipTime(name: string): number {
            const skipTimes: Record<string, number> = {
                battle: 2.23, // battle.mp3 は2秒スキップ
                field: 3, // field.mp3 は3秒スキップ
                menu: 0, // menu.mp3 はスキップなし（通常ループ）
            }
            return skipTimes[name] ?? 0 // デフォルトは0（スキップなし）
        },

        /**
         * BGMをプリロード（キャッシュ）
         */
        preloadBGM(name: string) {
            if (this.loadedBgm[name]) return // すでにロード済みならスキップ

            const audio = new Audio(`/src/assets/bgm/${name}.mp3`)
            audio.preload = 'auto' // **自動でロード**
            audio.volume = 0.5 // デフォルトの音量

            // **ロード完了後にキャッシュ**
            audio.addEventListener('canplaythrough', () => {
                this.loadedBgm[name] = audio
            })

            // **ロード開始**
            audio.load()
        },

        /**
         * BGMを再生（1周目は0秒、2周目以降は曲ごとのスキップ秒数）
         */
        playBGM(name: string) {
            if (this.bgm) {
                this.bgm.pause() // 既存のBGMを停止
            }

            this.isFirstLoop = true // 1周目のフラグをセット
            this.bgm =
                this.loadedBgm[name] || new Audio(`/src/assets/bgm/${name}.mp3`)

            this.bgm.volume = 0.5
            this.bgm.currentTime = 0 // **1周目は0秒から再生**
            this.bgm.play()

            this.bgm.addEventListener('ended', () => {
                if (this.bgm) {
                    this.isFirstLoop = false // 2周目以降
                    const skipTime = this.getSkipTime(name) // **曲ごとのスキップ秒数を取得**
                    this.bgm.currentTime = skipTime
                    this.bgm.play()
                }
            })
        },

        /**
         * BGMを停止
         */
        stopBGM() {
            if (this.bgm) {
                this.bgm.pause()
                this.bgm.currentTime = 0
                this.bgm = null
                this.isFirstLoop = true
            }
        },
    },
})
