import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Track } from '@shared/api';
import { TimeSummary } from '@shared/dataStructures';
import { ApiService } from 'src/app/api.service';
import { Color, FerrariRed } from 'src/app/color';
import { timeSummarySorting } from 'src/app/sorting-functions';
import { getUsernameFromDriver } from 'src/app/user';
import { Split } from 'src/split';
import { Size } from 'src/styleSettings';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.sass']
})
export class TrackComponent implements OnInit {

  Large: Size = Size.Large;

  track: Track | null = null;
  times: TimeSummary[] = [];
  splits: Split[] = [Split.Weather, Split.Valid, Split.Game];

  constructor(private route: ActivatedRoute, private api: ApiService) {
    this.route.params.subscribe((params: any) => {
      this.api.getTrackSummary(decodeURI(params.shortName)).subscribe(summary => {
        this.track = summary.track;
        this.times = summary.times;
        this.api.getAuthenticTrackRecord(this.track.id).subscribe(trackRecord => {
          if(trackRecord == null)
            return;
          const authenticRecord: TimeSummary = trackRecord.timeSummary;
          authenticRecord.username = getUsernameFromDriver(trackRecord.driver);

          this.times.push(authenticRecord);
          this.times.sort(timeSummarySorting);
        });
      });
    });
  }

  ngOnInit(): void {
  }

}
