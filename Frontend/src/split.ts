export enum Split {
    Driver,
    Weather,
    Valid
}

export interface SplitSetting {
    split: Split,
    selected: boolean
}