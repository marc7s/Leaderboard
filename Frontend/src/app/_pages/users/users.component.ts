import { Component, OnInit } from '@angular/core';
import { User } from '@shared/api';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass']
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  constructor(private api: ApiService) { 
    this.api.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  ngOnInit(): void {
  }

}
