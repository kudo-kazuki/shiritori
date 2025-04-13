<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { usePanelStore } from '@/stores/panel'
import { useWindowHeight } from '@/composables/useWindowHeight'
import { useWindowWidthAndDevice } from '@/composables/useWindowWidthAndDevice'
import cpuCursor from '@/assets/images/cpu_cursor.png'

const panelStore = usePanelStore()
const gameStore = useGameStore()
const { windowHeight } = useWindowHeight()
const { deviceType } = useWindowWidthAndDevice()

const panelRef = ref<HTMLLIElement[]>([]) // 各パネルを参照する

const MAX_HEIGHT_ROW3 = 650
const MAX_HEIGHT_ROW2 = 500
const isLandScape = ref(true) //横長かどうか
const updateIsLandScape = () => {
    isLandScape.value = window.innerWidth > window.innerHeight
}

const columns = computed(() => {
    let col = 9

    if (deviceType.value === 'pc') {
        if (isLandScape.value) {
            if (windowHeight.value < MAX_HEIGHT_ROW2) {
                col = 18
            } else if (windowHeight.value < MAX_HEIGHT_ROW3) {
                col = 12
            }
        } else {
            col = 6
        }
    } else if (deviceType.value === 'tablet') {
        if (isLandScape.value) {
            if (windowHeight.value < MAX_HEIGHT_ROW2) {
                col = 18
            } else if (windowHeight.value < MAX_HEIGHT_ROW3) {
                col = 12
            }
        } else {
            col = 6
        }
    } else {
        if (isLandScape.value) {
            if (windowHeight.value < MAX_HEIGHT_ROW2) {
                col = 18
            } else if (windowHeight.value < MAX_HEIGHT_ROW3) {
                col = 12
            }
        } else {
            col = 6
        }
    }

    return col
})

// 各 `li` の高さを `getComputedStyle` で小数点まで正確に設定
const adjustPanelSize = async () => {
    await nextTick()
    console.log('adjustPanelSize')
    setTimeout(() => {
        panelRef.value.forEach((panel) => {
            if (panel) {
                const computedWidth = getComputedStyle(panel).width // 小数点まで取得
                panel.style.height = computedWidth // 幅と同じ値を高さに適用
            }
        })
    }, 20)
}

const isAdjustCompleted = ref(false)

// コンポーネントがマウントされたら高さを調整
onMounted(async () => {
    updateIsLandScape()

    await nextTick()

    setTimeout(() => {
        adjustPanelSize()
        isAdjustCompleted.value = true
    }, 10)

    window.addEventListener('resize', adjustPanelSize) // ウィンドウサイズ変更時も更新
    window.addEventListener('resize', updateIsLandScape)
})

// コンポーネントが破棄されたらイベントリスナーを削除
onBeforeUnmount(() => {
    window.removeEventListener('resize', adjustPanelSize)
    window.removeEventListener('resize', updateIsLandScape)
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
                :class="`GameShiritoiArea__panel--col${columns}`"
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
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #ccc;
        border-image: url(/src/assets/images/panel.png) 12 fill stretch;
        border-width: 12px;

        &--col18 {
            width: calc((100% / 18));
        }

        &--col12 {
            width: calc((100% / 12));
        }

        &--col9 {
            width: calc((100% / 9));
        }

        &--col6 {
            width: calc((100% / 6));
        }

        &--col4 {
            width: calc((100% / 4));
        }
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
        }
    }

    @media screen and (max-width: 600px) {
        &__panel {
            border-image: url(/src/assets/images/panel.png) 11 fill stretch;
            border-width: 8px;
        }

        &__cpuCursor {
            height: 30px;
        }
    }
}
</style>
