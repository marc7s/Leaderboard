import { Component, OnInit } from '@angular/core';
import { Track } from '@shared/api';
import { LapRecord } from '@shared/dataStructures';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.sass']
})
export class RecordsComponent implements OnInit {

  trackRecords: Map<string, LapRecord[]> = new Map<string, LapRecord[]>();

  constructor(private api: ApiService) {
    this.api.getRecords().subscribe(records => {
      records.map(record => {
        this.trackRecords.set(
          record.config.track.shortName, 
          (this.trackRecords.get(record.config.track.shortName) ?? []).concat(record)
        );
      });
    });
   }

  ngOnInit(): void {
  }

}
