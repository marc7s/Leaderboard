import { Injectable } from '@angular/core';
import { User, Token } from '@shared/api';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private api: ApiService) { }

  getUser(): Observable<User> {
    return this.api.getUser();
  }
}
