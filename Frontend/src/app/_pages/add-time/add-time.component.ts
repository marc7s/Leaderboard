import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { Config } from '@shared/api';
import { LapRecordType, TimeSummary } from '@shared/dataStructures';
import { ApiService } from 'src/app/api.service';
import { Option } from 'src/app/option';
import { Size } from 'src/styleSettings';

@Component({
  selector: 'app-add-time',
  templateUrl: './add-time.component.html',
  styleUrls: ['./add-time.component.sass']
})
export class AddTimeComponent implements OnInit {
  Large: Size = Size.Large;
  
  configID: number | null = null;
  configOptions: Option[] = [];
  configs: Config[] = [];
  
  userID: number | null = null;
  username: string | null = null;
  users: Option[] = [];

  gameID: number | null = null;
  games: Option[] = [];
  
  trackID: number | null = null;
  tracks: Option[] = [];
  
  carID: number | null = null;
  cars: Option[] = [];

  weatherID: number | null = null;
  weathers: Option[] = [];

  tyreID: number | null = null;
  tyres: Option[] = [];

  setupID: number | null = null;
  setups: Option[] = [];

  time: string | null = null;

  @ViewChild('timeInput') timeInput!: ElementRef<Input>;
  
  @Input() invalid: boolean = false;
  @Output() invalidChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  placeholderTimes: TimeSummary[] = [];
  lastAddedTime: TimeSummary[] = [];

  update() {
    const parsedTime = this.time ? this.time.substring(3) : null;
    this.configID = this.findConfig()?.id ?? null;

    if(parsedTime?.length == 9 && this.userID && this.gameID && this.trackID && this.carID && this.weatherID && this.tyreID && this.setupID) {
      this.placeholderTimes = [
        {
          id: -1,
          time: `1970-01-01T00:${parsedTime}Z` ?? '',
          millis: 0,
          username: this.username ?? '',
          game: this.games.find(g => g.value == this.gameID)!.display ?? '',
          car: this.cars.find(c => c.value == this.carID)!.display ?? '',
          weather: '',
          valid: !this.invalid,
          setupDescription: '',
          customSetup: this.setups.find(s => s.value == this.setupID)!.data ?? false,
          authentic: false,
          record: LapRecordType.NoRecord
        }
      ];
    } else {
      this.placeholderTimes = [];
    }
  }

  updateUser(): void {
    const username = this.userID ? this.users.find(u => u.value == this.userID)?.display : null;
    this.username = username ?? null;
    this.update();
  }

  async addTime(): Promise<void> {
    if(this.configID !== null && this.userID !== null && this.username !== null && this.time !== null) {
      await this.api.addTimeWithConfig(this.configID, this.userID, this.time, !this.invalid).toPromise();
      this.lastAddedTime = this.placeholderTimes;
    } else if(this.userID !== null && this.gameID !== null && this.trackID !== null && this.carID !== null && this.weatherID !== null && this.tyreID !== null && this.setupID !== null && this.time !== null) {
      await this.api.addTime(this.userID, this.gameID, this.trackID, this.carID, this.weatherID, this.tyreID, this.setupID, this.time, !this.invalid).toPromise();
      this.lastAddedTime = this.placeholderTimes;
    } else {
      console.error("Could not add time, incorrect parameters");
      return;
    }
    // Reset for next time
    this.userID = null;
    this.time = null;
    this.invalid = false;
    
    // Update the form
    this.update();
  }

  findConfig(): Config | undefined {
    return this.configs.find(c => 
      c.game.id == this.gameID && 
      c.track.id == this.trackID && 
      c.car.id == this.carID && 
      c.weather.id == this.weatherID && 
      c.tyre.id == this.tyreID &&
      c.setup.id == this.setupID
    );
  }

  selectConfig(): void {
    const config = this.configs.find(c => c.id == this.configID);
    if(config) { 
      this.gameID = config.game.id;
      this.trackID = config.track.id;
      this.carID = config.car.id;
      this.weatherID = config.weather.id;
      this.tyreID = config.tyre.id;
      this.setupID = config.setup.id;
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
    this.setupID = null;
    this.update();
  }

  constructor(private api: ApiService) {
    this.api.getUserConfigs().subscribe(configs => {
      this.configs = configs;
      this.configOptions = configs.map(c => ({ value: c.id, display: c.description }));
    });
    this.api.getUsers().subscribe(users => {
      this.users = users.map(u => ({ value: u.id, display: u.username }));
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
    this.api.getSetups().subscribe(setups => {
      this.setups = setups.map(s => ({ value: s.id, display: s.description, data: s.custom }));
    });
   }

  ngOnInit(): void {
  }

}
