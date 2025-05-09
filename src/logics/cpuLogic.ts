// logics/cpuLogic.ts
import type { Panel } from '@/types/types'
import { toHiragana } from './shiritori' // ひらがな変換する関数

// CPUごとの確率テーブル
// 例: 1 => [正解率, 間違い率, ん率]
const CPU_PROBS: Record<number, [number, number, number]> = {
    1: [40, 50, 10],
    2: [65, 30, 5],
    3: [80, 19, 1],
}

/**
 * CPU がパネルを選ぶ (正解/間違い/ん を確率で選択し、そのカテゴリからランダム1枚)
 *
 * @param panels 全パネル一覧
 * @param currentLetter 現在のお題
 * @param cpuStrong CPUの強さ (1/2/3)
 * @returns 選んだパネルID or null
 */
export function decideCpuPanelIdByProbability(
    panels: Panel[],
    currentLetter: string,
    cpuStrong: number,
): number | null {
    // 1) 未使用のみ
    const unused = panels.filter((p) => !p.isUsed)

    // 2) 3カテゴリに振り分け
    const { correctSet, nSet, wrongSet } = splitPanelsByCategories(
        unused,
        currentLetter,
    )

    // 3) CPUの確率を取得
    let [probCorrect, probWrong, probN] = CPU_PROBS[cpuStrong] ?? [50, 40, 10]

    // 4) 'ん' パネルが無い場合、その確率を間違いに足す
    if (nSet.length === 0) {
        probWrong += probN
        probN = 0
    }

    // もし correctSet が全く無い場合、正解率を間違いに足すか？→要件次第
    // 今回は指定がないので、そのままにしておくか、
    // probWrong += probCorrect; probCorrect = 0
    // など好きな処理を書ける。

    // 5) カテゴリを抽選
    const chosenCategory = pickCategory(
        probCorrect,
        probWrong,
        probN,
        correctSet.length > 0,
        nSet.length > 0,
    )

    // 6) カテゴリが空ならフォールバック
    let chosenSet: Panel[] = []
    if (chosenCategory === 'correct') {
        chosenSet =
            correctSet.length > 0
                ? correctSet
                : wrongSet.length > 0
                  ? wrongSet
                  : nSet
    } else if (chosenCategory === 'wrong') {
        chosenSet =
            wrongSet.length > 0
                ? wrongSet
                : correctSet.length > 0
                  ? correctSet
                  : nSet
    } else {
        chosenSet =
            nSet.length > 0
                ? nSet
                : correctSet.length > 0
                  ? correctSet
                  : wrongSet
    }

    // 7) chosenSet からランダムに1枚
    if (chosenSet.length === 0) return null
    const randomIndex = Math.floor(Math.random() * chosenSet.length)
    return chosenSet[randomIndex].id
}

/**
 * パネルを (正解/ん/間違い) の3カテゴリに分割
 *
 * - "正解": currentLetterに合致する単語があり、末尾がん/ンではない
 * - "ん":  currentLetterに合致する単語があり、末尾がん/ンの単語が含まれる
 * - "間違い": 上記2つに該当しない
 */
function splitPanelsByCategories(panels: Panel[], currentLetter: string) {
    // 先頭文字判定のため、currentLetterをひらがなに正規化
    const letterNormalized = toHiragana(currentLetter)

    const correctSet: Panel[] = []
    const nSet: Panel[] = []
    const wrongSet: Panel[] = []

    for (const panel of panels) {
        let hasValidMatch = false
        let hasValidNEnding = false

        for (const w of panel.words) {
            // カタカナ→ひらがな変換
            const normalizedWord = toHiragana(w)

            // currentLetter で始まるワードのみ考慮
            if (
                !normalizedWord.startsWith(letterNormalized) ||
                letterNormalized === ''
            ) {
                continue // 関係ない単語は無視
            }

            hasValidMatch = true // ここまで来たら valid な単語

            // 末尾が「ん/ン」か？
            const last = normalizedWord.slice(-1)
            if (last === 'ん') {
                hasValidNEnding = true
            }
        }

        // 振り分け処理
        if (!hasValidMatch) {
            wrongSet.push(panel)
        } else if (hasValidNEnding) {
            nSet.push(panel) // 「ん」パネルに入れる
        } else {
            correctSet.push(panel) // 末尾「ん」なしのパネルのみ正解セットに入れる
        }
    }

    console.log(
        '正解パネル:',
        correctSet.map((p) => p.words),
    )
    console.log(
        '「ん」パネル:',
        nSet.map((p) => p.words),
    )
    console.log(
        '間違いパネル:',
        wrongSet.map((p) => p.words),
    )

    return { correctSet, nSet, wrongSet }
}

