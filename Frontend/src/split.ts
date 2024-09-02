export enum Split {
    Weather,
    Valid,
    Game
}

export interface SplitSetting {
    split: Split,
    selected: boolean
}