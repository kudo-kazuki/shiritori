import {
    START_MESSAGE,
    START_PANEL_SELECT_BEFORE_MESSAGE,
    PLAYER_TURN_CHANGED,
    CORRECT_PLAYER_EASY,
    CORRECT_PLAYER_HARD,
    CPU_TURN_CHANGED,
    CPU_PANEL_SELECTED_BEFORE,
    CPU_PANEL_SELECTED,
    WRONG_PLAYER,
    CORRECT_CPU,
    WRONG_CPU,
    N_END_PLAYER,
    N_END_CPU,
    ALL_PANEL_SELECTED,
    WIN_PLAYER,
    LOSE_PLAYER,
    TIME_OVER,
    DRAW,
} from '@/logics/cpuMessageTemplates'
import { DIFFICULT_WORDS } from '@/data/panelData'

/**ゲーム開始時 */
export function getCpuMessageWhenGameStart(cpuStrong: number): string {
    return START_MESSAGE[cpuStrong]
}

/**最初のパネルを選ぶ前 */
export function getCpuMessageWhenFirstSelectPanel(cpuStrong: number): string {
    return START_PANEL_SELECT_BEFORE_MESSAGE[cpuStrong]
}

/**CPUがパネルを選ぶ前 */
export function getCpuMessageWhenCpuPanelSelectedBefore(
    cpuStrong: number,
): string {
    return CPU_PANEL_SELECTED_BEFORE[cpuStrong]
}

/**CPUがパネルを選んだとき */
export function getCpuMessageWhenCpuPanelSelected(
    cpuStrong: number,
    word: string,
): string {
    let template = CPU_PANEL_SELECTED[cpuStrong]
    return template.replace('{{word}}', word)
}

/**CPUがパネルを選んで間違えたとき */
export function getCpuMessageWhenCpuPanelSelectedWrong(
    cpuStrong: number,
): string {
    return WRONG_CPU[cpuStrong]
}

/**CPUがパネルを選んで「ん」が付いたたとき */
export function getCpuMessageWhenCpuPanelSelectedNEnd(
    cpuStrong: number,
    word: string,
): string {
    let template = N_END_CPU[cpuStrong]
    return template.replace('{{word}}', word)
}

/**選べるパネルがなくなったとき */
export function getCpuMessageWhenAllPanelSelected(cpuStrong: number): string {
    return ALL_PANEL_SELECTED[cpuStrong]
}

/**プレイヤーにターンが変わったとき */
export function getCpuMessageWhenPlayerTurnChanged(
    cpuStrong: number,
    word: string,
): string {
    let template = PLAYER_TURN_CHANGED[cpuStrong]
    return template.replace('{{word}}', word)
}

/**プレイヤーが勝ったとき */
export function getCpuMessageWhenWinPlayer(cpuStrong: number): string {
    return WIN_PLAYER[cpuStrong]
}

/**プレイヤーが負けたとき */
export function getCpuMessageWhenLosePlayer(cpuStrong: number): string {
    return LOSE_PLAYER[cpuStrong]
}

/**引き分けのとき */
export function getCpuMessageWhenDraw(cpuStrong: number): string {
    return DRAW[cpuStrong]
}

/**CPUにターンが変わったとき */
export function getCpuMessageWhenCpuTurnChanged(cpuStrong: number): string {
    return CPU_TURN_CHANGED[cpuStrong]
}

/**プレイヤーがパネルを選んだあと */
export function getCpuMessageWhenPlayerSelect(
    selectedWord: string, // プレイヤーが選んだ単語
    resultCode: number, // checkPanelWordsの結果: 1=OK,2=不正,3=ん終わり
    cpuStrong: number,
): string {
    let template = ''

    switch (resultCode) {
        // 正解
        case 1:
            const isDifficult = DIFFICULT_WORDS.includes(selectedWord)
            template = isDifficult
                ? CORRECT_PLAYER_HARD[cpuStrong]
                : CORRECT_PLAYER_EASY[cpuStrong]

            return template.replace('{{word}}', selectedWord)

        // 不正解
        case 2:
            return WRONG_PLAYER[cpuStrong]

        // "ん"終わり
        case 3:
            template = N_END_PLAYER[cpuStrong]
            return template.replace('{{word}}', selectedWord)

        default:
            return ''
    }
}

/**cpuがパネルを選んだあと */
export function getCpuMessageWhenCpuSelectAfter(
    selectedWord: string, // cpuが選んだ単語
    resultCode: number, // checkPanelWordsの結果: 1=OK,2=不正,3=ん終わり
    cpuStrong: number,
): string {
    let template = ''

    switch (resultCode) {
        // 正解
        case 1:
            template = CORRECT_CPU[cpuStrong]
            return template.replace('{{word}}', selectedWord)

        // 不正解
        case 2:
            return WRONG_CPU[cpuStrong]

        // "ん"終わり
        case 3:
            template = N_END_CPU[cpuStrong]
            return template.replace('{{word}}', selectedWord)

        default:
            return ''
    }
}

/**時間切れのとき */
export function getCpuMessageWhenTimeOver(cpuStrong: number): string {
    return TIME_OVER[cpuStrong]
}
