import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@shared/api';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService  {

  public user!: User;

  constructor(public auth: AuthService, public userService: UserService, public router: Router, public api: ApiService) { }

  canActivate(): boolean | Observable<boolean> {
    if(!this.auth.isLoggedIn()) {
      this.router.navigate(['login']);
      return false;
    }
    return new Observable<boolean>(observer => {
      const token = this.api.getLocalToken();
      if(token) {
        this.userService.getUser().toPromise()
        .then(user => {
          this.user = user;
          observer.next(true);
          observer.complete();
        });
      }else {
        observer.next(false);
        observer.complete();
      }
    });
  }
}
