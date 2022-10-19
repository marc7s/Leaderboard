import { Component, OnInit } from '@angular/core';
import { Track } from '@shared/api';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.sass']
})
export class TracksComponent implements OnInit {

  tracks: Track[] = [];

  constructor(private api: ApiService) { 
    this.api.getTracks().subscribe(tracks => {
      this.tracks = tracks;
    });
  }

  ngOnInit(): void {
  }

}
