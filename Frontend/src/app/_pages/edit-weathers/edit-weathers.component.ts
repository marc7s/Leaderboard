import { Component, OnInit } from '@angular/core';
import { Weather } from '@shared/api';
import { ApiService } from 'src/app/api.service';
import { OptionNumber } from 'src/app/option';

@Component({
  selector: 'app-edit-weathers',
  templateUrl: './edit-weathers.component.html',
  styleUrls: ['./edit-weathers.component.sass']
})
export class EditWeathersComponent implements OnInit {

  weatherID: number | null = null;
  weatherOptions: OptionNumber[] = [];
  weathers: Weather[] = [];

  name: string | null = null;

  constructor(private api: ApiService) { 
    this.setup();
  }

  setup(): void {
    this.api.getWeathers().subscribe(weathers => {
      this.weathers = weathers;
      this.weatherOptions = weathers.map(w => ({ value: w.id, display: w.name }));
    });
  }

  ngOnInit(): void {
  }

  clear() : void {
    this.weatherID = null;
    this.name = null;
  }

  selectWeather(): void {
    const weather = this.weathers.find(w => w.id == this.weatherID);
    if(weather) { 
      this.weatherID = weather.id;
      this.name = weather.name;
    }
  }

  save(): void {
    if(this.name) {
      if(this.weatherID) {
        this.api.updateWeather(this.weatherID, this.name).subscribe(() => {
          this.clear();
          this.setup();
        });
      } else {
        this.api.createWeather(this.name).subscribe(() => {
          this.clear();
          this.setup();
        });
      }
    }
  }

}
