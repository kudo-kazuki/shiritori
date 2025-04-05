<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { usePanelStore } from '@/stores/panel'
import cpuCursor from '@/assets/images/cpu_cursor.png'

const panelStore = usePanelStore()
const gameStore = useGameStore()

const panelRef = ref<HTMLLIElement[]>([]) // 各パネルを参照する

// 各 `li` の高さを `getComputedStyle` で小数点まで正確に設定
const adjustPanelSize = () => {
    panelRef.value.forEach((panel) => {
        if (panel) {
            const computedWidth = getComputedStyle(panel).width // 小数点まで取得
            panel.style.height = computedWidth // 幅と同じ値を高さに適用
        }
    })
}

const isAdjustCompleted = ref(false)

// コンポーネントがマウントされたら高さを調整
onMounted(async () => {
    await nextTick()

    setTimeout(() => {
        adjustPanelSize()
        isAdjustCompleted.value = true
    }, 50)

    window.addEventListener('resize', adjustPanelSize) // ウィンドウサイズ変更時も更新
})

// コンポーネントが破棄されたらイベントリスナーを削除
onBeforeUnmount(() => {
    window.removeEventListener('resize', adjustPanelSize)
})

const cpuCursorPos = ref<{
    top: string | number
    left: string | number
}>({ top: '-100%', left: 0 }) // CPUカーソルの位置

// currentCpuHoverPanelId が変わったら位置を計算
watch(
    () => gameStore.currentCpuHoverPanelId,
    async (newId) => {
        if (newId === null) return

        // パネルの更新後に座標を取得するため nextTick を使用
        await nextTick()

        const targetPanel = panelRef.value.find((el) => {
            const panelId = panelStore.panels.find(
                (panel) => panel.id === newId,
            )
            return panelId && el.dataset.id === String(panelId.id)
        })

        if (targetPanel) {
            const rect = targetPanel.getBoundingClientRect()
            const parentRect = targetPanel
                .closest('.GameShiritoiArea')
                ?.getBoundingClientRect()

            if (parentRect) {
                cpuCursorPos.value.top = rect.top - parentRect.top
                cpuCursorPos.value.left = rect.left - parentRect.left
            }
        }
    },
)
</script>

<template>
    <div
        class="GameShiritoiArea"
        :class="{ 'GameShiritoiArea--adjustCompleted': isAdjustCompleted }"
    >
        <ul class="GameShiritoiArea__panels">
            <li
                v-for="panel in panelStore.panels"
                :key="panel.id"
                class="GameShiritoiArea__panel"
                :data-id="panel.id"
                ref="panelRef"
            >
                <Panel v-bind="panel" />
            </li>
        </ul>

        <img
            class="GameShiritoiArea__cpuCursor"
            :src="cpuCursor"
            :style="{
                top: `${cpuCursorPos.top}px`,
                left: `${cpuCursorPos.left}px`,
            }"
            alt=""
        />
    </div>
</template>

<style lang="scss" scoped>
.GameShiritoiArea {
    position: relative;

    &--adjustCompleted {
        opacity: 1;
    }

    &__panels {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        /* padding: 0 4px; */
        transition: 0.2s ease opacity;
    }

    &__panel {
        position: relative;
        width: calc((100% / 9));
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #ccc;
        border-image: url(/src/assets/images/panel.png) 12 fill stretch;
        border-width: 12px;
    }

    &__cpuCursor {
        position: absolute;
        top: -100%;
        left: -100%;
        height: 50px;
        filter: drop-shadow(2px 2px 3px #000);
        transition:
            top 0.3s ease,
            left 0.3s ease;
    }

    @media screen and (max-width: 1224px) {
        &__panels {
            /* padding: 0 var.vw(4); */
        }

        &__panel {
            width: calc((100% / 9));
        }
    }

    @media screen and (max-width: 600px) {
        &__panel {
            width: calc((100% / 6));
            border-image: url(/src/assets/images/panel.png) 11 fill stretch;
            border-width: 8px;
        }

        &__cpuCursor {
            height: 30px;
        }
    }
}
</style>
