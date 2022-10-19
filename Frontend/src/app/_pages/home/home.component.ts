import { Component, OnInit } from '@angular/core';

interface Page {
  link: string,
  name: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  pages: Page[] = [
    { link: '/tracks', name: 'Tracks' }, 
    { link: '/users', name: 'Users' },
    { link: '/records', name: 'Records' } 
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
