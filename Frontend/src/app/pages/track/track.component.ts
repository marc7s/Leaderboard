import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Track } from '@shared/api';
import { TimeSummary } from '@shared/dataStructures';
import { ApiService } from 'src/app/api.service';
import { Color, FerrariRed } from 'src/app/color';
import { Size } from 'src/styleSettings';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.sass']
})
export class TrackComponent implements OnInit {

  Large: Size = Size.Large;
  FerrariRed: Color = FerrariRed;

  track: Track | null = null;
  times: TimeSummary[] = [];

  constructor(private route: ActivatedRoute, private api: ApiService) {
    this.route.params.subscribe(params => {
      console.log(params);
      this.api.getTrackSummary(params.shortName).subscribe(summary => {
        console.log(summary);
        this.track = summary.track;
        this.times = summary.times;
      });
    });
   }

  ngOnInit(): void {
  }

}
