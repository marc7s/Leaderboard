import { Component, OnInit } from '@angular/core';
import { Navigation, Router } from '@angular/router';
import { Color, Red } from 'src/app/color';
import { Size } from 'src/styleSettings';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.sass']
})
export class ErrorComponent implements OnInit {

  Large: Size = Size.Large;
  RedColor: Color = Red;

  message?: string;
  error: string = '';

  constructor(private router: Router) {
    let nav: Navigation | null = this.router.getCurrentNavigation();

    if(nav && nav.extras && nav.extras.state && nav.extras.state.message){
      this.message = nav.extras.state.message;
      if(nav.extras.state.error)
        this.error = JSON.stringify(nav.extras.state.error, null, 2);
    }
  }

  ngOnInit(): void {
  }
}
