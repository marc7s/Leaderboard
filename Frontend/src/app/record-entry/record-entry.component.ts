import { Component, Input, OnInit } from '@angular/core';
import { Config } from '@shared/api';
import { TimeSummary } from '@shared/dataStructures';

@Component({
  selector: 'app-record-entry',
  templateUrl: './record-entry.component.html',
  styleUrls: ['./record-entry.component.sass', '../shared-styles/record.sass']
})
export class RecordEntryComponent implements OnInit {
  @Input() config: Config | null = null;
  @Input() timeSummary: TimeSummary | null = null;
  @Input() authentic: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}
