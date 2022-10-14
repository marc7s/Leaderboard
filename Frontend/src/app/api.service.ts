import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { Config, Game, Token,  Track,  Tyre,  User, Weather } from '@shared/api';
import { finalize } from 'rxjs/operators';
import { Time } from '@shared/api';
import { TimeSummary, TrackSummary } from '@shared/dataStructures';

interface RequestConfigParam {
  relativePath: string,
  waitFor: boolean,
  params?: HttpParams,
  headers?: HttpHeaders,
  payload?: any
}

interface RequestConfig {
  relativePath: string,
  waitFor: boolean,
  params: HttpParams,
  headers: HttpHeaders,
  payload: any
}

enum HttpRequestTypes { GET, POST };

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private router: Router, private http: HttpClient) {
  }

  private loadingSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);
  public LOADING = this.loadingSubject.asObservable();
  private waitingList: any[] = [];

  private apiEndpoint: string = 'http://localhost:5000/api/';

  private addToWaitingList(entry: any) {
    this.waitingList.push(entry);
    this.loadingSubject.next(this.waitingList.length > 0);
  }

  private removeFromWaitingList(entry: any) {
    this.waitingList = this.waitingList.filter(e => e !== entry);
    this.loadingSubject.next(this.waitingList.length > 0);
  }

  private _get(config: RequestConfig): Observable<any> {
    const url = new URL(config.relativePath, this.apiEndpoint);
    return this.http.get(url.href, { headers: config.headers, params: config.params, responseType: 'json' });
  }

  private _post(config: RequestConfig): Observable<any> {
    const url = new URL(config.relativePath, this.apiEndpoint);
    return this.http.post(url.href, config.payload, { headers: config.headers.set('Content-Type', 'application/json'), params: config.params, responseType: 'json' });
  }

  private request(rt: HttpRequestTypes, config: RequestConfigParam): Observable<any> {
    const requestConfig = {
      relativePath: config.relativePath,
      waitFor: config.waitFor,
      params: config.params ?? new HttpParams(),
      headers: config.headers ?? new HttpHeaders(),
      payload: config.payload ?? null
    };
    const ret = rt == HttpRequestTypes.GET ? this._get(requestConfig)
                : this._post(requestConfig);
    const id = `${Date.now()}-${Math.random()}`;
    if (requestConfig.waitFor) this.addToWaitingList(id);
    return ret.pipe(
      finalize(() => {
        if(requestConfig.waitFor) this.removeFromWaitingList(id);
      })
    );
  }

  private get(config: RequestConfigParam) {
    return this.request(HttpRequestTypes.GET, config);
  }

  private post(config: RequestConfigParam) {
    return this.request(HttpRequestTypes.POST, config);
  }

  private getAuthHeader(token: Token): HttpHeaders {
    const headers: HttpHeaders = new HttpHeaders().set('authorization', `Bearer ${token.jwt}`);
    return headers;
  }

  getToken(username: string, password: string): Observable<Token> {
    const config = {
      relativePath: 'db/get-token',
      waitFor: true,
      payload: {
        username: username,
        password: password
      }
    };
    return this.post(config);
  }

  getUserTimes(username: string): Observable<TimeSummary[]> {
    const reqParams: HttpParams = new HttpParams().set('username', username);
    const config = {
      relativePath: 'db/get-user-times',
      waitFor: true,
      params: reqParams
    };
    return this.get(config);
  }

  getTrackSummary(shortName: string): Observable<TrackSummary> {
    const reqParams: HttpParams = new HttpParams().set('shortName', shortName);
    const config = {
      relativePath: 'db/get-track-summary',
      waitFor: true,
      params: reqParams
    };
    return this.get(config);
  }

  getUsers(): Observable<User[]> {
    const config = {
      relativePath: 'db/get-users',
      waitFor: true
    };
    return this.get(config);
  }

  getConfigs(): Observable<Config[]> {
    const config = {
      relativePath: 'db/get-configs',
      waitFor: true
    };
    return this.get(config);
  }

  getGames(): Observable<Game[]> {
    const config = {
      relativePath: 'db/get-games',
      waitFor: true
    };
    return this.get(config);
  }

  getTracks(): Observable<Track[]> {
    const config = {
      relativePath: 'db/get-tracks',
      waitFor: true
    };
    return this.get(config);
  }

  getCars(): Observable<Track[]> {
    const config = {
      relativePath: 'db/get-cars',
      waitFor: true
    };
    return this.get(config);
  }

  getWeathers(): Observable<Weather[]> {
    const config = {
      relativePath: 'db/get-weathers',
      waitFor: true
    };
    return this.get(config);
  }

  getTyres(): Observable<Tyre[]> {
    const config = {
      relativePath: 'db/get-tyres',
      waitFor: true
    };
    return this.get(config);
  }

  getUser(token: Token): Observable<User> {
    const config = {
      relativePath: 'db/me',
      waitFor: true,
      headers: this.getAuthHeader(token)
    };
    return this.get(config);
  }
}
