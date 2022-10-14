import { Component, Input, OnInit } from '@angular/core';
import { Color } from 'src/app/color';
import { Size } from 'src/styleSettings';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass']
})
export class CardComponent implements OnInit {

  @Input() size?: Size;
  @Input() color?: Color;

  @Input() iconBefore?: Icon;
  @Input() selected?: boolean;
  @Input() disabled?: boolean;
  @Input() href?: string;
  @Input() iconAfter?: Icon;

  constructor() { 
  }

  ngOnInit(): void {
    if(!this.size)
      this.size = Size.Large;
  }

  getColor(): string | undefined{
    return this.color?.getCssColor();
  }

}
