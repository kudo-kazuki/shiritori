<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSeStore } from '@/stores/se'
import { useBgmStore } from '@/stores/bgm'
import player from '@/assets/images/player.png'
import panel from '@/assets/images/panel.png'
import cpu_cursor from '@/assets/images/cpu_cursor.png'
import score_enemy from '@/assets/images/score_enemy.png'
import score_player from '@/assets/images/score_player.png'
import sparkle from '@/assets/images/sparkle.webp'
import fukidashi from '@/assets/images/fukidashi.png'

const seStore = useSeStore()
const bgmStore = useBgmStore()

onMounted(() => {
    window.addEventListener(
        'click',
        () => {
            seStore.initializeAudioContext()

            const seFiles = import.meta.glob('/src/assets/se/*')
            if (seFiles) {
                Object.keys(seFiles).forEach((fullPath) => {
                    const fileName = fullPath.replace('/src/assets/se/', '')
                    const seName = fileName.replace('.mp3', '')
                    seStore.preloadSE(seName)
                })
            }

            const bgmFiles = import.meta.glob('/src/assets/bgm/*')
            if (bgmFiles) {
                Object.keys(bgmFiles).forEach((fullPath) => {
                    const fileName = fullPath.replace('/src/assets/bgm/', '')
                    const bgmName = fileName.replace('.mp3', '')
                    bgmStore.preloadBGM(bgmName)
                })
            }
        },
        { once: true },
    ) // **1回だけ実行**
})

// 指定したフォルダ内のファイルを取得
const cpuFiles = import.meta.glob('/src/assets/images/cpu/*', { eager: true })
const cpuFilePaths = ref(
    Object.values(cpuFiles).map((mod: any) => mod.default), // ファイルの URL を取得
)
const cpuActionsFiles = import.meta.glob('/src/assets/images/cpu/actions/*', {
    eager: true,
})
const cpuActionsFilePaths = ref(
    Object.values(cpuActionsFiles).map((mod: any) => mod.default), // ファイルの URL を取得
)

console.log(cpuActionsFilePaths.value)

const panelFiles = import.meta.glob('/src/assets/images/panels/*', {
    eager: true,
})
const panelFilePaths = ref(
    Object.values(panelFiles).map((mod: any) => mod.default), // ファイルの URL を取得
)
</script>

<template>
    <ul class="PreLoad">
        <li>
            <img :src="player" alt="" />
        </li>
        <li>
            <img :src="panel" alt="" />
        </li>
        <li>
            <img :src="cpu_cursor" alt="" />
        </li>
        <li>
            <img :src="score_enemy" alt="" />
        </li>
        <li>
            <img :src="score_player" alt="" />
        </li>
        <li>
            <img :src="sparkle" alt="" />
        </li>
        <li>
            <img :src="fukidashi" alt="" />
        </li>
        <li v-for="(filePath, index) in cpuFilePaths" :key="index">
            <img :src="filePath" alt="" />
        </li>
        <li v-for="(filePath, index) in panelFilePaths" :key="index">
            <img :src="filePath" alt="" />
        </li>
        <li v-for="(filePath, index) in panelFilePaths" :key="index">
            <img :src="filePath" alt="" />
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.PreLoad {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    flex-wrap: wrap;
    opacity: 0;

    img {
        width: 10px;
        height: 10px;
    }
}
</style>
