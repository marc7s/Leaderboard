import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { User } from '@shared/api';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  public user!: User;

  constructor(public auth: AuthService, public userService: UserService, public router: Router) { }

  canActivate(): boolean | Observable<boolean> {
    if(!this.auth.isLoggedIn()) {
      this.router.navigate(['login']);
      return false;
    }
    return new Observable<boolean>(observer => {
      let token = this.auth.getToken();
      if(token) {
        this.userService.getUser(token).toPromise()
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
