import { Component, OnInit } from '@angular/core';
import { Track } from '@shared/api';
import { ApiService } from 'src/app/api.service';

interface TrackAndLink {
  name: string;
  link: string;
};

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.sass']
})
export class TracksComponent implements OnInit {

  tracks: TrackAndLink[] = [];

  constructor(private api: ApiService) { 
    this.api.getTracks().subscribe(tracks => {
      this.tracks = tracks.map(track => {return { name: track.shortName, link: encodeURI(track.shortName) }});
    });
  }

  ngOnInit(): void {
  }

}
