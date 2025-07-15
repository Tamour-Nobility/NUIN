import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError, switchMap, finalize, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class JWTInterceptors implements HttpInterceptor {

    private isTokenRefreshing: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    constructor(private authService: AuthService,
        private spinner: NgxSpinnerService,
        private toastService: ToastrService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('/Token/Auth')) { 
            return next.handle(req).pipe(
                
                catchError(
                    e => 
                    this.HttpErrHandler(e)))
        }
        return next.handle(this.attachTokenRequest(req)).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                }
            }),
             catchError((err): Observable<any> => {
                if (err instanceof HttpErrorResponse) {
                    switch ((<HttpErrorResponse>err).status) {
                        case 401: {
                            this.spinner.hide();
                            return this.handleHttpResponseError(req, next);
                        }
                        case 400: {
                            this.spinner.hide();
                        }
                        case 404: {
                            this.spinner.hide();
                            this.toastService.error(err.statusText, err.status + "");
                        }
                        case 500: {
                            this.spinner.hide();
                            this.toastService.error(err.statusText, err.status + "");
                        }
                        default: {
                            this.spinner.hide();
                        }
                    }
                } else {
                    return throwError(this.handleError(err.statusCode));
                }
            })
        )
    }

    private handleError(errorResponse: any): Observable<any> {
        let errMsg: string;
        if (errorResponse.error instanceof Error) {
            errMsg = "An error occurred: " + errorResponse.err.message;
        } else {
            errMsg = `Backend returned code ${errorResponse.status}, body was:${errorResponse.error}`;
        }
        return throwError(errMsg);
    }

    private handleHttpResponseError(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.tokenSubject.next(null);
            return this.authService.GetNewRefreshToken().pipe(
                switchMap((tokenResponse: any) => {
                    if (tokenResponse) {
                        this.tokenSubject.next(tokenResponse.Access_Token);
                        localStorage.setItem('loginStatus', '1');
                        localStorage.setItem('jwt', tokenResponse.Access_Token);
                        localStorage.setItem('username', tokenResponse.Username);
                        localStorage.setItem('refreshToken', tokenResponse.Refresh_Token);
                        return next.handle(this.attachTokenRequest(req));
                    }
                    return <any>this.authService.Logout();
                }), catchError(err => {
                    this.authService.Logout();
                    return this.handleError(err);
                }), finalize(() => {
                    this.isTokenRefreshing = false;
                })
            )
        } else {
            this.isTokenRefreshing = false;
            return this.tokenSubject.pipe(filter(token => token != null), take(1), switchMap(token => {
                return next.handle(this.attachTokenRequest(req));
            }));
        }
    }
    HttpErrHandler(res) {
        console.log(res.status)
  
        let errMsg;
   
        if (res.status === 404) {
          errMsg = 'NotFound Http Error ';
        }
        else if (res.status === 401) {
    
          errMsg = 'Invalid username or password';
        }
        else if(res.error.Message != null){
            errMsg=res.error.Message;
             return throwError(errMsg);
        }
        
        else { errMsg = res.status + ' Unknown Http Error'; }
        return throwError(res.status);
      }
    private attachTokenRequest(req: HttpRequest<any>): HttpRequest<any> {
        var token = localStorage.getItem('jwt');
        if (req.url.includes('Token/Auth')) {
            return req.clone({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Headers': '*',
                })
            })
        }
        if (req.url.includes('/Demographic/UploadImage') || req.url.includes('/patientattachments/Attach')||
        req.url.includes('/patientattachments/UploadFiles')||
        req.body instanceof FormData ) {
            return req.clone({
                headers: new HttpHeaders({
                    'Authorization': `Bearer ${token}`,
                    //'Content-Type': 'multipart/form-data',
                })
            });
        }
        return req.clone({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
                'Authorization': `Bearer ${token}`
            })
        });
    }
}