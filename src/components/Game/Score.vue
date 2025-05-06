<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import scorePlayer from '@/assets/images/score_player.png'
import scoreEnemy from '@/assets/images/score_enemy.png'
import sparkle from '@/assets/images/sparkle.webp'

interface Props {
    score?: number
    passScore?: number
    isEnemy?: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const icon = computed(() => {
    return props.isEnemy ? scoreEnemy : scorePlayer
})

// キラキラ表示状態
const sparkleVisibleMap = ref<boolean[]>([])

// タイマー制御用
let sparkleShowTimer: ReturnType<typeof setTimeout> | null = null
let sparkleHideTimer: ReturnType<typeof setTimeout> | null = null

// 表示時間（ミリ秒）
const SPARKLE_DURATION = 1000

// 次の表示の間隔（ミリ秒）
const SPARKLE_INTERVAL_MIN = 3000
const SPARKLE_INTERVAL_MAX = 6000

// 各表示にかけるディレイ（ミリ秒）
const SPARKLE_DELAY_BASE = 10 // 基本の間隔（順番にかけるディレイ）
const SPARKLE_DELAY_VARIANCE = 40 // ランダム揺らぎの最大値

const updateSparkles = () => {
    const count = props.score ?? 0

    // 表示するキラキラの数をスコア数に応じて決定
    const visibleCount = count < 3 ? 1 : count < 16 ? 2 : 3

    // すべて非表示に初期化
    sparkleVisibleMap.value = Array(count).fill(false)

    // 表示するインデックスをランダムに選出
    const indices = Array.from({ length: count }, (_, i) => i)
    const selectedIndices: number[] = []

    for (let i = 0; i < visibleCount; i++) {
        if (indices.length === 0) break
        const randIndex = Math.floor(Math.random() * indices.length)
        selectedIndices.push(indices.splice(randIndex, 1)[0])
    }

    // 各インデックスに少しずつdelayをかけて表示
    selectedIndices.forEach((index, i) => {
        const delay =
            i * SPARKLE_DELAY_BASE + // 順番ごとのベースディレイ
            Math.random() * SPARKLE_DELAY_VARIANCE // ランダムな揺らぎ

        setTimeout(() => {
            if (sparkleVisibleMap.value[index] !== undefined) {
                sparkleVisibleMap.value[index] = true
            }
        }, delay)
    })

    // 表示開始から一定時間後にすべて非表示に戻す
    sparkleHideTimer = setTimeout(() => {
        sparkleVisibleMap.value = Array(count).fill(false)
    }, SPARKLE_DURATION)

    // 次回の表示タイミングをランダム（5〜10秒後）にスケジュール
    const nextDelay =
        SPARKLE_INTERVAL_MIN +
        Math.random() * (SPARKLE_INTERVAL_MAX - SPARKLE_INTERVAL_MIN)

    sparkleShowTimer = setTimeout(updateSparkles, nextDelay)
}

onMounted(() => {
    updateSparkles()
})

onBeforeUnmount(() => {
    if (sparkleShowTimer) clearTimeout(sparkleShowTimer)
    if (sparkleHideTimer) clearTimeout(sparkleHideTimer)
})

watch(
    () => props.score,
    () => {
        if (sparkleShowTimer) clearTimeout(sparkleShowTimer)
        if (sparkleHideTimer) clearTimeout(sparkleHideTimer)
        updateSparkles()
    },
)
</script>

<template>
    <ul class="GameScore" :class="{ 'GameScore--enemy': isEnemy }">
        <li
            v-for="(n, index) in score"
            :key="n + index"
            class="GameScore__score"
        >
            <img class="GameScore__icon" :src="icon" alt="" />
            <img
                v-if="sparkleVisibleMap[index]"
                class="GameScore__sparkle"
                :src="sparkle"
                alt=""
            />
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.GameScore {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;

    &--enemy {
        text-align: right;
        flex-direction: row-reverse;
    }

    &__score {
        line-height: 0;
        position: relative;
    }

    &__icon {
        width: 24px;
    }

    &__sparkle {
        position: absolute;
        top: 0;
        left: 0;
    }

    @media screen and (max-width: 1220px) {
        &__icon {
            width: var.vw(24);
        }
    }

    @media screen and (max-width: 600px) {
        &--enemy {
            text-align: left;
            flex-direction: row;
        }

        &__icon {
            width: 12px;
        }
    }
}
</style>
