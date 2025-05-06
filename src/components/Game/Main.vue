<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const gameStore = useGameStore()
</script>

<template>
    <div class="GameMain">
        <ShiritoiArea />
        <ul class="GameMain__scores">
            <li class="GameMain__score">
                <Score :score="gameStore.playerScore" />
            </li>
            <li class="GameMain__score GameMain__score--enemy">
                <Score :score="gameStore.cpuScore" isEnemy />
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.GameMain {
    max-width: 900px;
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    padding: 0 12px 0;
    margin: 0 auto;
    z-index: 1;

    &__scores {
        display: flex;
        justify-content: space-between;
    }

    &__score {
        width: 49%;
        height: 48px;
    }

    @media screen and (max-width: 1220px) {
        padding: 0;

        &__score {
            height: var.vw(48);
        }
    }

    @media screen and (max-width: 600px) {
        flex-direction: column;
        height: auto;
        row-gap: 12px;

        &__scores {
            flex-direction: column;
            row-gap: 12px;
        }

        &__score {
            width: 100%;
            height: 30px;
        }
    }
}
</style>
