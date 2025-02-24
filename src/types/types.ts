export interface Panel {
    id: number
    words: string[] // ["りんご", "アップル"] のように複数呼び名
    isUsed?: boolean // そのパネルが既に選択済みかどうか
}
