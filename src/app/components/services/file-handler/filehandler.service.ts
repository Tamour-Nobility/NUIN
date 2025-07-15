import { Observable, throwError as observableThrowError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GvarsService } from '../../../services/G_vars/gvars.service';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FileHandlerService {

    constructor(private http: HttpClient,
        private Gv: GvarsService,
        private router: Router,) {
    }

    UploadFile(data, url) {
        debugger
        console.log('check data here for attachments',data,url)
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'multipart/form-data'
            })
          };
           console.log('check data here for patient attachments', data, url)
        url = `${environment.baseUrl}${url}`;
        debugger;
        return this.http.post<any>(url, data,httpOptions).pipe(
            map(data => {
                return <any>data;
            }), catchError(e => this.HttpErrHandler(e)));
    }
    HttpErrHandler(res) {
        let errMsg;
        if (res.status === 404) {
            // do NotFound stuff here
            errMsg = 'NotFound Http Error ';
        }
        else if (res.status === 401) {
            // do Unauthorized stuff here
            errMsg = 'Unauthorized user .. please login to continue ';
            return this.router.navigate(['/login']);
        }
        else { errMsg = res.status + ' unknown Http Error'; }
        return observableThrowError(errMsg);
    }

}