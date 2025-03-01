<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useGameStore } from '@/stores/game'
import { usePanelStore } from '@/stores/panel'

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
    }, 1)

    window.addEventListener('resize', adjustPanelSize) // ウィンドウサイズ変更時も更新
})

// コンポーネントが破棄されたらイベントリスナーを削除
onBeforeUnmount(() => {
    window.removeEventListener('resize', adjustPanelSize)
})
</script>

<template>
    <ul
        class="GameShiritoiArea"
        :class="{ 'GameShiritoiArea--adjustCompleted': isAdjustCompleted }"
    >
        <li
            v-for="panel in panelStore.panels"
            :key="panel.id"
            class="GameShiritoiArea__panel"
            ref="panelRef"
        >
            <Panel v-bind="panel" />
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.GameShiritoiArea {
    width: 100%;
    height: 100%;
    background: url(/src/assets/images/board.png) no-repeat center top;
    background-size: cover;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
    opacity: 0;
    transition: 0.2s ease opacity;

    &--adjustCompleted {
        opacity: 1;
    }

    &__panel {
        width: calc((100% / 9) - 4px);
        background-color: rgba(255, 255, 255, 0.2); /* 仮の背景色（確認用） */
        border: 1px solid rgba(255, 255, 255, 0.5); /* 視認性向上 */
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid orange;
    }

    @media screen and (max-width: 1224px) {
        padding: 0 var.vw(4);

        &__panel {
            width: calc((100% / 9) - var.vw(8));
        }
    }

    @media screen and (max-width: 600px) {
        &__panel {
            width: calc((100% / 6) - var.vw(8));
        }
    }
}
</style>
