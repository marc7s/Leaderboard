import { Component, Input, OnInit } from '@angular/core';
import { TimeSummary } from '@shared/dataStructures';

@Component({
  selector: 'app-leaderboard-entry',
  templateUrl: './leaderboard-entry.component.html',
  styleUrls: ['./leaderboard-entry.component.sass']
})
export class LeaderboardEntryComponent implements OnInit {
  @Input() time: TimeSummary | null = null;
  @Input() position: number | null = null;
  
  constructor() { }

  ngOnInit(): void {
  }

}
