export function getCpuMessageWhenPlayerSelect(
    selectedWord: string, // プレイヤーが選んだ単語
    resultCode: number, // checkPanelWordsの結果: 1=OK,2=不正,3=ん終わり
): string {
    switch (resultCode) {
        case 1:
            // 正解
            return `むむ、「${selectedWord}」か、、なかなかやるな・・！`
        case 2:
            // 不正解
            return '残念！次は俺の番だな'
        case 3:
            // "ん"終わり
            return `「${selectedWord}」を選んだな！もうお前の負けだ！`
        default:
            return ''
    }
}
