import { Component, OnInit } from '@angular/core';
import { Game } from '@shared/api';
import { ApiService } from 'src/app/api.service';
import { OptionNumber } from 'src/app/option';

@Component({
  selector: 'app-edit-games',
  templateUrl: './edit-games.component.html',
  styleUrls: ['./edit-games.component.sass']
})
export class EditGamesComponent implements OnInit {

  gameID: number | null = null;
  gameOptions: OptionNumber[] = [];
  games: Game[] = [];

  name: string | null = null;

  constructor(private api: ApiService) { 
    this.setup();
  }

  setup(): void { 
    this.api.getGames().subscribe(games => {
      this.games = games;
      this.gameOptions = games.map(g => ({ value: g.id, display: g.name }));
    });
  }

  ngOnInit(): void {
  }

  clear() : void {
    this.gameID = null;
    this.name = null;
  }

  selectGame(): void {
    const game = this.games.find(g => g.id == this.gameID);
    if(game) { 
      this.gameID = game.id;
      this.name = game.name;
    }
  }

  save(): void {
    if(this.name) {
      if(this.gameID) {
        this.api.updateGame(this.gameID, this.name).subscribe(() => {
          this.clear();
          this.setup();
        });
      } else {
        this.api.createGame(this.name).subscribe(() => {
          this.clear();
          this.setup();
        });
      }
    }
  }

}
