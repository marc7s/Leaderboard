import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Track } from '@shared/api';
import { TimeSummary } from '@shared/dataStructures';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnInit {

  username: string = '';
  times: TimeSummary[] = [];

  constructor(private route: ActivatedRoute, private api: ApiService) {
    this.route.params.subscribe(params => {
      console.log(params);
      this.api.getUserTimes(params.username).subscribe(times => {
        console.log(times);
        this.username = params.username;
        this.times = times;
      });
    });
   }

  ngOnInit(): void {
  }

}
