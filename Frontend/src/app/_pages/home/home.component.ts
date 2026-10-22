import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Page } from 'src/app/page';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
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
