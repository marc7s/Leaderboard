import { Component, OnInit } from '@angular/core';
import { Track } from '@shared/api';
import { ApiService } from 'src/app/api.service';
import { OptionNumber } from 'src/app/option';

@Component({
  selector: 'app-edit-tracks',
  templateUrl: './edit-tracks.component.html',
  styleUrls: ['./edit-tracks.component.sass']
})
export class EditTracksComponent implements OnInit {

  trackID: number | null = null;
  trackOptions: OptionNumber[] = [];
  tracks: Track[] = [];

  countryID: number | null = null;
  countryOptions: OptionNumber[] = [];

  shortName: string | null = null;
  fullName: string | null = null;

  constructor(private api: ApiService) { 
    this.setup();
  }

  setup(): void {
    this.api.getTracks().subscribe(tracks => {
      this.tracks = tracks;
      this.trackOptions = tracks.map(t => ({ value: t.id, display: t.shortName }));
    });
    this.api.getCountries().subscribe(countries => {
      this.countryOptions = countries.map(c => ({ value: c.id, display: c.shortName }));
    });
  }

  ngOnInit(): void {
  }

  clear() : void {
    this.countryID = null;
    this.trackID = null;
    this.shortName = null;
    this.fullName = null;
  }

  selectTrack(): void {
    const track = this.tracks.find(t => t.id == this.trackID);
    if(track) { 
      this.countryID = track.country.id;
      this.trackID = track.id;
      this.shortName = track.shortName;
      this.fullName = track.fullName;
    }
  }

  save(): void {
    if(this.countryID && this.shortName && this.fullName) {
      if(this.trackID) {
        this.api.updateTrack(this.trackID, this.countryID, this.shortName, this.fullName).subscribe(() => {
          this.clear();
          this.setup();
        });
      } else {
        this.api.createTrack(this.countryID, this.shortName, this.fullName).subscribe(() => {
          this.clear();
          this.setup();
        });
      }
    }
  }

}
