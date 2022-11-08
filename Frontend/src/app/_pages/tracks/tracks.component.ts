import { Component, OnInit } from '@angular/core';
import { Track } from '@shared/api';
import { ApiService } from 'src/app/api.service';

interface TrackAndLink {
  name: string;
  alpha2Code: string;
  link: string;
};

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.sass']
})
export class TracksComponent implements OnInit {

  private tracks: TrackAndLink[] = [];

  constructor(private api: ApiService) { 
    this.api.getTracks().subscribe(tracks => {
      this.tracks = tracks.map(track => {return { name: track.shortName, alpha2Code: track.alpha2Code.toLowerCase(), link: encodeURI(track.shortName) }});
    });
  }

  getTracks(): TrackAndLink[] {
    return this.tracks.sort((a, b) => a.name.localeCompare(b.name));
  }

  ngOnInit(): void {
  }

}
