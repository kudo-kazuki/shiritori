<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import playerImage from '@/assets/images/player.png'
import fireImage from '@/assets/images/fire.gif'

const gameStore = useGameStore()

const imagePath = computed(() => {
    return gameStore.gameResult === 'lose' ? fireImage : playerImage
})
</script>

<template>
    <div class="GamePlayer">
        <img class="GamePlayer__image" :src="imagePath" alt="" />
    </div>
</template>

<style lang="scss" scoped>
.GamePlayer {
    &__image {
        max-width: none;
        width: 100%;
        max-height: 100%;
    }

    @media screen and (max-width: 1220px) {
    }

    @media screen and (max-width: 600px) {
    }
}
</style>
