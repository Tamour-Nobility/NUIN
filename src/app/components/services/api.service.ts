import { Observable, throwError as observableThrowError, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CountAssignedtasks } from '../../models/auth/auth';
declare var swal: any;

@Injectable()
export class APIService {
    //countassigned: CountAssignedtasks[];
    count:any=0;
    
    constructor(private httpClient: HttpClient,
        public Gv: GvarsService,
        private router: Router,
        private spinner: NgxSpinnerService) {
            //this.countassigned=[];
           // this.GetUsers();
    }


    

    downloadFile(url: string): any {
        this.spinner.show();
        return this.httpClient.get(environment.baseUrl + url, { responseType: 'blob' }).pipe(
            map(data => {
                this.spinner.hide();
                return <any>data;
            }), catchError(e => this.HttpErrHandler(e)));
    }

    downloadFilePost(url: string, body: any): any {
        this.spinner.show();
        return this.httpClient.post(environment.baseUrl + url, body, { responseType: 'blob' }).pipe(
            map(data => {
                this.spinner.hide();
                return <any>data;
            }), catchError(e => this.HttpErrHandler(e)));
    }

    getData(url: string) {
        this.spinner.show();
        return this.httpClient.get<any>(environment.baseUrl + url).pipe(
            map(data => {
                this.spinner.hide();
                return <any>data;
            }), catchError(e => this.HttpErrHandler(e)));
            
    }


        getTicketData(url: string) {
        return this.httpClient.get<any>(environment.baseUrl + url).pipe(
            map(data => {
                return <any>data;
            }), catchError(e => this.HttpErrHandler(e)));
            
    }


    getDataUser(url: string){
        this.spinner.show();
        return this.httpClient.get<any>(environment.baseUrl + url).pipe(
            map(data => {
          
                return <any>data;
            }), catchError(e => this.HttpErrHandler(e)));
    }

    PostData(url: string, data, cb, options?) {
        
        this.spinner.show();
        if (options == null) {
            return this.httpClient.post(environment.baseUrl + url, data).subscribe
                (data => {
                    this.spinner.hide();
                    cb(JSON.parse(JSON.stringify(data)));
                },
                    error => this.HttpErrHandler(error)
                );
        }
        else {
            return this.httpClient.post(environment.baseUrl + url, data, options).subscribe
                (data => {
                    this.spinner.hide();
                    cb(JSON.parse(JSON.stringify(data)));
                },
                    error => this.HttpErrHandler(error)
                );
        }
    }
    getDataWithoutSpinner(url: string) {
        return this.httpClient.get<any>(environment.baseUrl + url).pipe(
            map(data => {
                this.spinner.hide();
                return <any>data;
            }), catchError(e => this.HttpErrHandler(e)));
    }

    PostDataWithoutSpinner(url: string, data, cb) {
        return this.httpClient.post(environment.baseUrl + url, data).subscribe
            (data => {
                this.spinner.hide();
                cb(JSON.parse(JSON.stringify(data)));
            },
                error => this.HttpErrHandler(error)
            );
    }

    PostDataWithoutSpinnerERA(url: string, data, cb) {
        return this.httpClient.post(environment.baseUrl + url, data).subscribe
            (data => {
                this.spinner.hide();
                cb(JSON.parse(JSON.stringify(data)));
            },
                error => {
                    localStorage.setItem('ERAInProcess', JSON.stringify(false))
                    console.log("ERA error",error)
                    this.HttpErrHandler(error);
                    
                }
            );
    }

    HttpErrHandler(res) {
        let errMsg;
        if (res.status === 404) {
            // do NotFound stuff here
            errMsg = 'NotFound Http Error ';
        }
        else if (res.status === 401) {
            // do Unauthorized stuff here
            this.spinner.hide();
            errMsg = 'Unauthorized user .. please login to continue ';
            return this.router.navigate(['/login']);
        }
        else { errMsg = res.status + ' unknown Http Error'; }
        return observableThrowError(errMsg);
    }

    ParseArr(arr, def) {
        return arr ? (typeof arr == 'string') ? JSON.parse(arr) : arr : def
    }

    confirmFun(t, b, cb) {
        swal({
            title: t,
            text: b,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No, keep it'
        }).then(() => { if (cb) { cb(); } }, () => { });
    }

    deleteRows(rowIds: number[]) {
        debugger
        const apiUrl = '/demographic/deleteRows'; // Replace with your actual API endpoint
        return this.httpClient.post(apiUrl, { ids: rowIds }).pipe(
          catchError((error) => {
            console.error('Error during deletion', error);
            return throwError(error);
          })
        );
      }


      
}
