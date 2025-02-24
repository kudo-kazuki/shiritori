import { defineStore } from 'pinia'
import type { Panel } from '@/types/types'
import { allPanelData } from '@/data/panelData'

export const usePanelStore = defineStore('panel', {
    state: () => ({
        // 全パネルを格納する配列
        panels: [] as Panel[],
    }),

    actions: {
        // 初期化(ゲーム開始前に呼び出す)
        initPanels() {
            // マスターデータをコピー
            const copied = allPanelData.slice()
            // シャッフル
            copied.sort(() => Math.random() - 0.5)
            // 先頭36件をpanelsにセット
            this.panels = copied.slice(0, 36)

            // ゲーム開始前には使い回しフラグをリセット
            // JSON内で `isUsed: false` にしてあるならここでまとめて初期化してもOK
            this.panels.forEach((p) => {
                p.isUsed = false
            })
        },

        // 使われたパネルをマーク
        markAsUsed(panelId: number) {
            const panel = this.panels.find((p) => p.id === panelId)
            if (panel) {
                panel.isUsed = true
            }
        },
    },

    getters: {
        // まだ選ばれていないパネル一覧
        availablePanels: (state) => {
            return state.panels.filter((p) => !p.isUsed)
        },
    },
})
