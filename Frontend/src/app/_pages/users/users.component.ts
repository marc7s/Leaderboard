import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';

interface UserAndLink {
  username: string;
  link: string;
};

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass']
})



export class UsersComponent implements OnInit {

  users: UserAndLink[] = [];

  constructor(private api: ApiService) { 
    this.api.getUsers().subscribe(users => {
      const usersAndLinks: UserAndLink[] = users.map(user => {return { username: user.username, link: encodeURI(user.username) }});
      this.users = usersAndLinks;
    });
  }

  ngOnInit(): void {
  }

}
