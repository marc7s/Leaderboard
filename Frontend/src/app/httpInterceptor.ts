import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';

import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.error instanceof Error) {
                    // A client-side or network error occurred. Handle it accordingly.
                    this.router.navigate(['error'], { state: { message: 'HTTP Error', error: error.error } });
                } else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong
                    let errorObj = (error.error.errorMessage) ? error.error.errorMessage : error.error;
                    this.router.navigate(['error'], { state: { message: `HTTP Backend Error: code ${error.status}`, error: errorObj } });
                }
                return EMPTY;
            })
        );
    }
}