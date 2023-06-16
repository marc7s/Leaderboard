import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Color, Red } from 'src/app/color';
import { Page } from 'src/app/page';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {

  pages: Page[] = [
    { link: '/autotime-dashboard', name: 'AutoTime Dashboard' },
    { link: '/add-time', name: 'Add time' },
    { link: '/edit-cars', name: 'Edit cars' },
    { link: '/edit-configs', name: 'Edit configs' },
    { link: '/edit-games', name: 'Edit games' },
    { link: '/edit-tracks', name: 'Edit tracks' },
    { link: '/edit-tyres', name: 'Edit tyres' },
    { link: '/edit-users', name: 'Edit users' },
    { link: '/edit-weathers', name: 'Edit weathers' },
    { link: '/edit-countries', name: 'Edit countries' }
  ];

  redColor: Color = Red;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.auth.logout();
  }

}
