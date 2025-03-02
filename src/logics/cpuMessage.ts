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
    WRONG_CPU,
    N_END_PLAYER,
    N_END_CPU,
    ALL_PANEL_SELECTED,
    WIN_PLAYER,
    LOSE_PLAYER,
} from '@/logics/cpuMessageTemplates'
import { DIFFICULT_WORDS } from '@/data/panelData'

export function getCpuMessageWhenGameStart(cpuStrong: number): string {
    return START_MESSAGE[cpuStrong]
}

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
