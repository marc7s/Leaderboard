import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from '@shared/api';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { LogoutReason } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private api: ApiService) {}

  private setSession(token: Token): void {
    localStorage.setItem('token', token.jwt);
    localStorage.setItem('expires', token.expires.toString());
  }

  private loginGetToken(username: string, password: string): Observable<Token> {
    return this.api.getToken(username, password);
  }

  loginWithUsername(username: string, password: string): Observable<boolean> {
    return this.loginGetToken(username, password).pipe(
      switchMap((auth) => {
        this.setSession(auth);
        return of(true);
      })
    );
  }

  logout(logoutReason?: LogoutReason): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
    this.router.navigate(['login'], { state: { reason: logoutReason ?? LogoutReason.Inactivity } });
  }

  isLoggedIn(): boolean {
    const exp: string | null = localStorage.getItem('expires');
    if(exp !== null){
      const expDate: number = parseInt(exp);

      if(!Number.isNaN(expDate))
        return Date.now() < expDate;
    }

    return false;
  }
}