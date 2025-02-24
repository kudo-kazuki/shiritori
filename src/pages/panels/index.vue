<script setup lang="ts">
import { computed } from 'vue'
import { allPanelData } from '@/data/panelData'

// マスターデータを単純に参照
const allPanelDataRef = allPanelData

/**
 * ひらがなとカタカナを統一するための関数
 * - 「ア(カタカナ)」→「あ(ひらがな)」に変換
 * - 濁音や半濁音などは除去しないので「が」や「ぱ」はそのまま
 * - 例えば「ガ」→「が」、「パ」→「ぱ」
 */
function toHiragana(str: string): string {
    return str.replace(/[ァ-ン]/g, (s) => {
        // 「ガ」(U+30AC) → 「が」(U+304C) など
        return String.fromCharCode(s.charCodeAt(0) - 0x60)
    })
}

/**
 * 頭文字を取得
 * - カタカナはひらがなに変換する
 */
function getFirstChar(word: string): string {
    if (!word) return ''
    let first = word[0]
    // カタカナをひらがなに
    first = toHiragana(first)
    return first
}

/**
 * 末尾文字を取得
 * - 最後が「ー」なら一つ前の文字を使用
 * - カタカナはひらがなに変換
 */
function getLastChar(word: string): string {
    if (!word) return ''
    // 末尾が「ー」なら前の文字を使う
    let last = word[word.length - 1]
    if (last === 'ー' && word.length >= 2) {
        last = word[word.length - 2]
    }
    // カタカナをひらがなに
    last = toHiragana(last)
    return last
}

// 50音表を定義（濁音・半濁音も列挙して別カウントにする）
// 例として簡易的に一部だけ載せています。
// 必要に応じて「が,ぎ,ぐ,げ,ご...」「ぱ,ぴ,ぷ,ぺ,ぽ...」などすべて網羅してください。
const gojuon = [
    'あ',
    'い',
    'う',
    'え',
    'お',
    'か',
    'き',
    'く',
    'け',
    'こ',
    'が',
    'ぎ',
    'ぐ',
    'げ',
    'ご',
    'さ',
    'し',
    'す',
    'せ',
    'そ',
    'ざ',
    'じ',
    'ず',
    'ぜ',
    'ぞ',
    'た',
    'ち',
    'つ',
    'て',
    'と',
    'だ',
    'ぢ',
    'づ',
    'で',
    'ど',
    'な',
    'に',
    'ぬ',
    'ね',
    'の',
    'は',
    'ひ',
    'ふ',
    'へ',
    'ほ',
    'ば',
    'び',
    'ぶ',
    'べ',
    'ぼ',
    'ぱ',
    'ぴ',
    'ぷ',
    'ぺ',
    'ぽ',
    'ま',
    'み',
    'む',
    'め',
    'も',
    'や',
    'ゆ',
    'よ',
    'ら',
    'り',
    'る',
    'れ',
    'ろ',
    'わ',
    'を',
    'ん',
]

// 集計結果を計算
const startsAndEnds = computed(() => {
    // 「文字」=> { startCount, endCount } を保持するマップを生成
    const map = Object.fromEntries(
        gojuon.map((ch) => [ch, { startCount: 0, endCount: 0 }]),
    ) as Record<string, { startCount: number; endCount: number }>

    for (const panel of allPanelDataRef) {
        for (const w of panel.words) {
            const sc = getFirstChar(w)
            const ec = getLastChar(w)

            // 該当文字が map にあればカウント (なければ無視)
            if (map[sc]) {
                map[sc].startCount++
            }
            if (map[ec]) {
                map[ec].endCount++
            }
        }
    }

    // gojuon の順序で配列化
    return gojuon.map((ch) => {
        const { startCount, endCount } = map[ch]
        return { char: ch, startCount, endCount }
    })
})
</script>

<template>
    <div>
        <h1>Panel Master List</h1>
        <!-- ① マスターデータのテーブル表示 -->
        <table border="1" cellpadding="8">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Words</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="panel in allPanelData" :key="panel.id">
                    <td>{{ panel.id }}</td>
                    <td>
                        <!-- id から画像を参照 -->
                        <img
                            :src="`/src/assets/images/panels/${panel.id}.png`"
                            alt=""
                            width="80"
                        />
                    </td>
                    <td>{{ panel.words.join(' / ') }}</td>
                </tr>
            </tbody>
        </table>

        <h2>Starts / Ends Count</h2>
        <!-- ② 頭文字・末尾文字の集計結果を表示するテーブル -->
        <table border="1" cellpadding="8">
            <thead>
                <tr>
                    <th>文字</th>
                    <th>頭文字の数</th>
                    <th>末尾の数</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in startsAndEnds" :key="item.char">
                    <td>{{ item.char }}</td>
                    <td>{{ item.startCount }}</td>
                    <td>{{ item.endCount }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
