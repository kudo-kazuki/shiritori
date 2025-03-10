import { defineStore } from 'pinia'

interface SeState {
    loadedSe: Record<string, AudioBuffer> // プリロード済みのSEキャッシュ
    context: AudioContext | null
}

export const useSeStore = defineStore('se', {
    state: (): SeState => ({
        loadedSe: {}, // 事前ロードしたSEのキャッシュ
        context: null,
    }),

    actions: {
        /** **AudioContext を作成（iOS の制限回避） */
        initializeAudioContext() {
            if (!this.context) {
                this.context = new AudioContext()
                console.log('AudioContext initialized')
            }
        },

        /** **SE をプリロード（バッファ化） */
        async preloadSE(name: string) {
            if (!this.context) {
                console.error('AudioContext が未初期化です')
                return
            }
            if (this.loadedSe[name]) {
                console.log(`SE ${name} は既にロード済み`)
                return
            }

            try {
                const audioPath = new URL(
                    `../assets/se/${name}.mp3`,
                    import.meta.url,
                ).href
                const response = await fetch(audioPath)
                if (!response.ok) throw new Error(`SE ${name} のロードに失敗`)

                const arrayBuffer = await response.arrayBuffer()
                const audioBuffer =
                    await this.context.decodeAudioData(arrayBuffer)

                if (audioBuffer) {
                    this.loadedSe[name] = audioBuffer
                    console.log(`SE ${name} のロード完了`)
                }
            } catch (error) {
                console.error(`SE ${name} のロードエラー:`, error)
            }
        },

        /** **SE を再生（AudioBuffer を使用） */
        playSE(name: string, volume = 1.0) {
            if (!this.context) {
                console.error('AudioContext が未初期化です')
                return
            }

            const buffer = this.loadedSe[name]
            if (!buffer) {
                console.warn(`SE ${name} がロードされていません`)
                return
            }

            try {
                // **AudioBufferSourceNode は使い捨てなので毎回作成**
                const source = this.context.createBufferSource()
                source.buffer = buffer

                // **音量調整用の GainNode を作成**
                const gainNode = this.context.createGain()
                gainNode.gain.value = volume

                // **AudioGraph を構築**
                source.connect(gainNode)
                gainNode.connect(this.context.destination)

                source.start(0) // **即座に再生**
                console.log(`SE ${name} 再生`)
            } catch (error) {
                console.error(`SE ${name} の再生エラー:`, error)
            }
        },
    },
})
