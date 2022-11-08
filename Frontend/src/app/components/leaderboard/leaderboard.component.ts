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
  
  ValidSplitSetting: SplitSetting = { split: this.ValidSplit, selected: false };
  WeatherSplitSetting: SplitSetting = { split: this.WeatherSplit, selected: false };

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
          name: this.getLeaderboardTitle(w, leaderboard.validCondition),
          times: this.times.filter(t => this.checkFilter({f: t.weather, s: w}, {f: t.valid, s: leaderboard.validCondition})),
          weatherCondition: w,
          validCondition: leaderboard.validCondition
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
          name: this.getLeaderboardTitle(leaderboard.weatherCondition, v),
          times: this.times.filter(t => this.checkFilter({f: t.valid, s: v}, {f: t.weather, s: leaderboard.weatherCondition})),
          weatherCondition: leaderboard.weatherCondition,
          validCondition: v
        });
      });
      remove.push(leaderboard);
    });
    add = this.removeDuplicates(add);
    
    this.leaderboards = this.removeLeaderboards(remove);
    this.leaderboards = this.leaderboards.concat(add);
  }

  getLeaderboardTitle(weatherCondition: string | undefined, validCondition: boolean | undefined): string { 
    const validText: string = validCondition == undefined ? '' : validCondition ? 'Valid' : 'Invalid';
    return `${weatherCondition ?? ''} ${validText}`.trim();
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
