import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Leaderboard, Pair, TimeSummary } from '@shared/dataStructures';
import { Split, SplitSetting } from 'src/split';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.sass']
})
export class LeaderboardComponent implements OnInit {
  ValidSplit: Split = Split.Valid;
  WeatherSplit: Split = Split.Weather;
  GameSplit: Split = Split.Game;
  
  ValidSplitSetting: SplitSetting = { split: this.ValidSplit, selected: false };
  WeatherSplitSetting: SplitSetting = { split: this.WeatherSplit, selected: false };
  GameSplitSetting: SplitSetting = { split: this.GameSplit, selected: false };

  @Input() times: TimeSummary[] = [];
  @Input() splits: Split[] = [];
  @Input() title: string = 'Leaderboard';
  @Input() flag?: string | undefined = undefined;
  splitSettings: SplitSetting[] = [];
  leaderboards: Leaderboard[] = [];
  
  constructor() { }

  ngOnInit(): void {
    const settings: SplitSetting[] = [
      this.ValidSplitSetting,
      this.GameSplitSetting,
      this.WeatherSplitSetting
    ];
    settings.forEach(s => {
      if(this.splits.includes(s.split))
        this.splitSettings.push(s);
    });
    this.addDefaultLeaderboardIfEmpty();
  }

  timeSummaryCompare(a: TimeSummary, b: TimeSummary): number {
    return a.millis - b.millis;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.addDefaultLeaderboardIfEmpty();
  }

  sort(): void {
    this.leaderboards.forEach(leaderboard => {
      leaderboard.times.sort(this.timeSummaryCompare);
    });
  }

  splitBy(split: Split): void {
    this.splitSettings.filter(s => s.split === split).forEach(s => s.selected = !s.selected);
    
    this.filterConditions(split);
    this.addDefaultLeaderboardIfEmpty();

    this.splitByWeather();
    this.leaderboards = this.removeDuplicates(this.leaderboards);

    this.splitByGame();
    this.leaderboards = this.removeDuplicates(this.leaderboards);

    this.splitByValid();
    this.leaderboards = this.removeDuplicates(this.leaderboards);
    
    this.addDefaultLeaderboardIfEmpty();
    this.sort();
  }

  removeDuplicates(leaderboards: Leaderboard[]): Leaderboard[] { 
    return [...new Set(leaderboards)];
  }

  filterConditions(split: Split): void {
    if(!this.selected(this.WeatherSplit) && split === this.WeatherSplit)
      this.leaderboards = this.leaderboards.filter(l => l.weatherCondition == undefined);

    if(!this.selected(this.GameSplit) && split === this.GameSplit)
      this.leaderboards = this.leaderboards.filter(l => l.gameCondition == undefined);

    if(!this.selected(this.ValidSplit) && split === this.ValidSplit)
      this.leaderboards = this.leaderboards.filter(l => l.validCondition == undefined);
  }

  splitByWeather(): void {
    if(!this.selected(this.WeatherSplit))
      return;
    
    let add: Leaderboard[] = [];
    const remove: Leaderboard[] = [];
    
    this.leaderboards.forEach(leaderboard => {
      if(leaderboard.weatherCondition !== undefined)
        return;
      let weathers: string[] = [];
    
      leaderboard.times.forEach(t => {
        if(!weathers.includes(t.weather))
          weathers.push(t.weather);
      });
      
      weathers.forEach(w => {
        add.push({
          name: this.getLeaderboardTitle(w, leaderboard.validCondition, leaderboard.gameCondition),
          times: this.times.filter(t => this.checkFilter({f: t.weather, s: w}, {f: t.game, s: leaderboard.gameCondition}, {f: t.valid, s: leaderboard.validCondition})),
          weatherCondition: w,
          validCondition: leaderboard.validCondition,
          gameCondition: leaderboard.gameCondition
        });
      });
      remove.push(leaderboard);
    });
    add = this.removeDuplicates(add);
    this.leaderboards = this.removeLeaderboards(remove);
    this.leaderboards = this.leaderboards.concat(add);
  }
  
  splitByValid(): void {
    if(!this.selected(this.ValidSplit))
      return;
    
    let add: Leaderboard[] = [];
    const remove: Leaderboard[] = [];
    
    this.leaderboards.forEach(leaderboard => {
      if(leaderboard.validCondition !== undefined)
        return;
      let valids: boolean[] = [];
      
      leaderboard.times.forEach(t => {
        if(!valids.includes(t.valid))
          valids.push(t.valid);
      });

      valids.forEach(v => {
        add.push({
          name: this.getLeaderboardTitle(leaderboard.weatherCondition, v, leaderboard.gameCondition),
          times: this.times.filter(t => this.checkFilter({f: t.valid, s: v}, {f: t.game, s: leaderboard.gameCondition}, {f: t.weather, s: leaderboard.weatherCondition})),
          weatherCondition: leaderboard.weatherCondition,
          validCondition: v,
          gameCondition: leaderboard.gameCondition
        });
      });
      remove.push(leaderboard);
    });
    add = this.removeDuplicates(add);
    
    this.leaderboards = this.removeLeaderboards(remove);
    this.leaderboards = this.leaderboards.concat(add);
  }

  splitByGame(): void {
    if(!this.selected(this.GameSplit))
      return;
    
    let add: Leaderboard[] = [];
    const remove: Leaderboard[] = [];
    
    this.leaderboards.forEach(leaderboard => {
      if(leaderboard.gameCondition !== undefined)
        return;
      let games: string[] = [];
      
      leaderboard.times.forEach(t => {
        if(!games.includes(t.game))
          games.push(t.game);
      });

      games.forEach(v => {
        add.push({
          name: this.getLeaderboardTitle(leaderboard.weatherCondition, leaderboard.validCondition, v),
          times: this.times.filter(t => this.checkFilter({f: t.valid, s: leaderboard.validCondition}, {f: t.game, s: v}, {f: t.weather, s: leaderboard.weatherCondition})),
          weatherCondition: leaderboard.weatherCondition,
          validCondition: leaderboard.validCondition,
          gameCondition: v
        });
      });
      remove.push(leaderboard);
    });
    add = this.removeDuplicates(add);
    
    this.leaderboards = this.removeLeaderboards(remove);
    this.leaderboards = this.leaderboards.concat(add);
  }

  getLeaderboardTitle(weatherCondition: string | undefined, validCondition: boolean | undefined, gameCondition: string | undefined): string { 
    const gameText: string = gameCondition ?? '';
    const validText: string = validCondition == undefined ? '' : validCondition ? 'Valid' : 'Invalid';
    return `${gameText} ${weatherCondition ?? ''} ${validText}`.trim();
  }

  removeLeaderboards(remove: Leaderboard[]): Leaderboard[] {
    const ret: Leaderboard[] = [];
    this.leaderboards.forEach(l => {
      if(remove.findIndex(r => r.toString() === l.toString()) == -1)
        ret.push(l);
    });
    return ret;
  }

  checkFilter(...conditions: Pair[]): boolean {
    return conditions.every(({f: value, s: correct}) => correct === undefined || value === correct);
  }

  addDefaultLeaderboardIfEmpty(): void {
    this.leaderboards = this.leaderboards.filter(l => l.name !== '');
    if(this.leaderboards.length == 0)
      this.leaderboards = [{ name: '', times: this.times }];
  }

  includes(split: Split): boolean {
    return this.splitSettings.some(s => s.split === split);
  }

  selected(split: Split): boolean {
    return this.splitSettings.some(s => s.split === split && s.selected);
  }
}
