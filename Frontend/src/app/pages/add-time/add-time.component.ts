import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Option } from 'src/app/option';

@Component({
  selector: 'app-add-time',
  templateUrl: './add-time.component.html',
  styleUrls: ['./add-time.component.sass']
})
export class AddTimeComponent implements OnInit {
  trackID: number | null = null;
  tracks: Option[] = [];
  
  updateTrack(opt: Option | null) {
    this.trackID = opt ? opt.value : null;
  }

  constructor(private api: ApiService) {
    this.api.getTracks().subscribe(tracks => {
      this.tracks = tracks.map(t => ({ value: t.id, display: t.shortName }));
    });
   }

  ngOnInit(): void {
  }

}
