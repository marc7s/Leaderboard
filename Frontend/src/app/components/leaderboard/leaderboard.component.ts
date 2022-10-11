import { Component, Input, OnInit } from '@angular/core';
import { TimeSummary } from '@shared/dataStructures';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.sass']
})
export class LeaderboardComponent implements OnInit {

  @Input() times: TimeSummary[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
