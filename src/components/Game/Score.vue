<script setup lang="ts">
import { computed } from 'vue'
import scorePlayer from '@/assets/images/score_player.png'
import scoreEnemy from '@/assets/images/score_enemy.png'

interface Props {
    score?: number
    passScore?: number
    isEnemy?: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const icon = computed(() => {
    return props.isEnemy ? scoreEnemy : scorePlayer
})
</script>

<template>
    <ul class="GameScore" :class="{ 'GameScore--enemy': isEnemy }">
        <li
            v-for="(n, index) in score"
            :key="n + index"
            class="GameScore__score"
        >
            <img class="GameScore__icon" :src="icon" alt="" />
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
    }

    &__icon {
        width: 20px;
    }

    @media screen and (max-width: 1220px) {
        &__icon {
            width: var.vw(20);
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
