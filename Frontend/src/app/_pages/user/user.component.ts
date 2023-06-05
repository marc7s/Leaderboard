import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrackSummary } from '@shared/dataStructures';
import { ApiService } from 'src/app/api.service';
import { Split } from 'src/split';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnInit {

  numberOfRecords: number = 0;
  username: string = '';
  trackSummaries: TrackSummary[] = [];
  splits: Split[] = [Split.Weather, Split.Valid];

  constructor(private route: ActivatedRoute, private api: ApiService) {
    this.route.params.subscribe((params: any) => {
      const paramUsername = decodeURI(params.username);
      this.api.getUserTimesFromUsername(paramUsername).subscribe(trackSummaries => {
        // Grab the username from the first time if it exists
        this.username = trackSummaries.length > 0 ? trackSummaries[0].times[0].username : paramUsername;
        this.trackSummaries = trackSummaries;

        this.api.getNumberOfRecordsFromUsername(paramUsername).subscribe(numberOfRecords => {
          if(numberOfRecords != null)
            this.numberOfRecords = numberOfRecords;
        });
      });
    });
   }

  ngOnInit(): void {
  }

}
