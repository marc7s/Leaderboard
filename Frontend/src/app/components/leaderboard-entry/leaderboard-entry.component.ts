import { Component, Input, OnInit } from '@angular/core';
import { LapRecordType, TimeSummary } from '@shared/dataStructures';

@Component({
  selector: 'app-leaderboard-entry',
  templateUrl: './leaderboard-entry.component.html',
  styleUrls: ['./leaderboard-entry.component.sass']
})
export class LeaderboardEntryComponent implements OnInit {
  @Input() time: TimeSummary | null = null;
  @Input() timeComparison: TimeSummary | null = null;
  @Input() position: number | null = null;

  recordClass: string = '';
  
  constructor() { }

  ngOnInit(): void {
    this.recordClass = 
      this.time?.record === LapRecordType.Record ? 'record' 
      : this.time?.record === LapRecordType.RecordAndBeatAuthentic ? 'recordAndBeatAuthentic' 
      : '';
  }

}
