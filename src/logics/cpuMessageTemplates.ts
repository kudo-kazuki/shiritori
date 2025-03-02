export const START_MESSAGE: Record<number, string> = {
    1: `しりとりで勝負ですか？いいですよ…。`,
    2: `しりとりで勝負ですって？いいわ、かかって来なさい！`,
    3: `しりとりで勝負だと！？いいぜ、かかって来な！`,
}

export const START_PANEL_SELECT_BEFORE_MESSAGE: Record<number, string> = {
    1: `まずは僕からです…`,
    2: `まずは私からよ。`,
    3: `まずは俺からだ。`,
}

export const PLAYER_TURN_CHANGED: Record<number, string> = {
    1: `『{{word}}』で始まるやつは何でしょう…？`,
    2: `『{{word}}』で始まるやつは？`,
    3: `『{{word}}』で始まるやつは何だ？`,
}

export const CORRECT_PLAYER_EASY: Record<number, string> = {
    1: `『{{word}}』ですか。わかりました…。`,
    2: `ふぅん、『{{word}}』ね。いいわよ。`,
    3: `『{{word}}』か。いいだろう。`,
}

export const CORRECT_PLAYER_HARD: Record<number, string> = {
    1: `『{{word}}』なんて…！そんな難しい言葉、すごいですね…`,
    2: `『{{word}}』・・・！！そんなのあり！？`,
    3: `『{{word}}』だって！？そんなのありかよ！！`,
}

export const CPU_TURN_CHANGED: Record<number, string> = {
    1: `僕の番ですね。`,
    2: `私の番ね！`,
    3: `俺の番だな！`,
}

export const CPU_PANEL_SELECTED_BEFORE: Record<number, string> = {
    1: `それでは…`,
    2: `それじゃあ…`,
    3: `えっと…`,
}

export const CPU_PANEL_SELECTED: Record<number, string> = {
    1: `『{{word}}』です…。`,
    2: `『{{word}}』よ！`,
    3: `『{{word}}』だ！`,
}

export const WRONG_PLAYER: Record<number, string> = {
    1: `あれ？それは間違いですね。すみません。`,
    2: `あーら残念。それは間違いよ。`,
    3: `ははっ！そいつは間違いだな！`,
}

export const WRONG_CPU: Record<number, string> = {
    1: `あ、間違えちゃいました…。`,
    2: `あら、私としたことが、間違えちゃった。`,
    3: `しまった！間違えてしまったぜ！`,
}

export const N_END_PLAYER: Record<number, string> = {
    1: `「{{word}}」...あっ…！「ん」で終わってますね…。`,
    2: `「{{word}}」...あら？「ん」で終わってるわよ！`,
    3: `「{{word}}」...ははは！「ん」で終わってるぞ！`,
}

export const N_END_CPU: Record<number, string> = {
    1: `「{{word}}」...あっ…！「ん」で終わってますね…。`,
    2: `「{{word}}」...あら？「ん」で終わってるわ。`,
    3: `「{{word}}」...やべ！「ん」で終わってる！`,
}

export const ALL_PANEL_SELECTED: Record<number, string> = {
    1: `選べるパネルがなくなりましたね…<br>ということは…`,
    2: `あら？選べるパネルがなくなっちゃったわね…<br>ってことは…`,
    3: `お！選べるパネルがなくなっちゃったな！<br>つまり…`,
}

export const WIN_PLAYER: Record<number, string> = {
    1: `僕の負けですね…。あなたは強いですね…。`,
    2: `私の負けなのね…。悔しいけどしょうがないわ！！`,
    3: `俺の負けなのか…。お前なかなかやるじゃねえか！！`,
}

export const LOSE_PLAYER: Record<number, string> = {
    1: `僕の勝ちですね…。運が良かったです…。`,
    2: `私の勝ちね！出直して来な！`,
    3: `俺の勝ちだな！出直して来るんだな！！`,
}
