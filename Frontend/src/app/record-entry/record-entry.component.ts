import { Component, Input, OnInit } from '@angular/core';
import { Time, Config } from '@shared/api';

@Component({
  selector: 'app-record-entry',
  templateUrl: './record-entry.component.html',
  styleUrls: ['./record-entry.component.sass']
})
export class RecordEntryComponent implements OnInit {
  @Input() config: Config | null = null;
  @Input() time: Time | null = null;
  
  constructor() { }

  ngOnInit(): void {
  }

}
