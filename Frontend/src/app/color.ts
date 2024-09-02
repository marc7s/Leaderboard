export class Color{
    private _r: number;
    private _g: number;
    private _b: number;

    constructor(r: number, g: number, b: number) {
        this._r = r;
        this._g = g;
        this._b = b;
    }

    getCssColor(): string{
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    getHex(): string{
        return `#${componentToHex(this.r)}${componentToHex(this.g)}${componentToHex(this.b)}`;
    }

    get r(): number{ return this._r }
    get g(): number{ return this._g }
    get b(): number{ return this._b }

    set r(r: number){
        valid(r);
        this._r = r;
    }

    set g(g: number){
        valid(g);
        this._g = g;
    }

    set b(b: number){
        valid(b);
        this._b = b;
    }

    setHex(hex: string): void {
        let bigint = parseInt(hex.replace('#', ''), 16);

        this.r = (bigint >> 16) & 255;
        this.g = (bigint >> 8) & 255;
        this.b = bigint & 255;
    }
}

function valid(value: number): boolean{
    if(value < 0 || value > 255)
        throw new Error(`Unallowed color parameter: ${value} outside of allowed RGB range`);
    return true;
}

function componentToHex(c: number): string{
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export const FerrariRed: Color = new Color(255, 40, 0);
export const McLarenPapaya: Color = new Color(255, 158, 27);

export const Red: Color = new Color(200, 50, 50);
export const LightGreen: Color = new Color(20, 160, 20);