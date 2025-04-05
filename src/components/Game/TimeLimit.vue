<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'

interface Props {
    time: number
    maxTime: number
}

const props = withDefaults(defineProps<Props>(), {
    time: 0,
})

const displayTime = ref(props.time)
let animationFrameId: number | null = null

// 前回更新されたタイムと、現在の time で補間する
const updateDisplayTime = (newTime: number) => {
    const startTime = performance.now()
    const start = displayTime.value
    const end = newTime
    const duration = 1000 // 1秒間で補間

    const animate = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        displayTime.value = start + (end - start) * progress

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate)
        }
    }

    animationFrameId = requestAnimationFrame(animate)
}

// props.timeが変わるたびに補間処理を行う
watch(
    () => props.time,
    (newTime) => {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId)
            animationFrameId = null
        }

        if (newTime === props.maxTime) {
            // アニメーションさせず即反映
            displayTime.value = newTime
        } else {
            // 補間アニメーション
            updateDisplayTime(newTime)
        }
    },
)

// 初期値
onMounted(() => {
    displayTime.value = props.time
})

onUnmounted(() => {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
    }
})

// ゲージの幅を%で計算
const timePercent = computed(() => {
    if (props.maxTime <= 0) return '0%'
    const percent = (displayTime.value / props.maxTime) * 100
    return `${Math.max(0, Math.min(percent, 100))}%`
})
</script>

<template>
    <div class="GameTimeLimit">
        <time
            class="GameTimeLimit__time"
            :class="{ 'GameTimeLimit__time--danger': displayTime < 10 }"
        >
            {{ displayTime < 0 ? 0 : Math.floor(displayTime) }}
        </time>
        <div class="GameTimeLimit__guage">
            <div
                class="GameTimeLimit__guageMeter"
                :style="{ width: timePercent }"
            ></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.GameTimeLimit {
    text-align: center;

    &__time {
        font-size: 32px;
        font-weight: bold;
        color: #000;
        text-shadow:
            1px 1px 0 #fff,
            -1px -1px 0 #fff,
            -1px 1px 0 #fff,
            1px -1px 0 #fff,
            0px 1px 0 #fff,
            0-1px 0 #fff,
            -1px 0 0 #fff,
            1px 0 0 #fff;

        &--danger {
            color: red;
        }
    }

    &__guage {
        position: relative;
        margin: 0 auto;
        border: 2px solid #000;
        background-color: #333;
        border-radius: 10px;
        width: 180px;
        height: 12px;
        overflow: hidden;
    }

    &__guageMeter {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        width: 100%;
        height: 14px;
        background-color: #ff8c8c;
        /* transition: width 1s linear; */
        transition: width 0.2s ease-out;
    }

    @media screen and (max-width: 1224px) {
        &__time {
            font-size: var.vw(32);
        }
    }

    @media screen and (max-width: 600px) {
        &__time {
            font-size: 24px;
            line-height: 1;
        }

        &__guage {
            width: 140px;
            height: 10px;
        }
    }
}
</style>
