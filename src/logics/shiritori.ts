// logic/shiritori.ts

interface CheckResult {
    code: 1 | 2 | 3 // 1=OK, 2=不正解, 3=末尾"ん"
    nextLetter: string // code=1のときのみ使うが、型上は常に返す
    matchedWord: string // code=1のとき、実際にマッチした単語(元の文字列)を入れる
    // code=2 or 3の場合は空文字でもOK
}

function toHiragana(str: string): string {
    return str.replace(/[ァ-ヶ]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0x60)
    })
}

/**
 * パネル判定
 * @param currentLetter - 現在のお題 (例: 'あ')
 * @param words - パネルの単語配列
 * @returns CheckResult
 */
export function checkPanelWords(
    currentLetter: string,
    words: string[],
): CheckResult {
    if (!currentLetter || words.length === 0) {
        return { code: 2, nextLetter: '', matchedWord: '' }
    }

    const normalizedLetter = toHiragana(currentLetter)

    for (const word of words) {
        if (!word) continue
        const normalizedWord = toHiragana(word)

        // 先頭文字チェック
        const firstChar = normalizedWord[0] ?? ''
        if (firstChar === normalizedLetter) {
            // OK候補。末尾チェック
            const next = getLastCharHiragana(word)

            // 末尾が「ん」なら負け
            if (next === 'ん') {
                return { code: 3, nextLetter: '', matchedWord: word }
            }

            // 正解 (1) + 選んだ単語を返す
            return {
                code: 1,
                nextLetter: next,
                matchedWord: word,
            }
        }
    }

    // 合致する単語が1つも無い場合
    return { code: 2, nextLetter: '', matchedWord: '' }
}

function getLastCharHiragana(word: string): string {
    let last = word[word.length - 1]
    if (last === 'ー' && word.length >= 2) {
        last = word[word.length - 2]
    }
    if (last === 'ン') {
        last = 'ん'
    }
    last = toHiragana(last)
    return last
}
