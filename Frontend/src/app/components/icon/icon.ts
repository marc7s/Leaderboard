import { Size } from "src/styleSettings";

export enum IconType{
    Image,
    SVG
}
export enum IconShape{
    Square = 'square',
    Rounded = 'rounded',
    Circle = 'circle'
}
export enum IconSize{
    Original = 'original',
    Icon = 'icon'
}

interface IconBasics{
    type: IconType,
    shape?: IconShape,
    size: IconSize | Size,
    alt: string
}
export interface IconWithAbsPath extends IconBasics{
    absPath: string
}
export interface IconWithRelPath extends IconBasics{
    relPath: string
}

export type Icon = IconWithAbsPath | IconWithRelPath;