import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowHeight() {
    const windowHeight = ref(window.innerHeight)

    const updateHeight = () => {
        windowHeight.value = window.innerHeight
    }

    onMounted(() => {
        updateHeight() // 初期値を設定
        window.addEventListener('resize', updateHeight)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', updateHeight)
    })

    return {
        windowHeight,
    }
}
