import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Option } from 'src/app/option';
import { Size } from 'src/styleSettings';

@Component({
  selector: 'app-input-field-select',
  templateUrl: './input-field-select.component.html',
  styleUrls: ['./input-field-select.component.sass']
})
export class InputFieldSelectComponent implements OnInit {

  @Input() fontSize: string = 'inherit';
  @Input() width: Size = Size.Medium;

  @Input() options: Option[] = [];
  
  @Output() optionChange = new EventEmitter<Option | null>();
  
  @Input() placeholder: string = "";

  @Input() value: number | null = null;
  @Output() valueChange = new EventEmitter<number | null>();

  @Input() keepOptionOrder?: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  getOptions(): Option[] {
    return this.keepOptionOrder ? this.options : [...this.options].sort((a: Option, b: Option) => a.display > b.display ? 1 : -1);
  }

  updateValue(el: MatSelect) {
    const parsed = parseFloat(el.value);
    const val = Number.isNaN(parsed) ? null : parsed;
    const option = val == null ? null : {
      value: val,
      display: (el.selected as MatOption).viewValue
    };
    this.valueChange.emit(val);
    this.optionChange.emit(option);
  }
}
