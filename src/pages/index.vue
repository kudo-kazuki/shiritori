<script setup lang="ts">
import { onMounted } from 'vue'
import { useWindowHeight } from '@/composables/useWindowHeight'
import { useWindowWidthAndDevice } from '@/composables/useWindowWidthAndDevice'

const { windowHeight } = useWindowHeight()
const { windowWidth, deviceType } = useWindowWidthAndDevice()

const preloadImages = (paths: string[]) => {
    paths.forEach((path) => {
        const img = new Image()
        img.src = path
    })
}

onMounted(() => {})
</script>

<template>
    <div
        class="Page"
        :style="{ height: `${windowHeight}px` }"
        :data-device="deviceType"
        :data-windowWidth="windowWidth"
    >
        あああううう
    </div>
</template>
<style lang="scss" scoped>
.Page {
    overflow: hidden;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    &__cpuThinking {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        font-size: 40px;
        color: #fff;
        text-shadow: 1px 1px 0 #000;
    }

    @media screen and (max-width: 740px) {
        &__cpuThinking {
            font-size: var.vw(70);
        }
    }
}
</style>
