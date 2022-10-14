import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Config } from '@shared/api';
import { TimeSummary } from '@shared/dataStructures';
import { ApiService } from 'src/app/api.service';
import { OptionNumber, OptionString } from 'src/app/option';

@Component({
  selector: 'app-add-time',
  templateUrl: './add-time.component.html',
  styleUrls: ['./add-time.component.sass']
})
export class AddTimeComponent implements OnInit {
  configID: number | null = null;
  configOptions: OptionNumber[] = [];
  configs: Config[] = [];
  
  username: string | null = null;
  users: OptionString[] = [];

  gameID: number | null = null;
  games: OptionNumber[] = [];
  
  trackID: number | null = null;
  tracks: OptionNumber[] = [];
  
  carID: number | null = null;
  cars: OptionNumber[] = [];

  weatherID: number | null = null;
  weathers: OptionNumber[] = [];

  tyreID: number | null = null;
  tyres: OptionNumber[] = [];

  time: string | null = null;

  @Input() customSetup: boolean = false;
  @Output() customSetupChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  @Input() invalid: boolean = false;
  @Output() invalidChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  placeholderTimes: TimeSummary[] = [];

  update() {
    const parsedTime = this.time ? this.time.substring(3) : null;
    if(parsedTime?.length == 9 && this.username && this.gameID && this.trackID && this.carID && this.weatherID && this.tyreID) {
      this.placeholderTimes = [
        {
          id: -1,
          time: `1970-01-01T00:${parsedTime}Z` ?? '',
          millis: 0,
          username: this.username ?? '',
          weather: '',
          valid: !this.invalid
        }
      ];
    } else {
      this.placeholderTimes = [];
    }
  }

  addTime(): void {
    
    // Reset invalid for next time
    this.invalid = false;
  }

  selectConfig(): void {
    const config = this.configs.find(c => c.id == this.configID);
    if(config) { 
      this.gameID = config.game.id;
      this.trackID = config.track.id;
      this.carID = config.car.id;
      this.weatherID = config.weather.id;
      this.tyreID = config.tyre.id;
      this.update();
    }
  }

  clearConfig(): void {
    this.configID = null;
    this.gameID = null;
    this.trackID = null;
    this.carID = null;
    this.weatherID = null;
    this.tyreID = null;
    this.update();
  }

  constructor(private api: ApiService) {
    this.api.getConfigs().subscribe(configs => {
      this.configs = configs;
      this.configOptions = configs.map(c => ({ value: c.id, display: c.description }));
    });
    this.api.getUsers().subscribe(users => {
      this.users = users.map(u => ({ value: u.username, display: u.username }));
    });
    this.api.getGames().subscribe(games => {
      this.games = games.map(g => ({ value: g.id, display: g.name }));
    });
    this.api.getTracks().subscribe(tracks => {
      this.tracks = tracks.map(t => ({ value: t.id, display: t.shortName }));
    });
    this.api.getCars().subscribe(cars => {
      this.cars = cars.map(c => ({ value: c.id, display: c.shortName }));
    });
    this.api.getWeathers().subscribe(weathers => {
      this.weathers = weathers.map(w => ({ value: w.id, display: w.name }));
    });
    this.api.getTyres().subscribe(tyres => {
      this.tyres = tyres.map(t => ({ value: t.id, display: t.shortName }));
    });
   }

  ngOnInit(): void {
  }

}
