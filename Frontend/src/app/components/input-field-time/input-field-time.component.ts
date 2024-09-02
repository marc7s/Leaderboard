import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-input-field-time',
  templateUrl: './input-field-time.component.html',
  styleUrls: ['./input-field-time.component.sass']
})
export class InputFieldTimeComponent implements OnInit {

  @Input() placeholder: string = '';
  @Input() time: string | null = null;
  @Output() timeChange = new EventEmitter<string | null>();
  localTime: string | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  // Handle changes to the time input, reflect the value of the time variable
  ngOnChanges(changes: SimpleChanges) {
    this.localTime = this.time;
  }

  // Handle user input, emit it to the bound variable
  updateTime(el: HTMLInputElement){
    this.timeChange.emit(el.value == '' ? null : el.value);
  }

}
