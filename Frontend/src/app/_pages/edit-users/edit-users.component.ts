import { Component, OnInit } from '@angular/core';
import { User } from '@shared/api';
import { ApiService } from 'src/app/api.service';
import { Option } from 'src/app/option';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.sass']
})
export class EditUsersComponent implements OnInit {

  userID: number | null = null;
  userOptions: Option[] = [];
  users: User[] = [];

  name: string | null = null;

  constructor(private api: ApiService) { 
    this.setup();
  }

  setup(): void {
    this.api.getUsers().subscribe(users => {
      this.users = users;
      this.userOptions = users.map(g => ({ value: g.id, display: g.username }));
    });
  }

  ngOnInit(): void {
  }

  clear() : void {
    this.userID = null;
    this.name = null;
  }

  selectUser(): void {
    const user = this.users.find(g => g.id == this.userID);
    if(user) { 
      this.userID = user.id;
      this.name = user.username;
    }
  }

  save(): void {
    if(this.name) {
      if(this.userID) {
        this.api.updateUser(this.userID, this.name).subscribe(() => {
          this.clear();
          this.setup();
        });
      } else {
        this.api.createUser(this.name).subscribe(() => {
          this.clear();
          this.setup();
        });
      }
    }
  }

}
