import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-field-text',
  templateUrl: './input-field-text.component.html',
  styleUrls: ['./input-field-text.component.sass']
})
export class InputFieldTextComponent implements OnInit {

  @Input() placeholder: string = '';
  @Input() text: string | null = null;
  @Output() textChange = new EventEmitter<string | null>();

  constructor() { }

  ngOnInit(): void {
  }

  updateText(el: HTMLInputElement){
    this.textChange.emit(el.value == '' ? null : el.value);
  }

}
