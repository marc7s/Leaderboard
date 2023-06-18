import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { Config, Country, Game, Setup, Token,  Track,  Tyre,  User, Weather } from '@shared/api';
import { finalize } from 'rxjs/operators';
import { AuthenticTrackRecord, LapRecord, TimeSummary, TrackSummary } from '@shared/dataStructures';

interface RequestConfigParam {
  endPoint: APIEndPoint,
  relativePath: string,
  waitFor: boolean,
  params?: HttpParams,
  headers?: HttpHeaders,
  payload?: any
}

interface RequestConfig {
  endPoint: APIEndPoint,
  relativePath: string,
  waitFor: boolean,
  params: HttpParams,
  headers: HttpHeaders,
  payload: any
}

enum APIEndPoint { BACKEND, AUTOTIME };

enum HttpRequestTypes { GET, POST };

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient) {
  }

  private loadingSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);
  public LOADING = this.loadingSubject.asObservable();
  private waitingList: any[] = [];

  private getEndPointUrl(endPoint: APIEndPoint): string {
    switch (endPoint) {
      case APIEndPoint.BACKEND: return isDevMode() ? 'http://localhost:5001/api/' : 'https://leaderboard-api.schagerberg.com/api/';
      case APIEndPoint.AUTOTIME: return isDevMode() ? 'http://localhost:5002/api/' : 'https://leaderboard-autotime.schagerberg.com/api/';
    }
  }

  public getLocalToken(): Token | null {
    const token: string | null = localStorage.getItem('token');
    const exp: string | null = localStorage.getItem('expires');
    if(token && exp){
      return {
        jwt: token,
        expires: parseInt(exp)
      }
    }
    return null;
  }

  private addToWaitingList(entry: any) {
    this.waitingList.push(entry);
    this.loadingSubject.next(this.waitingList.length > 0);
  }

  private removeFromWaitingList(entry: any) {
    this.waitingList = this.waitingList.filter(e => e !== entry);
    this.loadingSubject.next(this.waitingList.length > 0);
  }

  private _get(config: RequestConfig): Observable<any> {
    const url = new URL(config.relativePath, this.getEndPointUrl(config.endPoint));
    const token: Token | null = this.getLocalToken();
    const headers = token ? config.headers.set('authorization', `Bearer ${token.jwt}`) : config.headers;
    return this.http.get(url.href, { headers: headers, params: config.params, responseType: 'json' });
  }

  private _post(config: RequestConfig): Observable<any> {
    const url = new URL(config.relativePath, this.getEndPointUrl(config.endPoint));
    const token: Token | null = this.getLocalToken();
    const headers = token ? config.headers.set('authorization', `Bearer ${token.jwt}`) : config.headers;
    return this.http.post(url.href, config.payload, { headers: headers.set('Content-Type', 'application/json'), params: config.params, responseType: 'json' });
  }

  private request(rt: HttpRequestTypes, config: RequestConfigParam): Observable<any> {
    const requestConfig = {
      endPoint: config.endPoint,
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

  getToken(username: string, password: string): Observable<Token> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/get-token',
      waitFor: true,
      payload: {
        username: username,
        password: password
      }
    };
    return this.post(config);
  }

  checkAutoTimeRunning(): Observable<User | null> {
    const reqParams: HttpParams = new HttpParams();
    const config = {
      endPoint: APIEndPoint.AUTOTIME,
      relativePath: 'ping',
      waitFor: true,
      params: reqParams
    };
    return this.get(config);
  }

  setAutoTimeCurrentUser(user: User): Observable<number> {
    const config = {
      endPoint: APIEndPoint.AUTOTIME,
      relativePath: 'set-current-user',
      waitFor: true,
      payload: {
        userID: user.id,
        username: user.username
      }
    };
    return this.post(config);
  }

  getAutoTimeSessionTimes(): Observable<TimeSummary[]> {
    const reqParams: HttpParams = new HttpParams();
    const config = {
      endPoint: APIEndPoint.AUTOTIME,
      relativePath: 'get-last-session-times',
      waitFor: true,
      params: reqParams
    };
    return this.get(config);
  }

  getUserTimesFromUsername(username: string): Observable<TrackSummary[]> {
    const reqParams: HttpParams = new HttpParams().set('name', username);
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/get-user-times',
      waitFor: true,
      params: reqParams
    };
    return this.get(config);
  }

  getTrackSummary(shortName: string): Observable<TrackSummary> {
    const reqParams: HttpParams = new HttpParams().set('shortName', shortName);
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/get-track-summary',
      waitFor: true,
      params: reqParams
    };
    return this.get(config);
  }

  getUsers(): Observable<User[]> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/get-users',
      waitFor: true
    };
    return this.get(config);
  }

  getUserConfigs(): Observable<Config[]> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/get-user-configs',
      waitFor: true
    };
    return this.get(config);
  }

  getGames(): Observable<Game[]> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/get-games',
      waitFor: true
    };
    return this.get(config);
  }

  getTracks(): Observable<Track[]> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/get-tracks',
      waitFor: true
    };
    return this.get(config);
  }

  getCars(): Observable<Track[]> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/get-cars',
      waitFor: true
    };
    return this.get(config);
  }

  getWeathers(): Observable<Weather[]> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/get-weathers',
      waitFor: true
    };
    return this.get(config);
  }

  getTyres(): Observable<Tyre[]> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/get-tyres',
      waitFor: true
    };
    return this.get(config);
  }

  getSetups(): Observable<Setup[]> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/get-setups',
      waitFor: true
    };
    return this.get(config);
  }

  getCountries(): Observable<Country[]> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/get-countries',
      waitFor: true
    };
    return this.get(config);
  }

  getRecords(): Observable<LapRecord[]> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/get-records',
      waitFor: true
    };
    return this.get(config);
  }

  getUser(): Observable<User> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/me',
      waitFor: true
    };
    return this.get(config);
  }

  getAuthenticTrackRecord(trackID: number): Observable<AuthenticTrackRecord | null> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/get-authentic-track-record',
      waitFor: true,
      payload: {
        trackID: trackID
      }
    };
    return this.post(config);
  }

  getNumberOfRecordsFromUsername(username: string): Observable<number | null> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/get-number-of-records',
      waitFor: true,
      payload: {
        name: username
      }
    };
    return this.post(config);
  }

  addTimeWithConfig(configID: number, userID: number, time: string, valid: boolean): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/add-time',
      waitFor: true,
      payload: {
        configID: configID,
        userID: userID,
        time: time,
        valid: valid
      }
    };
    return this.post(config);
  }

  addTime(userID: number, gameID: number, trackID: number, carID: number, weatherID: number, tyreID: number, setupID: number, time: string, valid: boolean): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/add-time',
      waitFor: true,
      payload: {
        userID: userID,
        gameID: gameID,
        trackID: trackID,
        carID: carID,
        weatherID: weatherID,
        tyreID: tyreID,
        setupID: setupID,
        time: time,
        valid: valid
      }
    };
    return this.post(config);
  }

  updateCar(carID: number, shortName: string, fullName: string): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/update-car',
      waitFor: true,
      payload: {
        carID: carID,
        shortName: shortName,
        fullName: fullName
      }
    };
    return this.post(config);
  }

  createCar(shortName: string, fullName: string): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/create-car',
      waitFor: true,
      payload: {
        shortName: shortName,
        fullName: fullName
      }
    };
    return this.post(config);
  }

  updateGame(gameID: number, name: string): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/update-game',
      waitFor: true,
      payload: {
        gameID: gameID,
        name: name
      }
    };
    return this.post(config);
  }

  createGame(name: string): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/create-game',
      waitFor: true,
      payload: {
        name: name
      }
    };
    return this.post(config);
  }

  updateTyre(tyreID: number, shortName: string, fullName: string): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/update-tyre',
      waitFor: true,
      payload: {
        tyreID: tyreID,
        shortName: shortName,
        fullName: fullName
      }
    };
    return this.post(config);
  }

  createTyre(shortName: string, fullName: string): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/create-tyre',
      waitFor: true,
      payload: {
        shortName: shortName,
        fullName: fullName
      }
    };
    return this.post(config);
  }

  updateUser(userID: number, username: string): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/update-user',
      waitFor: true,
      payload: {
        userID: userID,
        name: username
      }
    };
    return this.post(config);
  }

  createUser(username: string): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/create-user',
      waitFor: true,
      payload: {
        name: username
      }
    };
    return this.post(config);
  }

  updateWeather(weatherID: number, name: string): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/update-weather',
      waitFor: true,
      payload: {
        weatherID: weatherID,
        name: name
      }
    };
    return this.post(config);
  }

  createWeather(name: string): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/create-weather',
      waitFor: true,
      payload: {
        name: name
      }
    };
    return this.post(config);
  }

  updateTrack(trackID: number, countryID: number, shortName: string, fullName: string): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/update-track',
      waitFor: true,
      payload: {
        trackID: trackID,
        countryID: countryID,
        shortName: shortName,
        fullName: fullName
      }
    };
    return this.post(config);
  }

  createTrack(countryID: number, shortName: string, fullName: string): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/create-track',
      waitFor: true,
      payload: {
        countryID: countryID,
        shortName: shortName,
        fullName: fullName
      }
    };
    return this.post(config);
  }

  updateCountry(countryID: number, shortName: string, fullName: string, alpha2Code: string): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/update-country',
      waitFor: true,
      payload: {
        countryID: countryID,
        shortName: shortName,
        fullName: fullName,
        alpha2Code: alpha2Code
      }
    };
    return this.post(config);
  }

  createCountry(shortName: string, fullName: string, alpha2Code: string): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/create-country',
      waitFor: true,
      payload: {
        shortName: shortName,
        fullName: fullName,
        alpha2Code
      }
    };
    return this.post(config);
  }

  updateConfig(configID: number, description: string, gameID: number, trackID: number, carID: number, weatherID: number, tyreID: number, customSetup: boolean): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/update-config',
      waitFor: true,
      payload: {
        configID: configID,
        description: description,
        gameID: gameID,
        trackID: trackID,
        carID: carID,
        weatherID: weatherID,
        tyreID: tyreID,
        customSetup: customSetup
      }
    };
    return this.post(config);
  }

  createConfig(description: string, gameID: number, trackID: number, carID: number, weatherID: number, tyreID: number, customSetup: boolean): Observable<boolean> {
    const config = {
      endPoint: APIEndPoint.BACKEND,
      relativePath: 'db/create-config',
      waitFor: true,
      payload: {
        description: description,
        gameID: gameID,
        trackID: trackID,
        carID: carID,
        weatherID: weatherID,
        tyreID: tyreID,
        customSetup: customSetup
      }
    };
    return this.post(config);
  }
}
