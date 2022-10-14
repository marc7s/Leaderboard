import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-field-time',
  templateUrl: './input-field-time.component.html',
  styleUrls: ['./input-field-time.component.sass']
})
export class InputFieldTimeComponent implements OnInit {

  @Input() placeholder: string = '';
  @Input() time: string | null = null;
  @Output() timeChange = new EventEmitter<string | null>();

  constructor() { }

  ngOnInit(): void {
  }

  updateTime(el: HTMLInputElement){
    this.timeChange.emit(el.value == '' ? null : el.value);
  }

}
