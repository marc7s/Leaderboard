import { Component, EventEmitter, Input, OnInit, Optional, Output, SimpleChanges } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { OptionNumber, OptionString } from 'src/app/option';
import { Size } from 'src/styleSettings';

@Component({
  selector: 'app-input-field-select',
  templateUrl: './input-field-select.component.html',
  styleUrls: ['./input-field-select.component.sass']
})
export class InputFieldSelectComponent implements OnInit {

  @Input() fontSize: string = 'inherit';
  @Input() width: Size = Size.Medium;

  @Input() optionsNumber: OptionNumber[] = [];
  @Input() optionsString: OptionString[] = [];
  
  @Output() optionNumberChange = new EventEmitter<OptionNumber | null>();
  @Output() optionStringChange = new EventEmitter<OptionString | null>();
  
  @Input() placeholder: string = "";

  @Input() valueNumber: number | null = null;
  @Output() valueNumberChange = new EventEmitter<number | null>();

  @Input() valueString: string | null = null;
  @Output() valueStringChange = new EventEmitter<string | null>();

  constructor() { }

  ngOnInit(): void {
  }

  updateValueNumber(el: MatSelect) {
    const parsed = parseFloat(el.value);
    const val = parsed == NaN ? null : parsed;
    const option = val == null ? null : {
      value: val,
      display: (el.selected as MatOption).viewValue
    };
    this.valueNumberChange.emit(val);
    this.optionNumberChange.emit(option);
  }

  updateValueString(el: MatSelect) {
    const val = el.value;
    const option = {
      value: val,
      display: (el.selected as MatOption).viewValue
    };
    this.valueStringChange.emit(val);
    this.optionStringChange.emit(option);
  }

}
