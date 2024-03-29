import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Config } from '@shared/api';
import { ApiService } from 'src/app/api.service';
import { Option } from 'src/app/option';
import { Size } from 'src/styleSettings';

@Component({
  selector: 'app-edit-configs',
  templateUrl: './edit-configs.component.html',
  styleUrls: ['./edit-configs.component.sass']
})
export class EditConfigsComponent implements OnInit {

  Large: Size = Size.Large;

  configID: number | null = null;
  configOptions: Option[] = [];
  configs: Config[] = [];

  description: string | null = null;

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

  @Input() customSetup: boolean = false;
  @Output() customSetupChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private api: ApiService) {
    this.setup();
  }

  ngOnInit(): void {
  }

  setup(): void {
    this.api.getUserConfigs().subscribe(configs => {
      this.configs = configs;
      this.configOptions = configs.map(c => ({ value: c.id, display: c.description }));
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
      this.setups = setups.map(s => ({ value: s.id, display: s.description }));
    });
  }

  update(): void {
    this.configID = this.findConfig()?.id ?? null;
  }

  save(): void {
    if(this.description && this.gameID && this.trackID && this.carID && this.weatherID && this.tyreID) {
      if(this.configID) {
        this.api.updateConfig(this.configID, this.description, this.gameID, this.trackID, this.carID, this.weatherID, this.tyreID, this.customSetup).subscribe(() => {
          this.clear();
          this.setup();
        });
      } else {
        this.api.createConfig(this.description, this.gameID, this.trackID, this.carID, this.weatherID, this.tyreID, this.customSetup).subscribe(() => {
          this.clear();
          this.setup();
        });
      }
    }
  }

  selectConfig(): void {
    const config = this.configs.find(c => c.id == this.configID);
    if(config) { 
      this.description = config.description;
      this.gameID = config.game.id;
      this.trackID = config.track.id;
      this.carID = config.car.id;
      this.weatherID = config.weather.id;
      this.tyreID = config.tyre.id;
      this.setupID = config.setup.id;
      this.customSetup = config.setup.custom;
    }
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

  clear(): void {
    this.configID = null;
    this.description = null;
    this.gameID = null;
    this.trackID = null;
    this.carID = null;
    this.weatherID = null;
    this.tyreID = null;
    this.setupID = null;
    this.customSetup = false;
  }
}
