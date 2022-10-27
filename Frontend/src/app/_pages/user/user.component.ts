import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimeSummary } from '@shared/dataStructures';
import { ApiService } from 'src/app/api.service';
import { Split } from 'src/split';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnInit {

  username: string = '';
  times: TimeSummary[] = [];
  splits: Split[] = [Split.Weather, Split.Valid];

  constructor(private route: ActivatedRoute, private api: ApiService) {
    this.route.params.subscribe(params => {
      this.api.getUserTimesFromUsername(decodeURI(params.username)).subscribe(times => {
        // Grab the username from the first time if it exists
        this.username = times.length > 0 ? times[0].username : params.username;
        this.times = times;
      });
    });
   }

  ngOnInit(): void {
  }

}