/**
 * 確率に応じて 'correct' / 'wrong' / 'n' を返す
 * 例: probCorrect=50, probWrong=40, probN=10 => 0~49 => correct, 50~89 => wrong, 90~99 => n
 */
function pickCategory(
    probCorrect: number,
    probWrong: number,
    probN: number,
    correctExists: boolean,
    nExists: boolean,
): 'correct' | 'wrong' | 'n' {
    // 「ん」のパネルがないなら、その確率を間違いカテゴリに足す
    if (!nExists) {
        probWrong += probN
        probN = 0
    }

    // 正解パネルがない場合、正解率を間違いに回す
    if (!correctExists) {
        probWrong += probCorrect
        probCorrect = 0
    }

    // 確率の合計を計算
    const sum = probCorrect + probWrong + probN
    if (sum <= 0) return 'wrong' // 万が一の対策

    // ランダム値でカテゴリを選択
    const r = Math.random() * sum
    if (r < probCorrect) {
        return 'correct'
    } else if (r < probCorrect + probWrong) {
        return 'wrong'
    } else {
        return 'n'
    }
}

/**
 * CPU がパネルを選ぶロジック。
 *
 * @param panels 全パネル一覧
 * @param currentLetter 現在のお題。「」(空)なら完全ランダム
 * @param excludeNEnding 末尾が「ん/ン」で終わる単語を含むパネルを排除するかどうか (デフォルト false)
 * @returns 選んだパネルID or null (候補なし)
 */
export function decideCpuPanelId(
    panels: Panel[],
    currentLetter: string,
    excludeNEnding: boolean = false,
): number | null {
    // 1) 未使用パネルのみ
    let candidates = filterUnusedPanels(panels)

    // 2) 末尾が「ん/ン」のパネルを除外する場合
    if (excludeNEnding) {
        candidates = filterNEndingPanels(candidates)
    }

    // 3) currentLetter が空なら、ここで候補決定 → ランダム抽選
    if (!currentLetter) {
        return pickRandomPanelId(candidates)
    }

    // 4) currentLetter がある場合 → 頭文字が合致するものに絞り込む
    candidates = filterPanelsByLetter(candidates, currentLetter)

    // 5) 候補からランダム抽選
    return pickRandomPanelId(candidates)
}

/**
 * 未使用パネルのみを返す (isUsed===false)
 */
function filterUnusedPanels(panels: Panel[]): Panel[] {
    return panels.filter((p) => !p.isUsed)
}

/**
 * 「末尾が ん/ン」の単語を含むパネルを除外
 *   もしパネル内の複数単語のうち1つでも末尾がん/ンなら排除するか？
 *   → ここでは「1単語でもあれば排除」としています。
 */
function filterNEndingPanels(panels: Panel[]): Panel[] {
    return panels.filter((panel) => {
        // パネルの単語をチェックし、
        // 末尾が「ん」 or 「ン」のものがあれば除外
        const hasNEnd = panel.words.some((w) => {
            const last = w[w.length - 1]
            return last === 'ん' || last === 'ン'
        })
        return !hasNEnd
    })
}

/**
 * currentLetter(例:'あ')で始まる単語があるパネルのみ返す
 *   「あ」と「ア」を同一視したいので、toHiraganaで正規化
 */
function filterPanelsByLetter(panels: Panel[], letter: string): Panel[] {
    const normalizedLetter = toHiragana(letter)

    return panels.filter((panel) => {
        // panel.words のうち、先頭文字(ひらがな化)が normalizedLetter のものが1つでもある
        return panel.words.some((word) => {
            const firstChar = toHiragana(word)[0] ?? ''
            return firstChar === normalizedLetter
        })
    })
}

/**
 * 候補パネル配列からランダムに1つ選び、そのIDを返す
 * 配列が空ならnull
 */
function pickRandomPanelId(panels: Panel[]): number | null {
    if (panels.length === 0) {
        return null
    }
    const randomIndex = Math.floor(Math.random() * panels.length)
    return panels[randomIndex].id
}

export function selectFirstPanelId(panels: Panel[]): number | null {
    if (panels.length === 0) {
        return null
    }
    let candidates = filterUnusedPanels(panels)
    candidates = filterNEndingPanels(candidates)

    const randomIndex = Math.floor(Math.random() * candidates.length)
    return candidates[randomIndex].id
}
