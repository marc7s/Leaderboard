import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
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

  constructor(private router: Router, private http: HttpClient, private api: ApiService) {}

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

  getToken(): Token | null {
    let token: string | null = localStorage.getItem('token');
    let exp: string | null = localStorage.getItem('expires');
    if(token && exp){
      return {
        jwt: token,
        expires: parseInt(exp)
      }
    }
    return null;
  }

  logout(logoutReason?: LogoutReason): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
    this.router.navigate(['login'], { state: { reason: logoutReason ?? LogoutReason.Inactivity } });
  }

  isLoggedIn(): boolean {
    let exp: string | null = localStorage.getItem('expires');
    if(exp !== null){
      let expDate: number = parseInt(exp);

      if(expDate !== NaN)
        return Date.now() < expDate;
    }

    return false;
  }
}