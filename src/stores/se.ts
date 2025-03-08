import { defineStore } from 'pinia'

interface SeState {
    loadedSe: Record<string, HTMLAudioElement> // プリロード済みのSEキャッシュ
}

export const useSeStore = defineStore('se', {
    state: (): SeState => ({
        loadedSe: {}, // 事前ロードしたSEのキャッシュ
    }),

    actions: {
        /**
         * SEをプリロード（キャッシュ）
         * @param name SEファイル名（拡張子なし）
         */
        preloadSE(name: string) {
            if (this.loadedSe[name]) return // すでにロード済みならスキップ

            const audio = new Audio(`/src/assets/se/${name}.mp3`)
            audio.preload = 'auto' // **事前ロード**
            this.loadedSe[name] = audio

            // **ロード開始**
            audio.load()
        },

        /**
         * SEを再生（前のSEが終わってなくてもかぶせて鳴らす）
         * @param name SEファイル名（拡張子なし）
         * @param volume 音量（デフォルト 1.0）
         */
        playSE(name: string, volume = 1.0) {
            const se =
                this.loadedSe[name] || new Audio(`/src/assets/se/${name}.mp3`)
            se.volume = volume
            se.currentTime = 0 // **常に最初から再生**
            se.play()

            // console.log('playSE', name)

            // **キャッシュがない場合は追加**
            if (!this.loadedSe[name]) {
                this.loadedSe[name] = se
            }
        },
    },
})
