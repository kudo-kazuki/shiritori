import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useWindowWidthAndDevice() {
    const windowWidth = ref(window.innerWidth)

    // デバイス名を計算するcomputed
    const deviceType = computed(() => {
        if (windowWidth.value >= 1025) {
            return 'pc'
        } else if (windowWidth.value >= 768) {
            return 'tablet'
        } else {
            return 'sp'
        }
    })

    const updateWidth = () => {
        windowWidth.value = window.innerWidth
    }

    onMounted(() => {
        updateWidth() // 初期値を設定
        window.addEventListener('resize', updateWidth)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', updateWidth)
    })

    return {
        windowWidth,
        deviceType,
    }
}
