import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Option } from 'src/app/option';

@Component({
  selector: 'app-input-field-select',
  templateUrl: './input-field-select.component.html',
  styleUrls: ['./input-field-select.component.sass']
})
export class InputFieldSelectComponent implements OnInit {

  @Input() options: Option[] = [];
  @Output() optionChange = new EventEmitter<Option | null>();
  @Input() placeholder: string = "";

  @Input() value: number | null = null;
  @Output() valueChange = new EventEmitter<number | null>();

  constructor() { }

  ngOnInit(): void {
  }

  updateValue(el: MatSelect) {
    const parsed = parseFloat(el.value);
    const val = parsed == NaN ? null : parsed;
    const option = val == null ? null : {
      value: val,
      display: (el.selected as MatOption).viewValue
    };
    this.valueChange.emit(val);
    this.optionChange.emit(option);
  }

}
