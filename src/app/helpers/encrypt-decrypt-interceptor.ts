import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { EncryptDecryptService } from '../services/encrypt-decrypt.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { from, of, throwError } from 'rxjs';

@Injectable()
export class EncryptDecryptAuthInterceptor implements HttpInterceptor {
    constructor(private encryptDecryptService: EncryptDecryptService, ) {}
    // If you want to some exclude api call from Encryption then add here like that.
    // environment.basUrl is your API URL
    ExcludeURLList = [
        environment.baseUrl + "/Common/commonFileuploaddata",
        environment.baseUrl + "/Users/UploadProfilePicture",
        environment.baseUrl + "/Common/downloadattachedfile",
        environment.baseUrl + "/patientattachments/Attach",
        environment.baseUrl + "/patientattachments/UploadFiles",
        environment.baseUrl + "/patientattachments/GetAll",
        environment.baseUrl + "/patientattachments/GetAttachmentCodeList",
        environment.baseUrl + "/ERA/Import",
        environment.baseUrl + "/ERA/WeekHistoryOfERA",
        
    ];

    intercept(req: HttpRequest < any > , next: HttpHandler): Observable < HttpEvent < any >> {
       
        let exludeFound = this.ExcludeURLList.filter(element => {
            return (req.url).includes(element)
        });


        // We have Encrypt the GET and POST call before pass payload to API
        if (!( exludeFound.length > 0)) {
            if (req.method == "GET") {
                if (req.url.indexOf("?") > 0) {
                    let encriptURL = req.url.substr(0, req.url.indexOf("?") + 1) + this.encryptDecryptService.encryptUsingAES256(req.url.substr(req.url.indexOf("?") + 1, req.url.length));
                    const cloneReq = req.clone({
                        url: encriptURL
                    });
                    return next.handle(cloneReq).pipe(
                        
                        tap((event: HttpEvent<any>) => {
                        
                            if (event instanceof HttpResponse) {
                                
                            }
                        }),catchError((err): Observable<any> => {
                            if (err instanceof HttpErrorResponse) {
                                        
                            } else {
                                return throwError(err);
                            }
                        })
                    );
                }
                return next.handle(req);
            } 
            else  if (req.method == "POST") {
                if (req.body || req.body.length > 0) {
                    const cloneReq = req.clone({
                        body: this.encryptDecryptService.encryptUsingAES256(req.body)
                    });
             
                    return next.handle(cloneReq).pipe(
                        tap((event: HttpEvent<any>) => {
                            if (event instanceof HttpResponse) {
                             
                            }
                        }), catchError((err): Observable<any> => {
                            if (err instanceof HttpErrorResponse) {
                                
                            
                            } else {
                                return throwError(err);
                            }
                        })
                    )
                //     return next.handle(cloneReq).pipe(
                //         switchMap((data) => next.handle(data)),
                //         switchMap((event) =>
                //           event instanceof HttpResponse
                //             ? from(this.encryptDecryptService.encryptUsingAES256(event))
                //             : of(event)
                //         )
                //       );
                // }
                let data = req.body as FormData;
                return next.handle(req);
            }
        }
        else{
            return next.handle(req);
        }
        
       
    }
    return next.handle(req);
   
    }
   

}