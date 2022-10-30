import { Component, OnInit } from '@angular/core';
import { Track } from '@shared/api';
import { LapRecord } from '@shared/dataStructures';
import { ApiService } from 'src/app/api.service';
import { lapRecordSorting } from 'src/app/sorting-functions';
import { getUserNameFromDriver } from 'src/app/user';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.sass']
})
export class RecordsComponent implements OnInit {

  trackRecords: Map<string, LapRecord[]> = new Map<string, LapRecord[]>();
  tracks: Track[] = [];

  constructor(private api: ApiService) {
    this.api.getRecords().subscribe(records => {
      records.map(record => {
        if(this.tracks.find(track => track.id === record.config.track.id) === undefined)
          this.tracks.push(record.config.track);
        
        this.trackRecords.set(
          record.config.track.shortName, 
          (this.trackRecords.get(record.config.track.shortName) ?? []).concat(record)
        );
      });

      this.tracks.forEach((track: Track) => {
        this.api.getAuthenticTrackRecord(track.id).subscribe(trackRecord => {
          if(trackRecord == null)
            return;
          const authenticRecord: LapRecord = {
            config: trackRecord.config,
            timeSummary: trackRecord.timeSummary,
            authentic: {
              driver: trackRecord.driver,
              class: trackRecord.class
            }
          };

          authenticRecord.timeSummary.username = getUserNameFromDriver(trackRecord.driver);

          // Add the authentic record to the list of records and sort the times
          this.trackRecords.set(
            track.shortName, 
            (this.trackRecords.get(track.shortName) ?? []).concat(authenticRecord).sort(lapRecordSorting)
          );
        });
      });
    });
   }

  ngOnInit(): void {
  }
}
