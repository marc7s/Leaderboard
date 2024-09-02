import { Component, Input, OnInit } from '@angular/core';
import { Color } from 'src/app/color';
import { Size } from 'src/styleSettings';

@Component({
  selector: 'app-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.sass']
})
export class HighlightComponent implements OnInit {

  @Input() size?: Size;
  @Input() color?: Color;

  constructor() {}

  ngOnInit(): void {
    this.size = this.size ?? Size.Small;
  }

  getColor(): string | undefined{
    return this.color?.getCssColor();
  }

  getTextColor(): string | undefined{
    if(this.color){
      let lightness: number = 1/2 * (
        Math.max(this.color.r, this.color.g, this.color.b) + 
        Math.min(this.color.r, this.color.g, this.color.b)
      );
      if(lightness < 0.5)
        return 'white';
    }
    return 'black';
  }
}
