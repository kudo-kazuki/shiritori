<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    score?: number
    passScore?: number
}
const props = withDefaults(defineProps<Props>(), {})

// `score` が奇数のとき、最後にダミーの `●` を追加
const scoreList = computed<Array<number | null>>(() => {
    if (!props.score || props.score <= 0) return []

    const list: Array<number | null> = Array.from(
        { length: props.score },
        (_, i) => i + 1,
    )

    // 奇数ならリストの2番目（インデックス1）に `null` を挿入
    if (props.score % 2 !== 0) {
        list.splice(1, 0, null) // 2番目に `null`（ダミーの `●`）を挿入
    }

    return list
})
</script>

<template>
    <div class="GameScore">
        <div class="GameScore__inner">
            <ul v-if="score" class="GameScore__scores">
                <li
                    v-for="(n, index) in scoreList"
                    :key="index"
                    class="GameScore__score"
                    :class="{ 'GameScore__score--dummy': n === null }"
                    :aria-hidden="n === null"
                    :role="n === null ? 'presentation' : undefined"
                >
                    &nbsp;
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss" scoped>
$scoreSize: 30px;

.GameScore {
    width: 104px;
    height: 100%;
    background-color: #111;
    border-radius: 10px;
    border: 6px solid #ccc;

    &__inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 8px;
    }

    &__scores {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 4px;
        width: 100%;
    }

    &__score {
        width: $scoreSize;
        height: $scoreSize;
        background-color: yellow;
        border-radius: 50%;

        &--dummy {
            background-color: transparent;
        }
    }
}
</style>
