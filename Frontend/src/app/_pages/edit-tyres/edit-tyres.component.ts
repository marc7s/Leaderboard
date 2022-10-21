import { Component, OnInit } from '@angular/core';
import { Tyre } from '@shared/api';
import { ApiService } from 'src/app/api.service';
import { OptionNumber } from 'src/app/option';

@Component({
  selector: 'app-edit-tyres',
  templateUrl: './edit-tyres.component.html',
  styleUrls: ['./edit-tyres.component.sass']
})
export class EditTyresComponent implements OnInit {

  tyreID: number | null = null;
  tyreOptions: OptionNumber[] = [];
  tyres: Tyre[] = [];

  shortName: string | null = null;
  fullName: string | null = null;

  constructor(private api: ApiService) { 
    this.setup();
  }

  setup(): void {
    this.api.getTyres().subscribe(tyres => {
      this.tyres = tyres;
      this.tyreOptions = tyres.map(c => ({ value: c.id, display: c.shortName }));
    });
  }

  ngOnInit(): void {
  }

  clear() : void {
    this.tyreID = null;
    this.shortName = null;
    this.fullName = null;
  }

  selectTyre(): void {
    const tyre = this.tyres.find(c => c.id == this.tyreID);
    if(tyre) { 
      this.tyreID = tyre.id;
      this.shortName = tyre.shortName;
      this.fullName = tyre.fullName;
    }
  }

  save(): void {
    if(this.shortName && this.fullName) {
      if(this.tyreID) {
        this.api.updateTyre(this.tyreID, this.shortName, this.fullName).subscribe(() => {
          this.clear();
          this.setup();
        });
      } else {
        this.api.createTyre(this.shortName, this.fullName).subscribe(() => {
          this.clear();
          this.setup();
        });
      }
    }
  }

}
